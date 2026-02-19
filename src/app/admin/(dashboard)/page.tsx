import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { FileText, FolderKanban, Activity, ArrowRight, PenTool, Award, Plus } from 'lucide-react'

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

    // Parallel Data Fetching for Dashboard Stats
    const getCount = async (table: string, status?: string) => {
        let query = supabase.from(table).select('*', { count: 'exact', head: true })
        if (status) query = query.eq('status', status)
        const { count } = await query
        return count || 0
    }

    const [
        totalArticles, publishedArticles, draftArticles,
        totalProjects, publishedProjects,
        totalCertificates,
        recentActivity
    ] = await Promise.all([
        getCount('articles'), getCount('articles', 'published'), getCount('articles', 'draft'),
        getCount('projects'), getCount('projects', 'published'),
        getCount('certificates'),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5).then(res => res.data)
    ])

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono-tech">Dashboard</h1>
                    <p className="text-[var(--color-text-muted)] text-sm">Overview sistem dan konten blog.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/write/article" className="bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 rounded-lg font-bold hover:bg-[var(--color-accent-light)] transition-colors flex items-center gap-2 text-sm">
                        <PenTool size={16} /> Write Article
                    </Link>
                    <Link href="/admin/write/project" className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-2 rounded-lg font-bold hover:border-[var(--color-accent)] transition-colors flex items-center gap-2 text-sm">
                        <FolderKanban size={16} /> New Project
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Articles Stats */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-accent)] transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={80} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-accent)]">
                            <FileText size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold font-mono-tech">{totalArticles}</span>
                            <p className="text-sm text-[var(--color-text-muted)]">Total Articles</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)]">
                            <span className="block text-2xl font-bold text-green-500">{publishedArticles}</span>
                            <span className="text-xs text-[var(--color-text-muted)]">Published</span>
                        </div>
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)]">
                            <span className="block text-2xl font-bold text-yellow-500">{draftArticles}</span>
                            <span className="text-xs text-[var(--color-text-muted)]">Drafts</span>
                        </div>
                    </div>
                </div>

                {/* Projects Stats */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-cyan-500 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FolderKanban size={80} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-cyan-400">
                            <FolderKanban size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold font-mono-tech">{totalProjects}</span>
                            <p className="text-sm text-[var(--color-text-muted)]">Total Projects</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)]">
                            <span className="block text-2xl font-bold text-cyan-400">{publishedProjects}</span>
                            <span className="text-xs text-[var(--color-text-muted)]">Published</span>
                        </div>
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)] flex items-center justify-center">
                            <Link href="/admin/projects" className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Certificates Stats */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-purple-500 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award size={80} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-purple-400">
                            <Award size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold font-mono-tech">{totalCertificates}</span>
                            <p className="text-sm text-[var(--color-text-muted)]">Certificates</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)] flex items-center justify-center col-span-2">
                            <Link href="/admin/certificates" className="text-xs text-purple-400 flex items-center gap-1 hover:underline">
                                Manage Certificates <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h2 className="text-lg font-bold font-mono-tech flex items-center gap-2">
                        <Activity size={18} /> Aktivitas Terkini
                    </h2>
                    <Link href="/admin/activity" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                        View All Log
                    </Link>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {(!recentActivity || recentActivity.length === 0) ? (
                        <div className="p-8 text-center text-[var(--color-text-muted)] italic">Belum ada aktivitas.</div>
                    ) : (
                        recentActivity.map((log: any) => (
                            <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                                <div className={`w-2 h-2 rounded-full ${log.action.includes('create') ? 'bg-green-500' :
                                        log.action.includes('update') ? 'bg-blue-500' :
                                            log.action.includes('delete') ? 'bg-red-500' : 'bg-[var(--color-accent)]'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[var(--color-text)]">
                                        <span className="font-mono-tech text-[var(--color-accent)] text-xs uppercase mr-2 opacity-80">{log.action}</span>
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
