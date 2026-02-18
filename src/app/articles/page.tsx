'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'
import { ArticleCardSkeleton } from '@/components/Skeleton'
import { BookOpen } from 'lucide-react'
import type { Article } from '@/lib/types'

const categories = ['Semua', 'Tutorial', 'Programming', 'Design', 'Backend', 'DevOps']

function ArticlesContent() {
    const searchParams = useSearchParams()
    const [articles, setArticles] = useState<Article[]>([])
    const [filtered, setFiltered] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    const fetchArticles = useCallback(async () => {
        const supabase = createClient()
        try {
            const { data } = await supabase
                .from('articles').select('*').eq('published', true)
                .order('created_at', { ascending: false })
            setArticles(data || [])
        } catch {
            setArticles([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchArticles() }, [fetchArticles])

    useEffect(() => {
        let result = articles
        if (activeCategory !== 'Semua') {
            result = result.filter((a) => a.category === activeCategory)
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter((a) =>
                a.title.toLowerCase().includes(q) ||
                a.tags?.some((t) => t.toLowerCase().includes(q)) ||
                a.excerpt.toLowerCase().includes(q)
            )
        }
        setFiltered(result)
    }, [articles, activeCategory, searchQuery])

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BookOpen size={24} style={{ color: 'var(--color-accent)' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Artikel</h1>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                    Tulisan tentang programming, desain, dan teknologi terbaru.
                </p>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }} className="animate-fade-in animate-fade-in-delay-1">
                <SearchBar placeholder="Cari artikel..." onSearch={handleSearch} defaultValue={searchQuery} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.375rem 0.875rem',
                                borderRadius: '9999px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: activeCategory === cat
                                    ? 'linear-gradient(135deg, var(--color-accent), #a855f7)'
                                    : 'var(--color-bg-tertiary)',
                                color: activeCategory === cat ? 'white' : 'var(--color-text-secondary)',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
                    <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tidak ada artikel ditemukan</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Belum ada artikel yang dipublish.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((article, i) => (
                        <div key={article.id} className={`animate-fade-in animate-fade-in-delay-${(i % 3) + 1}`}>
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
                </div>
            </div>
        }>
            <ArticlesContent />
        </Suspense>
    )
}
