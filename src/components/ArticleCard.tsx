import Link from 'next/link'
import { Calendar, Eye, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/lib/types'

export default function ArticleCard({ article }: { article: Article }) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="card-interactive"
            style={{
                display: 'block',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-secondary)',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
            }}
        >
            {article.cover_image && (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="card-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}
            <div style={{ padding: '1.25rem' }}>
                {/* Category & Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                        padding: '0.125rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        color: 'white',
                    }}>
                        {article.category}
                    </span>
                    {article.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            backgroundColor: 'var(--color-bg-tertiary)',
                            color: 'var(--color-text-muted)',
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                    letterSpacing: '-0.015em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {article.excerpt}
                </p>

                {/* Meta */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            {formatDate(article.created_at)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye size={12} />
                            {article.view_count}
                        </span>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--color-accent)' }} />
                </div>
            </div>
        </Link>
    )
}
