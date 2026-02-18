'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'
import { ArticleCardSkeleton } from '@/components/Skeleton'
import { BookOpen } from 'lucide-react'
import type { Article } from '@/lib/types'

const demoArticles: Article[] = [
    { id: '1', title: 'Memulai dengan Next.js 14 dan App Router', slug: 'memulai-nextjs-14', content: '# Memulai dengan Next.js 14\n\nNext.js 14 membawa banyak peningkatan...', excerpt: 'Panduan lengkap untuk memulai proyek dengan Next.js 14 menggunakan App Router.', cover_image: 'https://picsum.photos/seed/nextjs/800/400', category: 'Tutorial', tags: ['nextjs', 'react', 'webdev'], published: true, view_count: 234, author_id: '1', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
    { id: '2', title: 'TypeScript Best Practices', slug: 'typescript-best-practices', content: '', excerpt: 'Tips dan trik TypeScript yang meningkatkan kualitas kode.', cover_image: 'https://picsum.photos/seed/typescript/800/400', category: 'Programming', tags: ['typescript', 'javascript'], published: true, view_count: 189, author_id: '1', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
    { id: '3', title: 'Desain UI Modern dengan Tailwind CSS', slug: 'desain-ui-tailwind', content: '', excerpt: 'Cara membuat desain UI/UX yang beautiful dan responsive.', cover_image: 'https://picsum.photos/seed/tailwind/800/400', category: 'Design', tags: ['tailwindcss', 'ui', 'design'], published: true, view_count: 156, author_id: '1', created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' },
    { id: '4', title: 'Panduan Supabase untuk Fullstack Dev', slug: 'panduan-supabase', content: '', excerpt: 'Pelajari cara menggunakan Supabase sebagai backend modern.', cover_image: 'https://picsum.photos/seed/supabase/800/400', category: 'Backend', tags: ['supabase', 'database'], published: true, view_count: 312, author_id: '1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '5', title: 'React Hooks yang Wajib Dikuasai', slug: 'react-hooks-wajib', content: '', excerpt: 'Hooks penting di React yang sering digunakan dalam development.', cover_image: 'https://picsum.photos/seed/hooks/800/400', category: 'Programming', tags: ['react', 'hooks'], published: true, view_count: 245, author_id: '1', created_at: '2023-12-28T00:00:00Z', updated_at: '2023-12-28T00:00:00Z' },
    { id: '6', title: 'Deploy Aplikasi ke Vercel', slug: 'deploy-vercel', content: '', excerpt: 'Langkah mudah deploy aplikasi Next.js ke Vercel.', cover_image: 'https://picsum.photos/seed/vercel/800/400', category: 'DevOps', tags: ['vercel', 'deploy'], published: true, view_count: 178, author_id: '1', created_at: '2023-12-20T00:00:00Z', updated_at: '2023-12-20T00:00:00Z' },
]

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
            setArticles(data?.length ? data : demoArticles)
        } catch {
            setArticles(demoArticles)
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
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Coba kata kunci atau kategori lain.</p>
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
