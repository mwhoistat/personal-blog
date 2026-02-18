'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewArticlePage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [category, setCategory] = useState('Tutorial')
    const [tags, setTags] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase.from('articles').insert({
            title,
            slug: slugify(title),
            content,
            excerpt,
            category,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            cover_image: coverImage || null,
            published,
            author_id: user?.id,
        })

        if (!error) {
            router.push('/admin/articles')
        } else {
            alert('Error: ' + error.message)
            setSaving(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)',
        fontSize: '0.9375rem',
        outline: 'none',
        fontFamily: 'inherit',
    }

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.8125rem',
        fontWeight: 600,
        marginBottom: '0.375rem',
        color: 'var(--color-text-secondary)',
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <Link href="/admin/articles" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
                <ArrowLeft size={16} /> Kembali
            </Link>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Artikel Baru</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={labelStyle}>Judul</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul artikel..." required style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Excerpt</label>
                    <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan singkat..." required style={inputStyle} />
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
                        <label style={labelStyle}>Tags (pisah koma)</label>
                        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, nextjs, webdev" style={inputStyle} />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Cover Image URL</label>
                    <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Konten (Markdown)</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis konten artikel dalam Markdown..." rows={16}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} required />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                    <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Publish langsung</label>
                </div>

                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
                    padding: '0.625rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                    <Save size={16} />
                    {saving ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
            </form>
        </div>
    )
}
