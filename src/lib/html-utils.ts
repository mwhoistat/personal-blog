import DOMPurify from 'isomorphic-dompurify'

/**
 * Safely strips all HTML tags from a string.
 * This is useful for generating clean, text-only excerpts from Rich Text content.
 */
export function stripHtmlTags(html: string): string {
    if (!html) return ''

    // Server-side safe approach to stripping HTML using regex
    // We use a robust regex to target <...> blocks
    return html.replace(/<[^>]*>?/gm, '')
}

/**
 * Generates a clean, plain-text excerpt of a specified maximum length.
 * It will not cut HTML tags in half because all tags are stripped first.
 */
export function generateExcerpt(htmlContent: string, maxLength: number = 150): string {
    if (!htmlContent) return ''

    // 1. Strip all HTML tags to get pure text
    const cleanText = stripHtmlTags(htmlContent)

    // 2. Decode common HTML entities (if any remain like &amp;)
    const decodedText = cleanText
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

    // 3. Trim whitespace and newlines
    const normalizedText = decodedText.replace(/\s+/g, ' ').trim()

    // 4. Substring to maxLength and append ellipsis
    if (normalizedText.length <= maxLength) {
        return normalizedText
    }

    // Try to break at the last full word
    const truncated = normalizedText.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')

    if (lastSpaceIndex > maxLength * 0.8) {
        return truncated.substring(0, lastSpaceIndex) + '...'
    }

    return truncated + '...'
}

/**
 * Safely sanitizes dirty HTML for rendering on the public pages.
 * Prevents XSS attacks by strictly allowing only typography/formatting tags.
 */
export function sanitizeHtml(dirtyHtml: string): string {
    if (!dirtyHtml) return ''

    return DOMPurify.sanitize(dirtyHtml, {
        ALLOWED_TAGS: [
            'p', 'br', 'b', 'i', 'em', 'strong', 'a',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote',
            'pre', 'code', 'img', 'del', 'u'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'class'],
        // Force all links to open in a new tab securely if they are external
        // (DOMPurify handles rel="noopener noreferrer" naturally with hook or configuration, 
        // but we rely on our MarkdownRenderer's LinkRenderer for component mapping anyway)
    })
}
