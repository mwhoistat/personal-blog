'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { ArrowLeft, Save, Clock, Cloud, CloudOff, Globe, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { ArticleStatus } from '@/lib/types'

function WriteArticleContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const articleId = searchParams.get('id')
    const [loading, setLoading] = useState(!!articleId)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<ArticleStatus>('draft')

    // Content state
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [tags, setTags] = useState('')
    const [category, setCategory] = useState('')

    const supabase = createClient()
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const currentIdRef = useRef<string | null>(articleId)
    const isSavingRef = useRef(false) // Guard to prevent concurrent saves

    // Load Draft if ID present
    useEffect(() => {
        if (!articleId) return

        const loadArticle = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', articleId)
                .single()

            if (data) {
                setTitle(data.title)
                setContent(data.content)
                setCoverImage(data.cover_image || '')
                setTags(data.tags?.join(', ') || '')
                setCategory(data.category)
                setStatus(data.status as ArticleStatus)
                currentIdRef.current = data.id
            } else if (error) {
                toast.error('Gagal memuat artikel')
            }
            setLoading(false)
        }
        loadArticle()
    }, [articleId, supabase])

    // Auto-Save Logic
    const saveDraft = useCallback(async (manual = false) => {
        if ((!title && !content) || isSavingRef.current) return

        isSavingRef.current = true
        setSaving(true)

        try {
            const slug = slugify(title) || 'untitled-draft'
            const payload = {
                title: title || 'Untitled',
                // Auto-update slug while in draft, otherwise keep existing
                slug: status === 'draft' ? slug : undefined,
                content,
                cover_image: coverImage || null,
                category: category || 'Uncategorized',
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                status: status,
                updated_at: new Date().toISOString()
            }

            let result
            if (currentIdRef.current) {
                result = await supabase
                    .from('articles')
                    .update(payload)
                    .eq('id', currentIdRef.current)
                    .select()
                    .single()
            } else {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('No user')

                result = await supabase
                    .from('articles')
                    .insert({ ...payload, slug, author_id: user.id })
                    .select()
                    .single()
            }

            if (result.error) throw result.error

            if (result.data) {
                currentIdRef.current = result.data.id
                // Only replace state if valid ID and new
                if (!articleId && result.data.id) {
                    window.history.replaceState(null, '', `/admin/write/article?id=${result.data.id}`)
                }
            }

            setLastSaved(new Date())
            if (manual) toast.success('Disimpan sebagai draft')
        } catch (error: any) {
            console.error(error)
            // Don't toast on auto-save error to avoid spam, unless manual
            if (manual) toast.error('Gagal menyimpan: ' + error.message)
        } finally {
            setSaving(false)
            isSavingRef.current = false
        }
    }, [title, content, coverImage, tags, category, status, articleId, supabase])

    // Publish Workflow
    const handlePublish = async () => {
        if (!title || !content) {
            toast.error('Judul dan konten harus diisi')
            return
        }

        // Clear any pending autosave
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        // Prevent if already saving
        if (isSavingRef.current) return

        if (!confirm('Apakah saya yakin ingin mempublish artikel ini?')) return

        isSavingRef.current = true
        setSaving(true)

        try {
            const payload = {
                title,
                content,
                cover_image: coverImage || null,
                category: category || 'Uncategorized',
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                status: 'published' as ArticleStatus,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            // We assume ID exists because auto-save runs first usually
            let result
            if (currentIdRef.current) {
                result = await supabase.from('articles').update(payload).eq('id', currentIdRef.current).select().single()
            } else {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('No user')
                result = await supabase.from('articles').insert({ ...payload, slug: slugify(title), author_id: user.id }).select().single()
            }

            if (result.error) throw result.error

            setStatus('published')
            toast.success('Artikel berhasil dipublish! 🚀')

            // Redirect to dashboard after short delay
            setTimeout(() => {
                router.push('/admin/dashboard')
            }, 1000)

        } catch (error: any) {
            toast.error('Gagal publish: ' + error.message)
            setSaving(false)
            isSavingRef.current = false
        }
    }

    // Debounced Autosave
    useEffect(() => {
        if (loading || status === 'published') return // Don't autosave if published already? Or maybe yes but be careful.

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(() => {
            saveDraft()
        }, 3000)

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        }
    }, [title, content, coverImage, tags, category, saveDraft, loading, status])


    if (loading) return <div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">Loading...</div>

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
            {/* Minimalist Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--color-bg)]/80 backdrop-blur border-b border-[var(--color-border)] z-50 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
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
                    {/* Publish Action */}
                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${status === 'published'
                            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]'
                            : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-light)]'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {saving ? 'Processing...' : (status === 'published' ? 'Update' : 'Publish')}
                    </button>

                    <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </nav>

            {/* Editor Area */}
            <main className="pt-24 pb-32 max-w-3xl mx-auto px-4 sm:px-6">

                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Judul"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-4xl md:text-5xl font-bold font-mono-tech placeholder-[var(--color-border)] outline-none mb-8"
                />

                {/* Metadata Inputs (Collapsible or just inline minimal) */}
                <div className="mb-8 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Kategori (e.g. Tutorial)"
                            className="bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Tags (separated by comma)"
                            className="bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)]"
                        />
                        <input
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="Cover Image URL"
                            className="bg-transparent border-b border-[var(--color-border)] p-1 text-sm outline-none focus:border-[var(--color-accent)] md:col-span-2"
                        />
                    </div>
                </div>

                {/* Tiptap Editor */}
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                />
            </main>
        </div>
    )
}

export default function WriteArticlePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">Loading...</div>}>
            <WriteArticleContent />
        </Suspense>
    )
}
