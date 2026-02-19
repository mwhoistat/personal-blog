import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus, Search, Edit3, Trash2, FolderKanban, Github, Filter, Eye, Calendar } from 'lucide-react'
import type { Project } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const query = typeof params.q === 'string' ? params.q : ''
    const statusFilter = typeof params.status === 'string' ? params.status : 'all'

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { } },
            },
        }
    )

    let dbQuery = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    if (statusFilter !== 'all') {
        dbQuery = dbQuery.eq('status', statusFilter)
    }

    const { data: projects, error } = await dbQuery

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono-tech">Kelola Proyek</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Manage showcase projects.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/write/project"
                        className="bg-gradient-to-r from-[var(--color-accent)] to-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 text-sm"
                    >
                        <Plus size={16} /> New Project
                    </Link>
                    <Link
                        href="/admin/projects/import"
                        className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-2 rounded-lg font-bold hover:border-[var(--color-accent)] transition-colors flex items-center gap-2 text-sm"
                    >
                        <Github size={16} /> Import
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                    <form>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="Cari proyek..."
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={16} className="text-[var(--color-text-muted)]" />
                    <div className="flex bg-[var(--color-bg)] rounded-lg p-1 border border-[var(--color-border)]">
                        {['all', 'published', 'draft', 'archived'].map((s) => (
                            <Link
                                key={s}
                                href={`/admin/projects?status=${s}`}
                                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${statusFilter === s ? 'bg-[var(--color-accent)] text-[var(--color-bg)] font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs uppercase font-mono-tech">
                                <th className="p-4 font-normal">Judul</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal">Tags</th>
                                <th className="p-4 font-normal">Featured</th>
                                <th className="p-4 font-normal">Tanggal</th>
                                <th className="p-4 font-normal text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {projects?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[var(--color-text-muted)] italic">
                                        Tidak ada proyek yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                projects?.map((project: Project) => (
                                    <tr key={project.id} className="group hover:bg-[var(--color-bg-tertiary)] transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-[var(--color-text)] line-clamp-1">{project.title}</div>
                                            <div className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                                                <Eye size={10} /> {project.view_count} views
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${project.status === 'published'
                                                    ? (project.published_at && new Date(project.published_at) > new Date()
                                                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                        : 'bg-green-500/10 text-green-500 border border-green-500/20')
                                                    : project.status === 'draft'
                                                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                {project.status === 'published' && project.published_at && new Date(project.published_at) > new Date()
                                                    ? 'Scheduled'
                                                    : project.status || 'draft'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {project.tags?.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] bg-[var(--color-accent-light)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(project.tags?.length || 0) > 2 && <span className="text-[10px] text-[var(--color-text-muted)]">+{project.tags!.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {project.featured ? <span className="text-yellow-400">⭐</span> : <span className="text-[var(--color-text-muted)]">-</span>}
                                        </td>
                                        <td className="p-4 text-[var(--color-text-secondary)] text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(project.created_at)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/write/project?id=${project.id}`}
                                                    className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </Link>
                                                <DeleteButton table="projects" id={project.id} title={project.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
