import { useCallback } from 'react'
import TurndownService from 'turndown'

// Initialize Turndown Service
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
})

turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as any,
    replacement: function (content) {
        return '~' + content + '~'
    }
})

turndownService.addRule('fencedCodeBlock', {
    filter: function (node, options) {
        return (
            options.codeBlockStyle === 'fenced' &&
            node.nodeName === 'PRE' &&
            node.firstChild &&
            node.firstChild.nodeName === 'CODE'
        )
    },
    replacement: function (content, node, options) {
        const className = (node.firstChild as HTMLElement).className || ''
        const language = (className.match(/language-(\S+)/) || [null, ''])[1]
        return (
            '\n\n' + options.fence + language + '\n' +
            node.textContent +
            '\n' + options.fence + '\n\n'
        )
    }
})

export function useSmartPaste() {
    const handlePaste = useCallback((
        e: React.ClipboardEvent<HTMLTextAreaElement>,
        setContent: (value: string) => void
    ) => {
        const clipboardData = e.clipboardData
        const types = clipboardData.types

        if (types.includes('text/html')) {
            e.preventDefault()
            const html = clipboardData.getData('text/html')
            const markdown = turndownService.turndown(html)

            const textarea = e.currentTarget
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const text = textarea.value

            const newText = text.substring(0, start) + markdown + text.substring(end)
            const newCursorPos = start + markdown.length

            // Update State
            setContent(newText)

            // Restore Cursor (Next Tick)
            requestAnimationFrame(() => {
                textarea.setSelectionRange(newCursorPos, newCursorPos)
                textarea.focus()
            })
        }
    }, [])

    return { handlePaste }
}
