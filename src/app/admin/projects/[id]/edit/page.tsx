'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/types'

export default function EditProjectPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [demoUrl, setDemoUrl] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [featured, setFeatured] = useState(false)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchProject = useCallback(async () => {
        const supabase = createClient()
        const { data } = await supabase.from('projects').select('*').eq('id', params.id).single()
        if (data) {
            setProject(data); setTitle(data.title); setDescription(data.description)
            setContent(data.content); setTags(data.tags?.join(', ') || '')
            setImageUrl(data.image_url || ''); setDemoUrl(data.demo_url || '')
            setGithubUrl(data.github_url || ''); setFeatured(data.featured)
        }
        setLoading(false)
    }, [params.id])

    useEffect(() => { fetchProject() }, [fetchProject])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true)
        const supabase = createClient()
        const { error } = await supabase.from('projects').update({
            title, description, content,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            image_url: imageUrl || null, demo_url: demoUrl || null, github_url: githubUrl || null,
            featured, updated_at: new Date().toISOString(),
        }).eq('id', params.id)
        if (!error) router.push('/admin/projects')
        else { alert('Error: ' + error.message); setSaving(false) }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit',
    }
    const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }

    if (loading) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
    if (!project) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Proyek tidak ditemukan.</div>

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <Link href="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Kembali
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Proyek</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label style={labelStyle}>Judul</label><input value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Deskripsi</label><input value={description} onChange={(e) => setDescription(e.target.value)} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Tags</label><input value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><label style={labelStyle}>Demo URL</label><input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>GitHub URL</label><input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Image URL</label><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Konten (Markdown)</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }} />
                    <label htmlFor="featured" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Featured</label>
                </div>
                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start',
                    padding: '0.625rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Update Proyek'}
                </button>
            </form>
        </div>
    )
}
