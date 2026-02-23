'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { ArrowLeft, Cloud, MoreHorizontal, Github, Globe, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { ArticleStatus } from '@/lib/types'
import { saveProjectAction } from '@/app/actions/project'

function WriteProjectContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const projectId = searchParams.get('id')
    const [loading, setLoading] = useState(!!projectId)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<ArticleStatus>('draft')

    // Content state
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('') // Short description
    const [content, setContent] = useState('') // Rich text content
    const [imageUrl, setImageUrl] = useState('')
    const [demoUrl, setDemoUrl] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [tags, setTags] = useState('')
    const [featured, setFeatured] = useState(false)
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')

    const supabase = createClient()
    const currentIdRef = useRef<string | null>(projectId)

    // Load Project if ID present
    useEffect(() => {
        if (!projectId) return

        const loadProject = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', projectId)
                    .single()

                if (error) throw error

                if (data) {
                    setTitle(data.title)
                    setDescription(data.description || '')
                    setContent(data.content || '')
                    setImageUrl(data.image_url || '')
                    setDemoUrl(data.demo_url || '')
                    setGithubUrl(data.github_url || '')
                    setTags(data.tags?.join(', ') || '')
                    setFeatured(data.featured || false)
                    setMetaTitle(data.meta_title || '')
                    setMetaDescription(data.meta_description || '')
                    setStatus((data.status as ArticleStatus) || 'draft')
                    currentIdRef.current = data.id
                }
            } catch (error: any) {
                console.error('[Load Error]:', error)
                toast.error('Gagal memuat project: ' + (error.message || 'Unknown error'))
            } finally {
                setLoading(false)
            }
        }
        loadProject()
    }, [projectId, supabase])

    // Unified Save Handler (Drafts & Published)
    const handleSave = async (targetStatus: ArticleStatus) => {
        if (!title && !description) {
            toast.error('Judul dan deskripsi tidak boleh kosong')
            return
        }

        if (targetStatus === 'published') {
            if (!confirm('Apakah saya yakin ingin mempublish project ini?')) return
        }

        if (saving) return

        setSaving(true)
        try {
            const slug = currentIdRef.current ? undefined : slugify(title) || 'untitled-project'
            const textContent = content.replace(/<[^>]*>?/gm, '')
            const word_count = textContent.split(/\s+/).filter(w => w.length > 0).length
            const reading_time = Math.max(1, Math.ceil(word_count / 200))

            const payload = {
                title: title || 'Untitled',
                slug: targetStatus === 'draft' && !currentIdRef.current ? slug : undefined,
                description,
                content,
                image_url: imageUrl || null,
                demo_url: demoUrl || null,
                github_url: githubUrl || null,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                featured,
                meta_title: metaTitle || null,
                meta_description: metaDescription || null,
                word_count,
                reading_time,
                status: targetStatus,
                ...(targetStatus === 'published' && status !== 'published' ? { published_at: new Date().toISOString() } : {})
            }

            const result = await saveProjectAction(currentIdRef.current, payload, true)

            if (result.error) {
                toast.error(result.error)
                return // Fast exit on error
            }

            // Success Handle
            if (result.id) {
                currentIdRef.current = result.id
                if (!projectId && targetStatus === 'draft') {
                    // Optimistically update URL without reloading
                    window.history.replaceState(null, '', `/admin/write/project?id=${result.id}`)
                }
            }

            setStatus(targetStatus)
            setLastSaved(new Date())

            if (result.message) {
                toast.success(result.message)
            }

            // Redirect on publish only
            if (targetStatus === 'published') {
                router.push('/admin/dashboard')
                router.refresh()
            }

        } catch (error: any) {
            console.error('[Save Exception]:', error)
            toast.error('Terjadi kesalahan tidak terduga saat menyimpan.')
        } finally {
            // Ensure UI is unlocked regardless of success/fail
            setSaving(false)
        }
    }


    // Global Loading State
    const isUIOccupied = saving || loading

    if (loading) return <div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">Loading...</div>

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            {/* Minimalist Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--color-bg)]/80 backdrop-blur border-b border-[var(--color-border)] z-50 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/projects" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">
                            {status === 'draft' ? 'Draft' : 'Published'}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                            {saving ? <><Cloud size={10} className="animate-pulse" /> Saving...</> : lastSaved ? <><Cloud size={10} /> Saved {lastSaved.toLocaleTimeString()}</> : 'Not saved'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={isUIOccupied}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50"
                        title="Save Draft"
                    >
                        <Save size={20} />
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={isUIOccupied}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${status === 'published'
                            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]'
                            : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-light)]'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {saving ? 'Processing...' : (status === 'published' ? 'Update' : 'Publish')}
                    </button>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hidden md:block">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </nav>

            {/* Editor Area */}
            <main className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6">

                {/* Project Header Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl font-bold font-mono-tech placeholder-[var(--color-border)] outline-none"
                        />
                        <textarea
                            placeholder="Short description (for cards)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm focus:border-[var(--color-accent)] outline-none resize-none"
                        />
                    </div>

                    <div className="space-y-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono-tech text-[var(--color-accent)]">METADATA</span>
                        </div>
                        <input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image URL"
                            className="w-full bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 border-b border-[var(--color-border)] focus-within:border-[var(--color-accent)]">
                                <Globe size={14} className="text-[var(--color-text-muted)]" />
                                <input
                                    value={demoUrl}
                                    onChange={(e) => setDemoUrl(e.target.value)}
                                    placeholder="Demo URL"
                                    className="w-full bg-transparent p-1 text-sm outline-none"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-2 border-b border-[var(--color-border)] focus-within:border-[var(--color-accent)]">
                                <Github size={14} className="text-[var(--color-text-muted)]" />
                                <input
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="GitHub URL"
                                    className="w-full bg-transparent p-1 text-sm outline-none"
                                />
                            </div>
                        </div>
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="w-full bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="accent-[var(--color-accent)]"
                            />
                            <label htmlFor="featured" className="text-sm text-[var(--color-text-secondary)] cursor-pointer">Featured Project</label>
                        </div>
                        {/* SEO Meta Fields */}
                        <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                            <span className="text-xs font-mono-tech text-[var(--color-accent)] opacity-80 uppercase">SEO Settings</span>
                            <input
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                placeholder="Meta Title (Max 60 chars)"
                                maxLength={60}
                                className="w-full bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)]"
                            />
                            <textarea
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="Meta Description (Max 160 chars)"
                                maxLength={160}
                                className="w-full h-16 bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)] resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="text-xs font-mono-tech text-[var(--color-text-muted)] uppercase tracking-wider">Case Study / Details</span>
                </div>

                {/* Tiptap Editor for Long Content */}
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                />
            </main>
        </div>
    )
}

export default function WriteProjectPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">Loading...</div>}>
            <WriteProjectContent />
        </Suspense>
    )
}
