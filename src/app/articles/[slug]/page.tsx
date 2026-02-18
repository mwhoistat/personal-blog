'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MarkdownRenderer from '@/components/MarkdownRenderer'

import { ArticleDetailSkeleton } from '@/components/Skeleton'
import { formatDate } from '@/lib/utils'
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Article } from '@/lib/types'

const demoArticle: Article = {
    id: '1',
    title: 'Memulai dengan Next.js 14 dan App Router',
    slug: 'memulai-nextjs-14',
    content: `# Memulai dengan Next.js 14

Next.js 14 membawa banyak peningkatan performa dan fitur baru yang menarik. Dalam artikel ini, kita akan membahas cara memulai proyek baru dengan Next.js 14.

## Apa yang Baru di Next.js 14?

### 1. Turbopack (Stable)
Turbopack sekarang sudah stable dan memberikan peningkatan kecepatan development yang signifikan.

### 2. Server Actions (Stable)
Server Actions memungkinkan kita menjalankan kode server langsung dari komponen.

\`\`\`typescript
async function createArticle(data: FormData) {
  'use server'
  const title = data.get('title')
  // Insert to database
}
\`\`\`

### 3. Partial Prerendering
Fitur baru yang menggabungkan static dan dynamic rendering.

## Instalasi

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Struktur Folder

Next.js 14 menggunakan App Router secara default:

| Folder | Fungsi |
|--------|--------|
| \`app/\` | Routing dan layout |
| \`components/\` | Komponen reusable |
| \`lib/\` | Utility dan helpers |
| \`public/\` | Asset statis |

## Kesimpulan

Next.js 14 adalah framework yang powerful untuk membangun aplikasi web modern. Dengan fitur-fitur barunya, development menjadi lebih cepat dan efisien.

> **Tips:** Selalu gunakan TypeScript untuk keamanan tipe data yang lebih baik.

Selamat mencoba! 🚀`,
    excerpt: 'Panduan lengkap untuk memulai proyek dengan Next.js 14 menggunakan App Router.',
    cover_image: 'https://picsum.photos/seed/nextjs/1200/600',
    category: 'Tutorial',
    tags: ['nextjs', 'react', 'webdev', 'typescript'],
    published: true,
    view_count: 234,
    author_id: '1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
}

export default function ArticleDetailPage() {
    const params = useParams()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchArticle = useCallback(async () => {
        const supabase = createClient()
        try {
            const { data } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', params.slug)
                .single()
            if (data) {
                setArticle(data)
                // Increment view count
                await supabase.rpc('increment_view_count', { table_name: 'articles', record_slug: params.slug as string })
            } else {
                setArticle(demoArticle)
            }
        } catch {
            setArticle(demoArticle)
        } finally {
            setLoading(false)
        }
    }, [params.slug])

    useEffect(() => { fetchArticle() }, [fetchArticle])

    if (loading) return <ArticleDetailSkeleton />
    if (!article) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <p>Artikel tidak ditemukan.</p>
            <Link href="/articles" style={{ color: 'var(--color-accent)' }}>Kembali ke daftar artikel</Link>
        </div>
    )

    return (
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }} className="animate-fade-in">
            {/* Back */}
            <Link href="/articles" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                transition: 'color 0.2s ease',
            }}>
                <ArrowLeft size={16} />
                Kembali
            </Link>

            {/* Category */}
            <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                color: 'white',
                marginBottom: '1rem',
            }}>
                {article.category}
            </span>

            {/* Title */}
            <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '1rem',
                letterSpacing: '-0.025em',
            }}>
                {article.title}
            </h1>

            {/* Meta */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={14} />
                    {formatDate(article.created_at)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Eye size={14} />
                    {article.view_count} views
                </span>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {article.tags?.map((tag) => (
                    <span key={tag} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: 'var(--color-bg-tertiary)',
                        color: 'var(--color-text-secondary)',
                    }}>
                        <Tag size={10} />
                        {tag}
                    </span>
                ))}
            </div>

            {/* Cover */}
            {article.cover_image && (
                <div style={{
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    marginBottom: '2rem',
                    border: '1px solid var(--color-border)',
                }}>
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            )}

            {/* Content */}
            <MarkdownRenderer content={article.content} />


        </article>
    )
}
