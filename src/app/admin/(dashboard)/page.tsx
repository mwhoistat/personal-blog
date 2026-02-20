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

    const getViews = async (table: string) => {
        const { data } = await supabase.from(table).select('view_count')
        return data?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0
    }

    const [
        totalArticles, publishedArticles, draftArticles, archivedArticles,
        totalProjects, publishedProjects,
        totalCertificates,
        articleViews, projectViews,
        recentActivity,
        contentMonitoring
    ] = await Promise.all([
        getCount('articles'), getCount('articles', 'published'), getCount('articles', 'draft'), getCount('articles', 'archived'),
        getCount('projects'), getCount('projects', 'published'),
        getCount('certificates'),
        getViews('articles'), getViews('projects'),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5).then(res => res.data),
        supabase.from('articles').select('id, title, status, view_count, published_at, updated_at').order('view_count', { ascending: false }).limit(5).then(res => res.data)
    ])

    const totalViews = articleViews + projectViews

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
                        <FolderKanban size={16} /> Run Project
                    </Link>
                </div>
            </div>

            {/* Total Views Summary Card */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Activity size={100} />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-mono-tech text-[var(--color-text-muted)] uppercase">Total Content Views</p>
                        <h2 className="text-4xl font-bold">{totalViews.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-sm text-[var(--color-text-muted)]">Articles: {articleViews.toLocaleString()}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Projects: {projectViews.toLocaleString()}</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Articles Stats */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-accent)] transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={80} />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-accent)]">
                            <FileText size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold font-mono-tech">{totalArticles}</span>
                            <p className="text-sm text-[var(--color-text-muted)]">Total Articles</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 relative z-10">
                        <div className="bg-[var(--color-bg)]/50 p-2 rounded-lg border border-[var(--color-border)] text-center">
                            <span className="block text-xl font-bold text-green-500">{publishedArticles}</span>
                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Pub</span>
                        </div>
                        <div className="bg-[var(--color-bg)]/50 p-2 rounded-lg border border-[var(--color-border)] text-center">
                            <span className="block text-xl font-bold text-yellow-500">{draftArticles}</span>
                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Drft</span>
                        </div>
                        <div className="bg-[var(--color-bg)]/50 p-2 rounded-lg border border-[var(--color-border)] text-center">
                            <span className="block text-xl font-bold text-gray-500">{archivedArticles}</span>
                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Arch</span>
                        </div>
                    </div>
                </div>

                {/* Projects Stats */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-xl hover:border-cyan-500 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FolderKanban size={80} />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-cyan-400">
                            <FolderKanban size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold font-mono-tech">{totalProjects}</span>
                            <p className="text-sm text-[var(--color-text-muted)]">Total Projects</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[var(--color-bg)]/50 p-3 rounded-lg border border-[var(--color-border)] text-center">
                            <span className="block text-xl font-bold text-cyan-400">{publishedProjects}</span>
                            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Published</span>
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
                    <div className="flex items-center gap-4 mb-4 relative z-10">
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

            {/* Content Monitoring Panel */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold font-mono-tech flex items-center gap-2">
                            <Activity size={18} className="text-[var(--color-accent)]" />
                            Content Monitoring Panel
                        </h2>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">Top performing articles by views.</p>
                    </div>
                    <Link href="/admin/articles" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium text-center">Status</th>
                                <th className="px-6 py-3 font-medium text-center">Views</th>
                                <th className="px-6 py-3 font-medium hidden md:table-cell">Published Date</th>
                                <th className="px-6 py-3 font-medium hidden md:table-cell">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {(!contentMonitoring || contentMonitoring.length === 0) ? (
                                <tr><td colSpan={5} className="p-8 text-center text-[var(--color-text-muted)] italic">No content available.</td></tr>
                            ) : (
                                contentMonitoring.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <Link href={`/admin/write/article?id=${item.id}`} className="hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${item.status === 'published'
                                                    ? (item.published_at && new Date(item.published_at) > new Date()
                                                        ? 'bg-blue-500 text-white' // Scheduled
                                                        : 'bg-green-500 text-white') // Published
                                                    : item.status === 'draft'
                                                        ? 'bg-yellow-500 text-black'
                                                        : 'bg-gray-500 text-white' // Archived
                                                }`}>
                                                {item.status === 'published' && item.published_at && new Date(item.published_at) > new Date()
                                                    ? 'Scheduled'
                                                    : item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono-tech font-bold text-[var(--color-accent)]">
                                            {item.view_count?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] hidden md:table-cell">
                                            {item.published_at ? new Date(item.published_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] hidden md:table-cell">
                                            {new Date(item.updated_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden mt-8 opacity-70 hover:opacity-100 transition-opacity">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h2 className="text-sm font-bold font-mono-tech flex items-center gap-2">
                        System Logs
                    </h2>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {(!recentActivity || recentActivity.length === 0) ? (
                        <div className="p-4 text-center text-[var(--color-text-muted)] italic text-sm">No recent activity.</div>
                    ) : (
                        recentActivity.map((log: any) => (
                            <div key={log.id} className="p-3 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full ${log.action.includes('create') ? 'bg-green-500' :
                                    log.action.includes('update') ? 'bg-blue-500' :
                                        log.action.includes('delete') ? 'bg-red-500' : 'bg-[var(--color-accent)]'
                                    }`} />
                                <div className="flex-1 flex justify-between items-center">
                                    <p className="text-xs text-[var(--color-text)] flex gap-2">
                                        <span className="font-mono-tech text-[var(--color-accent)] uppercase opacity-80">{log.action}</span>
                                        <span className="truncate max-w-[200px] md:max-w-md">{log.target}</span>
                                    </p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">
                                        {new Date(log.created_at).toLocaleTimeString()}
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
