import { createClient } from '@/lib/supabase'

export async function logActivity(action: string, target: string, details?: string) {
    const supabase = createClient()
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('activity_logs').insert({
            user_id: user.id,
            action,
            target,
            details: details || null,
        })
    } catch {
        // Silently fail — activity logging should never block the main action
    }
}
