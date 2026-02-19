'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { X, Search as SearchIcon, FileText, Folder, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
    type: 'article' | 'project'
    title: string
    slug: string
    description?: string
}

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                // Toggle logic should be handled by parent or a global context
                // For now, assume this component is conditionally rendered or handles visibility via props
            }
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true)
            try {
                // Search Articles
                const { data: articles } = await supabase
                    .from('articles')
                    .select('title, slug, excerpt')
                    .ilike('title', `%${query}%`)
                    .eq('published', true)
                    .limit(3)

                // Search Projects
                const { data: projects } = await supabase
                    .from('projects')
                    .select('title, slug, description')
                    .ilike('title', `%${query}%`)
                    .limit(3)

                const combined: SearchResult[] = [
                    ...(articles?.map(a => ({ type: 'article', title: a.title, slug: a.slug, description: a.excerpt } as SearchResult)) || []),
                    ...(projects?.map(p => ({ type: 'project', title: p.title, slug: p.slug, description: p.description } as SearchResult)) || [])
                ]

                setResults(combined)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [query])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] bg-[var(--color-bg)]/80 backdrop-blur-sm flex items-start justify-center pt-24 animate-fade-in">
            <div className="w-full max-w-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

                {/* Search Input */}
                <div className="relative border-b border-[var(--color-border)] p-4 flex items-center gap-4">
                    <SearchIcon className="text-[var(--color-text-muted)]" size={20} />
                    <input
                        type="text"
                        placeholder="Search system files..."
                        className="flex-1 bg-transparent border-none outline-none text-[var(--color-text)] placeholder-[var(--color-text-muted)] font-mono-tech text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        <X size={20} />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-[var(--color-text-muted)] font-mono-tech">
                            <span className="animate-pulse">_SCANNING_DATABASE...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="p-2">
                            {results.map((result) => (
                                <Link
                                    key={result.slug}
                                    href={`/${result.type}s/${result.slug}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--color-bg-tertiary)] border border-transparent hover:border-[var(--color-border)] transition-all group"
                                >
                                    <div className={`p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)] ${result.type === 'article' ? 'text-[var(--color-accent)]' : 'text-[var(--color-cyan)]'}`}>
                                        {result.type === 'article' ? <FileText size={20} /> : <Folder size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-mono-tech font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                                            {result.title}
                                        </h4>
                                        {result.description && (
                                            <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-1">
                                                {result.description}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight size={16} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="p-8 text-center text-[var(--color-text-muted)] font-mono-tech">
                            NO_MATCHES_FOUND
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-[var(--color-text-muted)] text-sm font-mono-tech mb-2">TRY SEARCHING FOR:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs text-[var(--color-cyan)]">"Red Teaming"</span>
                                <span className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs text-[var(--color-accent)]">"React"</span>
                                <span className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs text-purple-400">"Network"</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Tips */}
                <div className="p-3 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-mono-tech uppercase">
                    <span>Search Module v1.0</span>
                    <div className="flex gap-4">
                        <span><kbd className="bg-[var(--color-bg-secondary)] px-1 rounded border border-[var(--color-border)]">↑↓</kbd> NAVIGATE</span>
                        <span><kbd className="bg-[var(--color-bg-secondary)] px-1 rounded border border-[var(--color-border)]">ENTER</kbd> OPEN</span>
                        <span><kbd className="bg-[var(--color-bg-secondary)] px-1 rounded border border-[var(--color-border)]">ESC</kbd> CLOSE</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
