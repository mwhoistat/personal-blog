'use client'

import { useState, useEffect, useRef } from 'react'
import { Link2, X, Check } from 'lucide-react'

interface FloatingLinkToolbarProps {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    onInsertLink: (url: string) => void
}

export default function FloatingLinkToolbar({ textareaRef, onInsertLink }: FloatingLinkToolbarProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
    const [url, setUrl] = useState('')
    const [showInput, setShowInput] = useState(false)
    const toolbarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleSelectionChange = () => {
            const textarea = textareaRef.current
            if (!textarea) return

            // We only care if the textarea is focused
            if (document.activeElement !== textarea) {
                // Delay hiding locally to allow interaction with toolbar
                if (!toolbarRef.current?.contains(document.activeElement)) {
                    // setIsVisible(false) 
                }
                return
            }

            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (start !== end) {
                // Text is selected! Calculate position.
                // This is tricky for a raw textarea. We can use a mirror div or just estimate based on cursor.
                // For simplicity/robustness without heavy libs, we might position strictly near mouse or cursor if possible.
                // OR, we use a library like 'textarea-caret' to get coordinates.
                // Since we don't have that installed, let's just show it fixed near the top of the selection or cursor.
                // Actually, a simple 'near cursor' logic:
                // We can't easily get XY of selection in textarea without a helper.
                // Fallback: Show specific toolbar at top of textarea or near mouse?
                // Let's rely on mouseup event for positioning in this version.
            } else {
                setIsVisible(false)
                setShowInput(false)
            }
        }

        const handleMouseUp = (e: MouseEvent) => {
            const textarea = textareaRef.current
            if (!textarea || e.target !== textarea) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (start !== end) {
                // Calculate position relative to viewport
                // We'll place it above the mouse cursor for simplicity as getting exact text coord is hard
                // Ideally we check bounds.
                const rect = textarea.getBoundingClientRect()
                // Simple positioning: e.clientY - 40
                setPosition({
                    top: e.clientY - 50,
                    left: e.clientX
                })
                setIsVisible(true)
            }
        }

        document.addEventListener('selectionchange', handleSelectionChange)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [textareaRef])

    if (!isVisible) return null

    return (
        <div
            ref={toolbarRef}
            className="fixed z-50 flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-accent)] rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-fade-in"
            style={{
                top: position?.top + 'px',
                left: position?.left + 'px',
                transform: 'translateX(-20%)' // Shift slightly to center
            }}
        >
            {!showInput ? (
                <>
                    <button
                        onClick={() => { setShowInput(true); setUrl('') }}
                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg)] rounded transition-colors"
                        title="Add Link"
                    >
                        <Link2 size={16} />
                    </button>
                    {/* Could add Bold/Italic buttons here too invoking a callback */}
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-48 bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono-tech focus:border-[var(--color-accent)] outline-none text-[var(--color-text)]"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                onInsertLink(url)
                                setIsVisible(false)
                                setShowInput(false)
                            }
                            if (e.key === 'Escape') {
                                setShowInput(false)
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            onInsertLink(url)
                            setIsVisible(false)
                            setShowInput(false)
                        }}
                        className="p-1 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={() => setShowInput(false)}
                        className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--color-accent)]" />
        </div>
    )
}
