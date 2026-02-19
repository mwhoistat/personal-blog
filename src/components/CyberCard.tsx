import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Calendar, Clock, Tag } from 'lucide-react'

interface CyberCardProps {
    title: string
    excerpt: string
    slug: string
    type: 'article' | 'project'
    date?: string
    readTime?: string
    tags?: string[]
    image?: string
}

export default function CyberCard({ title, excerpt, slug, type, date, readTime, tags, image }: CyberCardProps) {
    const href = `/${type}s/${slug}`

    return (
        <Link href={href} className="group block h-full">
            <article className="cyber-card h-full flex flex-col relative overflow-hidden">
                {/* Tech Decoration Lines */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--color-accent)]/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-accent)]/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Image Section (Optional) */}
                {image && (
                    <div className="relative h-48 w-full overflow-hidden border-b border-[var(--color-border)]">
                        <div className="absolute inset-0 bg-[var(--color-accent)]/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Header Meta */}
                    <div className="flex items-center gap-3 text-xs font-mono-tech text-[var(--color-accent)] mb-3 opacity-80">
                        <span className="uppercase tracking-wider">[{type.toUpperCase()}]</span>
                        {date && (
                            <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                                <Calendar size={12} /> {new Date(date).toLocaleDateString('id-ID')}
                            </span>
                        )}
                        {readTime && (
                            <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                                <Clock size={12} /> {readTime} min read
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 line-clamp-3">
                        {excerpt}
                    </p>

                    {/* Bottom Meta */}
                    <div className="mt-auto pt-4 border-t border-[var(--color-border)]/50 flex justify-between items-center text-xs font-mono-tech">
                        <div className="flex gap-2 flex-wrap">
                            {tags?.slice(0, 3).map((tag) => (
                                <span key={tag} className="flex items-center gap-1 text-[var(--color-text-muted)] group-hover:text-[var(--color-cyan)] transition-colors">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                        <span className="flex items-center gap-1 text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                            EXECUTE <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
