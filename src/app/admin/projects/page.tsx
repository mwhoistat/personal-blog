'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2, Search, FolderKanban } from 'lucide-react'
import type { Project } from '@/lib/types'

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
                setProjects(data || [])
            } catch { setProjects([]) }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus proyek ini?')) return
        await supabase.from('projects').delete().eq('id', id)
        setProjects(projects.filter((p) => p.id !== id))
    }

    const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kelola Proyek</h1>
                <Link href="/admin/projects/new" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8125rem',
                    color: 'white', background: 'linear-gradient(135deg, var(--color-accent), #a855f7)', textDecoration: 'none',
                }}>
                    <Plus size={16} /> Proyek Baru
                </Link>
            </div>

            {/* Search */}
            {projects.length > 0 && (
                <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari proyek..."
                        style={{
                            width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', borderRadius: '0.5rem',
                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text)', fontSize: '0.875rem', outline: 'none',
                        }}
                    />
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
            ) : projects.length === 0 ? (
                <div style={{
                    padding: '4rem 2rem', textAlign: 'center', borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                }}>
                    <FolderKanban size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem', opacity: 0.4 }} />
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Belum ada proyek.</p>
                    <Link href="/admin/projects/new" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                        color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                    }}>
                        <Plus size={14} /> Buat Proyek Pertama
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Tidak ada proyek ditemukan untuk &quot;{search}&quot;
                </div>
            ) : (
                <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Judul</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Tags</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Featured</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Tanggal</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((project) => (
                                    <tr key={project.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{project.title}</p>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{project.view_count} views</p>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                {project.tags?.slice(0, 3).map((tag) => (
                                                    <span key={tag} style={{ padding: '0.125rem 0.375rem', borderRadius: '9999px', fontSize: '0.625rem', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem' }}>
                                            {project.featured ? '⭐' : '—'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                            {formatDate(project.created_at)}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                                                <Link href={`/admin/projects/${project.id}/edit`} style={{ padding: '0.375rem', borderRadius: '0.375rem', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', display: 'flex' }}>
                                                    <Edit size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(project.id)} style={{ padding: '0.375rem', borderRadius: '0.375rem', color: 'var(--color-danger)', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', display: 'flex' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
