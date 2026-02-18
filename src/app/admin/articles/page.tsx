'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Article } from '@/lib/types'

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
            setArticles(data || [])
        } catch {
            setArticles([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus artikel ini?')) return
        await supabase.from('articles').delete().eq('id', id)
        setArticles(articles.filter((a) => a.id !== id))
    }

    const togglePublish = async (article: Article) => {
        await supabase.from('articles').update({ published: !article.published }).eq('id', article.id)
        setArticles(articles.map((a) => a.id === article.id ? { ...a, published: !a.published } : a))
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kelola Artikel</h1>
                <Link href="/admin/articles/new" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8125rem',
                    color: 'white', background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    textDecoration: 'none',
                }}>
                    <Plus size={16} /> Artikel Baru
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
            ) : articles.length === 0 ? (
                <div style={{
                    padding: '3rem', textAlign: 'center', borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-muted)',
                }}>
                    <p style={{ marginBottom: '0.5rem' }}>Belum ada artikel.</p>
                    <Link href="/admin/articles/new" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Buat artikel pertama</Link>
                </div>
            ) : (
                <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Judul</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Kategori</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Tanggal</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article) => (
                                    <tr key={article.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{article.title}</p>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{article.view_count} views</p>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{
                                                padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600,
                                                backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)',
                                            }}>{article.category}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <button onClick={() => togglePublish(article)} style={{
                                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                                                backgroundColor: article.published ? 'rgba(16,185,129,0.1)' : 'var(--color-bg-tertiary)',
                                                color: article.published ? 'var(--color-success)' : 'var(--color-text-muted)',
                                            }}>
                                                {article.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                                            </button>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                            {formatDate(article.created_at)}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                                                <Link href={`/admin/articles/${article.id}/edit`} style={{
                                                    padding: '0.375rem', borderRadius: '0.375rem', color: 'var(--color-text-secondary)',
                                                    border: '1px solid var(--color-border)', display: 'flex',
                                                }}>
                                                    <Edit size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(article.id)} style={{
                                                    padding: '0.375rem', borderRadius: '0.375rem', color: 'var(--color-danger)',
                                                    border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', display: 'flex',
                                                }}>
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
