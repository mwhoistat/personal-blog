'use client'

import { useEffect, useState, useCallback, useRef } from 'react' // Added useRef
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, Eye, EyeOff, Bold, Italic, Heading, Link2, Code, List, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import FloatingLinkToolbar from '@/components/admin/FloatingLinkToolbar'
import { useSmartPaste } from '@/hooks/useSmartPaste' // Import Hook
import { logActivity } from '@/lib/activity'
import type { Article } from '@/lib/types'

export default function EditArticlePage() {
    // ... params, router ...
    const params = useParams()
    const router = useRouter()
    // ... state ...
    const [article, setArticle] = useState<Article | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [category, setCategory] = useState('Tutorial')
    const [tags, setTags] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showPreview, setShowPreview] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null) // Create Ref

    // Smart Paste Integration
    useSmartPaste({
        textareaRef,
        onPaste: (newContent) => setContent(newContent)
    })

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    // ... rest of logic ...
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text })
        setTimeout(() => setToast(null), 3000)
    }

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = content.substring(start, end)
        const replacement = `${prefix}${selected || 'teks'}${suffix}`
        const newContent = content.substring(0, start) + replacement + content.substring(end)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'teks').length)
        }, 0)
    }

    const toolbarButtons = [
        { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
        { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
        { icon: Heading, action: () => insertMarkdown('## '), title: 'Heading' },
        { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
        { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Code' },
        { icon: List, action: () => insertMarkdown('- '), title: 'List' },
    ]

    const fetchArticle = useCallback(async () => {
        const supabase = createClient()
        const { data } = await supabase.from('articles').select('*').eq('id', params.id).single()
        if (data) {
            setArticle(data); setTitle(data.title); setContent(data.content)
            setExcerpt(data.excerpt); setCategory(data.category)
            setTags(data.tags?.join(', ') || ''); setCoverImage(data.cover_image || '')
            setPublished(data.published)
        }
        setLoading(false)
    }, [params.id])

    useEffect(() => { fetchArticle() }, [fetchArticle])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase.from('articles').update({
            title, content, excerpt, category,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            cover_image: coverImage || null, published, updated_at: new Date().toISOString(),
        }).eq('id', params.id)

        if (!error) {
            showToast('success', 'Artikel berhasil diupdate!')
            logActivity('update_article', title)
            setTimeout(() => router.push('/admin/articles'), 1000)
        } else {
            showToast('error', error.message)
            setSaving(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit',
    }
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8125rem', fontWeight: 600,
        marginBottom: '0.375rem', color: 'var(--color-text-secondary)',
    }

    if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
    if (!article) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Artikel tidak ditemukan.</div>

    return (
        <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
            {/* ... toast ... */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100,
                    padding: '0.875rem 1.25rem', borderRadius: '0.625rem',
                    backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', fontWeight: 600, fontSize: '0.875rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease',
                }}>
                    {toast.text}
                </div>
            )}

            <Link href="/admin/articles" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
                <ArrowLeft size={16} /> Kembali
            </Link>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Artikel</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* ... fields ... */}
                <div>
                    <label style={labelStyle}>Judul</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ ...inputStyle, fontSize: '1.125rem', fontWeight: 600, padding: '0.875rem' }} />
                </div>
                <div>
                    <label style={labelStyle}>Excerpt</label>
                    <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required style={inputStyle} />
                </div>

                {/* Settings Panel */}
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <button type="button" onClick={() => setShowSettings(!showSettings)} style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.875rem 1rem', background: 'var(--color-bg-secondary)', border: 'none',
                        color: 'var(--color-text)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                    }}>
                        Pengaturan Artikel
                        {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {showSettings && (
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Kategori</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                                        {['Tutorial', 'Programming', 'Design', 'Backend', 'DevOps', 'Lainnya'].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Tags</label>
                                    <input value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Cover Image URL</label>
                                <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                                <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Published</label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Markdown Editor */}
                <div className="relative">
                    {/* Pass textareaRef to Toolbar */}
                    <FloatingLinkToolbar
                        textareaRef={textareaRef}
                        onInsertLink={(url) => insertMarkdown('[', `](${url})`)}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Konten (Markdown)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={12} /> {readingTime} min · {wordCount} kata
                            </span>
                            <button type="button" onClick={() => setShowPreview(!showPreview)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600,
                                background: showPreview ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                color: showPreview ? 'white' : 'var(--color-text-secondary)',
                                border: '1px solid var(--color-border)', cursor: 'pointer',
                            }}>
                                {showPreview ? <><EyeOff size={12} /> Editor</> : <><Eye size={12} /> Preview</>}
                            </button>
                        </div>
                    </div>

                    {!showPreview && (
                        <div style={{
                            display: 'flex', gap: '0.25rem', padding: '0.5rem',
                            backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.5rem 0.5rem 0 0',
                            border: '1px solid var(--color-border)', borderBottom: 'none',
                        }}>
                            {toolbarButtons.map(({ icon: Icon, action, title: tl }) => (
                                <button key={tl} type="button" onClick={action} title={tl} style={{
                                    padding: '0.375rem', borderRadius: '0.25rem', background: 'none',
                                    border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    )}

                    {showPreview ? (
                        <div style={{
                            minHeight: '400px', padding: '1.5rem',
                            border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                            backgroundColor: 'var(--color-bg-secondary)', overflow: 'auto',
                        }}>
                            {content ? <MarkdownRenderer content={content} /> : (
                                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada konten...</p>
                            )}
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef} // Attach Ref
                            id="md-editor"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20} style={{
                                ...inputStyle, resize: 'vertical', lineHeight: 1.7,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.875rem',
                                borderRadius: '0 0 0.5rem 0.5rem',
                            }} required />
                    )}
                </div>

                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Update Artikel'}
                </button>
            </form>
        </div>
    )
}
