import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { FileText, FolderKanban, Activity, ArrowRight, PenTool } from 'lucide-react'

export default async function AdminDashboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )

    // Get Stats (Simple counts)
    const { count: articleCount } = await supabase.from('articles').select('*', { count: 'exact', head: true })
    const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true })
    const { data: recentActivity } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5)

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-mono-tech">Dashboard</h1>
                <Link href="/admin/write/article" className="bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 rounded font-bold hover:bg-[var(--color-accent-light)] transition-colors flex items-center gap-2">
                    <PenTool size={18} /> Tulis Baru
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-accent)] transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-accent)]">
                            <FileText size={24} />
                        </div>
                        <span className="text-3xl font-bold font-mono-tech">{articleCount || 0}</span>
                    </div>
                    <h3 className="text-[var(--color-text-secondary)] font-medium">Total Artikel</h3>
                    <Link href="/admin/articles" className="text-xs text-[var(--color-accent)] mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View All <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-accent)] transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-cyan-400">
                            <FolderKanban size={24} />
                        </div>
                        <span className="text-3xl font-bold font-mono-tech">{projectCount || 0}</span>
                    </div>
                    <h3 className="text-[var(--color-text-secondary)] font-medium">Total Proyek</h3>
                    <Link href="/admin/projects" className="text-xs text-cyan-400 mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View All <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-accent)] transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-purple-400">
                            <Activity size={24} />
                        </div>
                        <span className="text-3xl font-bold font-mono-tech">Ok</span>
                    </div>
                    <h3 className="text-[var(--color-text-secondary)] font-medium">System Status</h3>
                    <Link href="/admin/activity" className="text-xs text-purple-400 mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Logs <ArrowRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h2 className="text-lg font-bold font-mono-tech">Aktivitas Terkini</h2>
                    <Link href="/admin/activity" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                        Lihat Semua
                    </Link>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {recentActivity?.length === 0 ? (
                        <div className="p-8 text-center text-[var(--color-text-muted)] italic">Belum ada aktivitas.</div>
                    ) : (
                        recentActivity?.map((log: any) => (
                            <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[var(--color-text)]">
                                        <span className="font-mono-tech text-[var(--color-accent)] text-xs uppercase mr-2">{log.action}</span>
                                        {log.target}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
