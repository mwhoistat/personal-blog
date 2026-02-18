'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { Article } from '@/lib/types'

export default function EditArticlePage() {
    const params = useParams()
    const router = useRouter()
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

    const fetchArticle = useCallback(async () => {
        const supabase = createClient()
        const { data } = await supabase.from('articles').select('*').eq('id', params.id).single()
        if (data) {
            setArticle(data)
            setTitle(data.title)
            setContent(data.content)
            setExcerpt(data.excerpt)
            setCategory(data.category)
            setTags(data.tags?.join(', ') || '')
            setCoverImage(data.cover_image || '')
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
            cover_image: coverImage || null,
            published,
            updated_at: new Date().toISOString(),
        }).eq('id', params.id)

        if (!error) {
            router.push('/admin/articles')
        } else {
            alert('Error: ' + error.message)
            setSaving(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit',
    }

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)',
    }

    if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
    if (!article) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Artikel tidak ditemukan.</div>

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <Link href="/admin/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Kembali
            </Link>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Artikel</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={labelStyle}>Judul</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Excerpt</label>
                    <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required style={inputStyle} />
                </div>
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
                <div>
                    <label style={labelStyle}>Konten (Markdown)</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                    <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Published</label>
                </div>
                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
                    padding: '0.625rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Update Artikel'}
                </button>
            </form>
        </div>
    )
}
