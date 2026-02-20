'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { ArrowLeft, Cloud, MoreHorizontal, Github, Globe, Loader2, CheckCircle2 } from 'lucide-react'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] animate-pulse bg-[var(--color-bg-secondary)] mt-8">Memuat Editor...</div>
})
import Link from 'next/link'
import { toast } from 'sonner'
import type { ArticleStatus } from '@/lib/types'

function WriteProjectContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const projectId = searchParams.get('id')
    const [loading, setLoading] = useState(!!projectId)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
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

    const supabase = createClient()
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const currentIdRef = useRef<string | null>(projectId)

    // Load Project if ID present
    useEffect(() => {
        if (!projectId) return

        const loadProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (data) {
                setTitle(data.title)
                setDescription(data.description || '')
                setContent(data.content || '')
                setImageUrl(data.image_url || '')
                setDemoUrl(data.demo_url || '')
                setGithubUrl(data.github_url || '')
                setTags(data.tags?.join(', ') || '')
                setFeatured(data.featured || false)
                setStatus((data.status as ArticleStatus) || 'draft')
                currentIdRef.current = data.id
            } else if (error) {
                toast.error('Gagal memuat project')
            }
            setLoading(false)
        }
        loadProject()
    }, [projectId, supabase])

    // Auto-Save Logic
    const saveDraft = useCallback(async (manual = false) => {
        if (!title) return
        if (isPublishing) return

        setIsSavingDraft(true)
        try {
            const slug = slugify(title) || 'untitled-project'
            const payload = {
                title: title || 'Untitled',
                slug: status === 'draft' ? slug : undefined,
                description,
                content,
                image_url: imageUrl || null,
                demo_url: demoUrl || null,
                github_url: githubUrl || null,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                featured,
                status: status,
                updated_at: new Date().toISOString()
            }

            const operation = async () => {
                if (currentIdRef.current) {
                    return await supabase.from('projects').update(payload).eq('id', currentIdRef.current).select().single()
                } else {
                    return await supabase.from('projects').insert({ ...payload, slug }).select().single()
                }
            }

            const result = await Promise.race([
                operation(),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout (> 10s)')), 10000))
            ])

            if (result.error) throw result.error

            if (result.data) {
                currentIdRef.current = result.data.id
                if (!projectId && typeof window !== 'undefined') {
                    window.history.replaceState(null, '', `/admin/write/project?id=${result.data.id}`)
                }
            }

            setLastSaved(new Date())
            if (manual) toast.success('Disimpan sebagai draft')
        } catch (error: any) {
            console.error('Save draft error:', error)
            if (manual) toast.error('Gagal menyimpan: ' + error.message)
        } finally {
            setIsSavingDraft(false)
        }
    }, [title, description, content, imageUrl, demoUrl, githubUrl, tags, featured, status, projectId, isPublishing, supabase])

    // Publish Workflow
    const handlePublish = async () => {
        if (!title || !description) {
            toast.error('Judul dan deskripsi harus diisi')
            return
        }

        if (!confirm('Apakah Anda yakin ingin mempublish project ini?')) return

        setIsPublishing(true)
        try {
            const payload = {
                title,
                slug: currentIdRef.current ? undefined : slugify(title),
                description,
                content,
                image_url: imageUrl || null,
                demo_url: demoUrl || null,
                github_url: githubUrl || null,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                featured,
                status: 'published' as ArticleStatus,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const operation = async () => {
                if (currentIdRef.current) {
                    return await supabase.from('projects').update(payload).eq('id', currentIdRef.current).select().single()
                } else {
                    return await supabase.from('projects').insert({ ...payload }).select().single()
                }
            }

            const result = await Promise.race([
                operation(),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout (> 10s)')), 10000))
            ])

            if (result.error) throw result.error

            setStatus('published')
            toast.success('Project berhasil dipublish! 🚀')

            router.push('/admin/projects?status=published')
            router.refresh()

        } catch (error: any) {
            console.error('Publish error:', error)
            toast.error('Gagal publish: ' + error.message)
        } finally {
            setIsPublishing(false)
        }
    }

    // Debounced Autosave
    useEffect(() => {
        if (loading || isPublishing) return
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = setTimeout(() => {
            saveDraft()
        }, 3000)
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        }
    }, [title, description, content, imageUrl, demoUrl, githubUrl, tags, featured, status, saveDraft, loading, isPublishing])


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
                            {isSavingDraft ? (
                                <><Loader2 size={10} className="animate-spin" /> Saving...</>
                            ) : lastSaved ? (
                                <><CheckCircle2 size={10} className="text-green-500" /> Saved {lastSaved.toLocaleTimeString()}</>
                            ) : (
                                'Not saved'
                            )}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePublish}
                        disabled={isSavingDraft || isPublishing}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${status === 'published'
                            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]'
                            : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-light)]'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isPublishing && <Loader2 size={14} className="animate-spin" />}
                        {isPublishing ? 'Processing...' : (status === 'published' ? 'Update' : 'Publish')}
                    </button>
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
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
