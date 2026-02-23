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
import { saveArticleAction } from '@/app/actions/article'

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
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')

    const supabase = createClient()
    const currentIdRef = useRef<string | null>(articleId)

    // Load Draft if ID present
    useEffect(() => {
        if (!articleId) return

        const loadArticle = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single()

                if (error) throw error

                if (data) {
                    setTitle(data.title)
                    setContent(data.content)
                    setCoverImage(data.cover_image || '')
                    setTags(data.tags?.join(', ') || '')
                    setCategory(data.category)
                    setMetaTitle(data.meta_title || '')
                    setMetaDescription(data.meta_description || '')
                    setStatus(data.status as ArticleStatus)
                    currentIdRef.current = data.id
                }
            } catch (error: any) {
                console.error('[Load Error]:', error)
                toast.error('Gagal memuat artikel: ' + (error.message || 'Unknown error'))
            } finally {
                setLoading(false)
            }
        }
        loadArticle()
    }, [articleId, supabase])

    // Unified Save Handler (Drafts & Published)
    const handleSave = async (targetStatus: ArticleStatus) => {
        if (!title && !content) {
            toast.error('Judul dan konten tidak boleh kosong')
            return
        }

        if (targetStatus === 'published') {
            if (!confirm('Apakah saya yakin ingin mempublish artikel ini?')) return
        }

        if (saving) return // Prevent double click

        setSaving(true)
        try {
            // Prepare Payload dynamically
            const textContent = content.replace(/<[^>]*>?/gm, '')
            const word_count = textContent.split(/\s+/).filter(w => w.length > 0).length
            const reading_time = Math.max(1, Math.ceil(word_count / 200))

            const payload = {
                title: title || 'Untitled',
                content,
                cover_image: coverImage || null,
                category: category || 'Uncategorized',
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                meta_title: metaTitle || null,
                meta_description: metaDescription || null,
                word_count,
                reading_time,
                status: targetStatus,
                ...(targetStatus === 'published' && status !== 'published' ? { published_at: new Date().toISOString() } : {})
            }

            const result = await saveArticleAction(currentIdRef.current, payload, true)

            if (result.error) {
                toast.error(result.error)
                return // Exit early if error
            }

            // Success Handle
            if (result.id) {
                currentIdRef.current = result.id
                if (!articleId && targetStatus === 'draft') {
                    // Optimistically update URL without reloading
                    window.history.replaceState(null, '', `/admin/write/article?id=${result.id}`)
                }
            }

            setStatus(targetStatus)
            setLastSaved(new Date())

            if (result.message) {
                toast.success(result.message)
            }

            // Redirect on publish only
            if (targetStatus === 'published') {
                router.push('/admin')
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
                    {/* Draft Action (Manual Save) */}
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={isUIOccupied}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50"
                        title="Save Draft"
                    >
                        <Save size={20} />
                    </button>

                    {/* Publish Action */}
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
                <div className="mb-8 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] space-y-4">
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
