'use client'

import { Suspense, useEffect, useState } from 'react'
import { generateExcerpt } from '@/lib/html-utils'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import CyberCard from '@/components/CyberCard'
import { ArticleCardSkeleton } from '@/components/Skeleton'
import { Terminal, Search } from 'lucide-react'
import type { Article } from '@/lib/types'

function ArticlesContent() {
    const searchParams = useSearchParams()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false })

            if (data) setArticles(data)
            setLoading(false)
        }
        fetchArticles()
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 mb-4 text-[var(--color-accent)] font-mono-tech text-sm">
                        <Terminal size={14} />
                        <span>root@atha:~/articles# cat *</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Security Logs</h1>
                    <p className="text-[var(--color-text-secondary)] max-w-xl">
                        Technical write-ups, vulnerability disclosures, and tutorials.
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-[var(--color-text-muted)]" />
                    </div>
                    <input
                        type="text"
                        placeholder="grep 'keyword'..."
                        className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm rounded-md py-2 pl-10 pr-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] font-mono-tech placeholder:[var(--color-text-muted)] transition-colors"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)
                ) : (
                    articles.map((article) => (
                        <CyberCard
                            key={article.id}
                            title={article.title}
                            excerpt={generateExcerpt(article.content, 120)}
                            slug={article.slug}
                            type="article"
                            date={article.created_at}
                            tags={JSON.parse(JSON.stringify(article.tags || []))}
                            image={article.cover_image || undefined}
                        />
                    ))
                )}
            </div>

            {!loading && articles.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-lg">
                    <Terminal size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                    <p className="text-[var(--color-text-secondary)] font-mono-tech">No logs found matching query.</p>
                </div>
            )}
        </div>
    )
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ArticlesContent />
        </Suspense>
    )
}
