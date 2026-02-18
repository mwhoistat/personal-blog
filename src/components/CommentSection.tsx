'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Send, Trash2, MessageCircle } from 'lucide-react'
import type { Comment } from '@/lib/types'

export default function CommentSection({ articleId }: { articleId: string }) {
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchComments()
    }, [articleId])

    const fetchComments = async () => {
        try {
            const { data } = await supabase
                .from('comments')
                .select('*, user:profiles(id, username, full_name, avatar_url)')
                .eq('article_id', articleId)
                .order('created_at', { ascending: false })
            setComments(data || [])
        } catch {
            // Supabase not configured
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        setSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    article_id: articleId,
                    user_id: user.id,
                    content: newComment.trim(),
                })
                .select('*, user:profiles(id, username, full_name, avatar_url)')
                .single()

            if (!error && data) {
                setComments([data, ...comments])
                setNewComment('')
            }
        } catch {
            // Handle error
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        try {
            await supabase.from('comments').delete().eq('id', commentId)
            setComments(comments.filter((c) => c.id !== commentId))
        } catch {
            // Handle error
        }
    }

    return (
        <section style={{ marginTop: '3rem' }}>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <MessageCircle size={20} />
                Komentar ({comments.length})
            </h3>

            {/* Add comment form */}
            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            flexShrink: 0,
                        }}>
                            {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tulis komentar..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text)',
                                    fontSize: '0.875rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    fontFamily: 'inherit',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                style={{
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    fontWeight: 600,
                                    fontSize: '0.8125rem',
                                    color: 'white',
                                    background: submitting || !newComment.trim()
                                        ? 'var(--color-text-muted)'
                                        : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                                    border: 'none',
                                    cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                                    transition: 'opacity 0.2s ease',
                                }}
                            >
                                <Send size={14} />
                                {submitting ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div style={{
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                }}>
                    <a href="/login" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Login</a> untuk menambahkan komentar.
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    Memuat komentar...
                </div>
            ) : comments.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                }}>
                    Belum ada komentar. Jadilah yang pertama!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-secondary)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                    }}>
                                        {((comment.user as any)?.full_name || (comment.user as any)?.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                            {(comment.user as any)?.full_name || (comment.user as any)?.username || 'Anonymous'}
                                        </span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {user && (user.id === comment.user_id || user.role === 'admin') && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.25rem',
                                            borderRadius: '0.25rem',
                                            transition: 'color 0.2s ease',
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
