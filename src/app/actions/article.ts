'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import type { ArticleStatus } from '@/lib/types'

export type SaveArticleState = {
    message?: string
    error?: string
    id?: string
}

export async function saveArticleAction(
    id: string | null,
    payload: any,
    manual: boolean = false
): Promise<SaveArticleState> {
    try {
        const supabase = await createServerSupabaseClient()

        // Timeout safeguard
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            clearTimeout(timeoutId)
            return { error: 'Unauthorized: Harap login kembali.' }
        }

        const slug = id && payload.status === 'published' ? undefined : (slugify(payload.title) || 'untitled-draft')

        let result
        if (id) {
            // Update
            const { data, error } = await supabase
                .from('articles')
                .update({ ...payload, slug, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .abortSignal(controller.signal)
                .single()

            result = { data, error }
        } else {
            // Insert
            const { data, error } = await supabase
                .from('articles')
                .insert({
                    ...payload,
                    slug,
                    author_id: user.id,
                    updated_at: new Date().toISOString()
                })
                .select()
                .abortSignal(controller.signal)
                .single()

            result = { data, error }
        }

        clearTimeout(timeoutId)

        if (result.error) {
            console.error('[Article Action Error]:', result.error)
            return { error: `Gagal menyimpan: ${result.error.message}` }
        }

        // Only revalidate if it's not an autosave, or if manually triggered
        if (manual || payload.status === 'published') {
            revalidatePath('/', 'layout')
        }

        return {
            message: payload.status === 'published' ? 'Artikel berhasil dipublish! 🚀' : 'Disimpan sebagai draft',
            id: result.data.id
        }

    } catch (error: any) {
        if (error.name === 'AbortError') {
            return { error: 'Request timeout. Jaringan lambat atau server sibuk.' }
        }
        console.error('[Article Action Exception]:', error)
        return { error: `Terjadi kesalahan internal: ${error.message || 'Unknown error'}` }
    }
}
