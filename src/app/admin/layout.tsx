import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminShell from '@/components/AdminShell'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '../login/actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Profile & Role Server-Side
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    console.log('[AdminLayout] User ID:', user.id)
    console.log('[AdminLayout] Query result (Profile):', profile)
    console.log('[AdminLayout] Query Error:', error)

    // Authorization Check
    if (!profile || profile.role !== 'admin') {
        console.warn(`[AdminLayout] Access Denied. User: ${user.email}, Role: ${profile?.role}`)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-lg mx-auto animate-fade-in">
                <div className="mb-6 text-red-500 bg-red-500/10 p-4 rounded-full">
                    <ShieldAlert size={64} />
                </div>
                <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
                <p className="mb-8 text-[var(--color-text-secondary)] leading-relaxed">
                    Account <strong>{user.email}</strong> is authenticated, but lacks
                    <span className="font-mono text-red-500 bg-red-500/10 px-1 rounded mx-1">ADMIN</span>
                    privileges.
                </p>

                <div className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 mb-8 text-left shadow-lg">
                    <p className="text-xs font-bold uppercase text-[var(--color-text-muted)] mb-3 tracking-wider">
                        Debug Information
                    </p>
                    <div className="font-mono text-xs space-y-2 text-[var(--color-text)]">
                        <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>User ID:</span>
                            <span className="opacity-70">{user.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                            <span>Email:</span>
                            <span className="opacity-70">{user.email}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span>Role (DB):</span>
                            <span className={`font-bold ${!profile ? 'text-yellow-500' : 'text-red-500'}`}>
                                {profile?.role ? `"${profile.role}"` : 'NULL / NOT FOUND'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="px-6 py-3 rounded-lg font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors">
                        Back to Home
                    </Link>
                    <form action={signOut}>
                        <button className="px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity">
                            Switch Account
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <AdminShell userProfile={profile}>
            {children}
        </AdminShell>
    )
}
