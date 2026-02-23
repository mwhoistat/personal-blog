'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { sanitizeHtml } from '@/lib/html-utils'

// Custom renderer for links to ensure security and styling
const LinkRenderer = ({ href, children, ...props }: any) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'))
    const isAnchor = href && href.startsWith('#')

    if (isInternal) {
        return (
            <Link
                href={href}
                className="text-[var(--color-accent)] hover:underline underline-offset-4 decoration-2 decoration-[var(--color-accent)]/30 hover:decoration-[var(--color-accent)] transition-all"
                {...props}
            >
                {children}
            </Link>
        )
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] inline-flex items-center gap-0.5 hover:underline underline-offset-4 decoration-2 decoration-[var(--color-accent)]/30 hover:decoration-[var(--color-accent)] transition-all group"
            {...props}
        >
            {children}
            <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
    )
}

export default function MarkdownRenderer({ content }: { content: string }) {
    // Crucial: Sanitize the raw HTML output from Tiptap/Database BEFORE parsing to stop XSS
    const safeContent = sanitizeHtml(content)

    return (
        <div className="prose prose-invert max-w-none prose-headings:font-mono-tech prose-p:text-[var(--color-text-secondary)] prose-strong:text-[var(--color-text)] prose-code:text-[var(--color-accent)]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    a: LinkRenderer,
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        // @ts-ignore
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
                {safeContent}
            </ReactMarkdown>
        </div>
    )
}
