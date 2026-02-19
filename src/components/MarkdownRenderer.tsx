'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

// Custom Link Component for Security & Styling
const LinkRenderer = (props: any) => {
    const { href, children } = props

    if (!href) return <span>{children}</span>

    // 1. Security Sanitization
    // Block javascript: protocols
    if (href.trim().toLowerCase().startsWith('javascript:')) {
        return <span className="text-red-500 line-through" title="Blocked Script">{children}</span>
    }

    const isInternal = href.startsWith('/') || href.startsWith('#')
    const isAnchor = href.startsWith('#')

    // 2. Styling
    const className = "inline-flex items-center gap-0.5 text-[var(--color-accent)] hover:text-[var(--color-cyan)] underline underline-offset-4 decoration-1 decoration-[var(--color-accent)]/30 hover:decoration-[var(--color-cyan)] transition-all group relative font-medium"

    if (isInternal) {
        if (isAnchor) {
            return <a href={href} className={className}>{children}</a>
        }
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        )
    }

    // External Links
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            {children}
            <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity translate-y-[1px]" />

            {/* Tooltip Preview (CSS only) */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap max-w-[200px] truncate hidden md:block z-10">
                {href}
            </span>
        </a>
    )
}

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="prose prose-invert max-w-none prose-headings:font-mono-tech prose-p:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-text)] prose-code:text-[var(--color-accent)]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: LinkRenderer,
                    // Enhance other elements if needed for consistency
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !match ? (
                            <code className="bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded text-sm font-mono-tech text-[var(--color-accent)] border border-[var(--color-border)]" {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
