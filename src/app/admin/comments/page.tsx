'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Trash2, MessageSquare } from 'lucide-react'
import type { Comment } from '@/lib/types'

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await supabase
                    .from('comments')
                    .select('*, user:profiles(id, username, full_name), article:articles(id, title, slug)')
                    .order('created_at', { ascending: false })
                setComments(data || [])
            } catch { setComments([]) }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus komentar ini?')) return
        await supabase.from('comments').delete().eq('id', id)
        setComments(comments.filter((c) => c.id !== id))
    }

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={24} /> Kelola Komentar
            </h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
            ) : comments.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', borderRadius: '0.75rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>
                    Belum ada komentar.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {comments.map((comment) => (
                        <div key={comment.id} style={{
                            padding: '1rem', borderRadius: '0.5rem',
                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                        {(comment as any).user?.full_name || (comment as any).user?.username || 'Anonymous'}
                                    </span>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                        {formatDate(comment.created_at)}
                                    </span>
                                    {(comment as any).article && (
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                                            di artikel: <span style={{ color: 'var(--color-accent)' }}>{(comment as any).article.title}</span>
                                        </p>
                                    )}
                                </div>
                                <button onClick={() => handleDelete(comment.id)} style={{
                                    padding: '0.375rem', borderRadius: '0.375rem', color: 'var(--color-danger)',
                                    border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', display: 'flex',
                                }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
