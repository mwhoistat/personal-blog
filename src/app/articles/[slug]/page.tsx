import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ViewCounter from '@/components/ViewCounter'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const supabase = createClient()

    // Server-side fetch
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single()

    if (!article) {
        notFound()
    }

    const tags = Array.isArray(article.tags) ? article.tags : []

    return (
        <article className="min-h-screen pb-20">
            <ViewCounter slug={article.slug} table="articles" />
            {/* Header / Hero */}
            <div className="pt-32 pb-12 px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/articles" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-8 font-mono-tech text-sm transition-colors">
                        <ArrowLeft size={16} /> ../back_to_logs
                    </Link>

                    <div className="flex items-center gap-4 text-xs font-mono-tech text-[var(--color-accent)] mb-6">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]"></span>
                        <span>{article.category || 'GENERAL'}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{article.title}</h1>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-xs text-[var(--color-text-secondary)]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            </div>

            {/* Cover Image */}
            {article.cover_image && (
                <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 mb-12">
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] shadow-2xl">
                        <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-pre:bg-[var(--color-bg-secondary)] prose-pre:border prose-pre:border-[var(--color-border)] prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
                <MarkdownRenderer content={article.content} />
            </div>
        </article>
    )
}
