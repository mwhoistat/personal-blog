import { useEffect } from 'react'
import TurndownService from 'turndown'
import DOMPurify from 'dompurify'

// Initialize Turndown Service
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
})

// Configure Turndown Rules (Optional: Customize if needed)
turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as any,
    replacement: function (content) {
        return '~~' + content + '~~'
    }
})

turndownService.addRule('paragraph', {
    filter: 'p',
    replacement: function (content) {
        return '\n\n' + content + '\n\n'
    }
})

interface UseSmartPasteProps {
    onPaste: (text: string) => void
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export function useSmartPaste({ onPaste, textareaRef }: UseSmartPasteProps) {
    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        const handlePaste = (e: ClipboardEvent) => {
            // 1. Get Data
            const clipboardData = e.clipboardData
            if (!clipboardData) return

            const html = clipboardData.getData('text/html')
            const plainText = clipboardData.getData('text/plain')

            // If no HTML, let default behavior happen (or handle plain text if needed)
            if (!html) return

            // Prevent default paste
            e.preventDefault()

            // 2. Sanitize HTML
            // Security: Strip scripts, iframes, on* attributes
            const cleanHtml = DOMPurify.sanitize(html, {
                USE_PROFILES: { html: true },
                FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
                FORBID_ATTR: ['style', 'class', 'id', 'onclick', 'onerror', 'onload'],
            })

            // 3. Convert to Markdown
            let markdown = turndownService.turndown(cleanHtml)

            // Normalization: Ensure clean spacing
            markdown = markdown.trim()

            // 4. Insert into Textarea
            // We need to support "insert at cursor" or "replace selection"
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const textBefore = textarea.value.substring(0, start)
            const textAfter = textarea.value.substring(end)

            const newContent = textBefore + markdown + textAfter

            // Call the updating function (passed from parent)
            // But actually, we might want to update the parent state directly. 
            // The parent `onPaste` might expect the FULL new content or just the pasted chunk?
            // Let's assume onPaste expects the FULL new content string to update state.
            onPaste(newContent)

            // Restore cursor position (approximate)
            // We need to wait for the state update to re-render, then set selection.
            // Since we can't easily sync state updates here in a precise way without control,
            // we'll try to set the value manually for immediate effect (if controlled component allows)
            // or rely on the parent updating the value.

            // Actually, for React controlled inputs, setting .value directly is bad.
            // But we prevented default, so the value won't change unless we trigger the state change.
            // The `onPaste` prop should handle `setContent(newContent)`.

            // To set correct cursor position after paste:
            // We need to know the length of the inserted markdown.
            setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + markdown.length, start + markdown.length)
            }, 0)
        }

        textarea.addEventListener('paste', handlePaste)
        return () => textarea.removeEventListener('paste', handlePaste)
    }, [textareaRef, onPaste])
}
