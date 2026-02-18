'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { ArrowLeft, Save, Eye, EyeOff, Clock } from 'lucide-react'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function NewProjectPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [demoUrl, setDemoUrl] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [featured, setFeatured] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase.from('projects').insert({
            title, slug: slugify(title), description, content,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            image_url: imageUrl || null, demo_url: demoUrl || null,
            github_url: githubUrl || null, featured,
        })
        if (!error) {
            showToast('success', 'Proyek berhasil disimpan!')
            setTimeout(() => router.push('/admin/projects'), 1000)
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

    return (
        <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
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

            <Link href="/admin/projects" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
                <ArrowLeft size={16} /> Kembali
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Proyek Baru</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Basic Info */}
                <div>
                    <label style={labelStyle}>Judul Proyek</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nama proyek..." required
                        style={{ ...inputStyle, fontSize: '1.125rem', fontWeight: 600, padding: '0.875rem' }} />
                </div>
                <div>
                    <label style={labelStyle}>Deskripsi Singkat</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat proyek..." required style={inputStyle} />
                </div>

                {/* Links Section */}
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1rem' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Links & Media</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={labelStyle}>Demo URL</label>
                            <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>GitHub URL</label>
                            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Image URL</label>
                        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
                    </div>
                </div>

                {/* Tags & Featured */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={labelStyle}>Tags (pisah koma)</label>
                        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Next.js, API" style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.625rem' }}>
                        <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                        <label htmlFor="featured" style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}>Featured</label>
                    </div>
                </div>

                {/* Markdown Content */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Konten Detail (Markdown)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={12} /> {wordCount} kata
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
                    {showPreview ? (
                        <div style={{
                            minHeight: '300px', padding: '1.5rem',
                            border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                            backgroundColor: 'var(--color-bg-secondary)', overflow: 'auto',
                        }}>
                            {content ? <MarkdownRenderer content={content} /> : <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada konten...</p>}
                        </div>
                    ) : (
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14}
                            placeholder="Tulis detail proyek dalam Markdown..."
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem' }} />
                    )}
                </div>

                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan Proyek'}
                </button>
            </form>
        </div>
    )
}
