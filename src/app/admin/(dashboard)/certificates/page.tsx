import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus, Search, Filter, Award, Calendar, ExternalLink, Edit3, Trash2, Image as ImageIcon } from 'lucide-react'
import type { Certificate } from '@/lib/types'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminCertificatesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const query = typeof params.q === 'string' ? params.q : ''
    const statusFilter = typeof params.status === 'string' ? params.status : 'all'
    const categoryFilter = typeof params.category === 'string' ? params.category : 'all'

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
        .from('certificates')
        .select('*')
        .order('issue_date', { ascending: false })

    if (query) {
        // Certificates might not have 'description' indexed or present in all, focusing on title/issuer
        dbQuery = dbQuery.or(`title.ilike.% ${query}%, issuer.ilike.% ${query}% `)
    }

    if (statusFilter !== 'all') {
        dbQuery = dbQuery.eq('status', statusFilter)
    }

    if (categoryFilter !== 'all') {
        dbQuery = dbQuery.eq('category', categoryFilter)
    }

    const { data: certificates, error } = await dbQuery

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono-tech mb-1">Certificates</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Manage awards and certifications.</p>
                </div>
                <Link
                    href="/admin/certificates/new"
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm shadow-lg shadow-[var(--color-accent)]/20"
                >
                    <Plus size={16} /> Add New
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                        <form>
                            <input
                                name="q"
                                defaultValue={query}
                                placeholder="Search..."
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                            />
                            {/* Preserve other params */}
                            <input type="hidden" name="status" value={statusFilter} />
                            <input type="hidden" name="category" value={categoryFilter} />
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                    {/* Status Tabs */}
                    <div className="flex bg-[var(--color-bg)] rounded-lg p-1 border border-[var(--color-border)]">
                        {['all', 'published', 'draft', 'archived'].map((s) => (
                            <Link
                                key={s}
                                href={`/ admin / certificates ? status = ${s}& category=${categoryFilter}& q=${query} `}
                                className={`px - 3 py - 1 text - xs rounded - md capitalize transition - colors ${statusFilter === s ? 'bg-[var(--color-accent)] text-[var(--color-bg)] font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'} `}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                    {/* Category Dropdown (simulated via Link or simple form) - For SSR, links are cleaner */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-[var(--color-text-muted)]" />
                        <div className="flex bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] overflow-hidden">
                            {['all', 'course', 'award'].map((c) => (
                                <Link
                                    key={c}
                                    href={`/ admin / certificates ? status = ${statusFilter}& category=${c}& q=${query} `}
                                    className={`px - 3 py - 1 text - xs capitalize transition - colors border - r border - [var(--color - border)]last: border - 0 ${categoryFilter === c ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'} `}
                                >
                                    {c}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            {certificates?.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]">
                    <Award className="mx-auto text-[var(--color-text-muted)] mb-3" size={48} />
                    <h3 className="text-lg font-bold mb-1">No Certificates Found</h3>
                    <p className="text-[var(--color-text-secondary)]">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates?.map((cert: Certificate) => (
                        <div key={cert.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-300 flex flex-col">
                            <div className="aspect-video relative bg-[var(--color-bg)] overflow-hidden">
                                <img
                                    src={cert.image_url}
                                    alt={cert.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <span className={`px - 2 py - 1 rounded text - [10px] font - bold uppercase shadow - sm ${cert.status === 'published'
                                            ? (cert.published_at && new Date(cert.published_at) > new Date()
                                                ? 'bg-blue-500 text-white' // Scheduled
                                                : 'bg-green-500 text-white') // Published
                                            : cert.status === 'draft'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-gray-500 text-white'
                                        } `}>
                                        {cert.status === 'published' && cert.published_at && new Date(cert.published_at) > new Date()
                                            ? 'Scheduled'
                                            : cert.status || 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text - [10px] font - mono - tech uppercase tracking - wider px - 2 py - 0.5 rounded border ${cert.category === 'award' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                                            cert.category === 'competition' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                                                'border-[var(--color-cyan)]/30 text-[var(--color-cyan)] bg-[var(--color-cyan)]/5'
                                        } `}>
                                        {cert.category}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg mb-1 line-clamp-1" title={cert.title}>{cert.title}</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm mb-3 flex items-center gap-1">
                                    <Award size={14} /> {cert.issuer}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-auto">
                                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 font-mono-tech">
                                        <Calendar size={12} />
                                        {new Date(cert.issue_date).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Link href={`/ admin / certificates / ${cert.id} `} className="p-1 hover:text-[var(--color-accent)]">
                                            <Edit3 size={14} />
                                        </Link>
                                        <DeleteButton table="certificates" id={cert.id} title={cert.title} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
