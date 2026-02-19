'use client'

import DOMPurify from 'isomorphic-dompurify'
import parse, { DOMNode, Element } from 'html-react-parser'

interface RichTextRendererProps {
    content: string
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
    if (!content) return null

    // 1. Sanitize HTML
    // Allow strict set of tags and attributes to prevent XSS
    const cleanHTML = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
            'p', 'b', 'i', 'em', 'strong', 'u', 'a', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li',
            'blockquote', 'code', 'pre', 'img', 'br', 'hr', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onmouseover', 'onclick', 'onerror'],
    })

    // 2. Custom Parsing (Optional)
    // We can use html-react-parser to replace specific elements with React components if needed
    // (e.g., transforming <img> to Next.js <Image>)
    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === 'a') {
                // Ensure external links have noopener noreferrer
                const href = domNode.attribs.href || ''
                if (href.startsWith('http')) {
                    domNode.attribs.target = '_blank'
                    domNode.attribs.rel = 'noopener noreferrer'
                }
                domNode.attribs.class = "text-[var(--color-accent)] hover:text-[var(--color-cyan)] underline underline-offset-4 decoration-1 transition-colors"
            }
            if (domNode instanceof Element && domNode.name === 'img') {
                domNode.attribs.class = "rounded-lg shadow-lg border border-[var(--color-border)] my-6 w-full h-auto"
                domNode.attribs.loading = "lazy"
            }
            if (domNode instanceof Element && domNode.name === 'blockquote') {
                domNode.attribs.class = "border-l-4 border-[var(--color-accent)] pl-4 italic text-[var(--color-text-secondary)] my-4 bg-[var(--color-bg-secondary)] py-2 pr-2 rounded-r"
            }
        }
    }

    return (
        <div className="prose prose-invert max-w-none prose-headings:font-mono-tech prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed prose-strong:text-[var(--color-text)] prose-code:text-[var(--color-accent)] prose-code:bg-[var(--color-bg-secondary)] prose-code:px-1 prose-code:rounded prose-pre:bg-[var(--color-bg-secondary)] prose-pre:border prose-pre:border-[var(--color-border)]">
            {parse(cleanHTML, options)}
        </div>
    )
}
