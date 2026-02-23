'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export type SaveProjectState = {
    message?: string
    error?: string
    id?: string
}

export async function saveProjectAction(
    id: string | null,
    payload: any,
    manual: boolean = false
): Promise<SaveProjectState> {
    try {
        const supabase = await createServerSupabaseClient()

        // Timeout safeguard
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            clearTimeout(timeoutId)
            return { error: 'Unauthorized: Harap login kembali.' }
        }

        const slug = id && payload.status === 'published' ? undefined : (slugify(payload.title) || 'untitled-draft')

        let result
        if (id) {
            const { data, error } = await supabase
                .from('projects')
                .update({ ...payload, slug, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .abortSignal(controller.signal)
                .single()

            result = { data, error }
        } else {
            const { data, error } = await supabase
                .from('projects')
                .insert({
                    ...payload,
                    slug,
                    updated_at: new Date().toISOString()
                })
                .select()
                .abortSignal(controller.signal)
                .single()

            result = { data, error }
        }

        clearTimeout(timeoutId)

        if (result.error) {
            console.error('[Project Action Error]:', result.error)
            return { error: `Gagal menyimpan: ${result.error.message}` }
        }

        if (manual || payload.status === 'published') {
            revalidatePath('/', 'layout')
        }

        return {
            message: payload.status === 'published' ? 'Project berhasil dipublish! 🚀' : 'Disimpan sebagai draft',
            id: result.data.id
        }

    } catch (error: any) {
        if (error.name === 'AbortError') {
            return { error: 'Request timeout. Jaringan lambat atau server sibuk.' }
        }
        console.error('[Project Action Exception]:', error)
        return { error: `Terjadi kesalahan internal: ${error.message || 'Unknown error'}` }
    }
}
