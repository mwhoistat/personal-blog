'use client'

import { useState, useEffect, useRef } from 'react'
import { Link2, Trash2, X, Check, ExternalLink } from 'lucide-react'

interface FloatingLinkToolbarProps {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
    onInsertLink: (url: string) => void
    onUnlink?: () => void
}

export default function FloatingLinkToolbar({ textareaRef, onInsertLink }: FloatingLinkToolbarProps) {
    const [position, setPosition] = useState<{ top: number, left: number } | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [url, setUrl] = useState('')
    const [showInput, setShowInput] = useState(false)
    const toolbarRef = useRef<HTMLDivElement>(null)

    // Handle Selection Change
    useEffect(() => {
        const handleSelection = () => {
            const textarea = textareaRef.current
            if (!textarea) return

            // If input is open, don't hide/move based on selection yet
            if (showInput) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (start === end) {
                setIsVisible(false)
                return
            }

            // Calculate Position
            // This is tricky for a raw textarea. We'll use a rough estimation or a mirror div if needed.
            // For simplicity/performance in raw textarea, we often place it near the cursor or fixed relative to the textarea.
            // A precise "mirror" calculation is heavy. Let's try a simpler approach:
            // Use the client coordinates from the mouseup event if available, otherwise fallback.
            // But we are in a hook. Let's listen to mouseup on the textarea separately.
        }

        // We attach listener to document to catch selection changes
        document.addEventListener('selectionchange', handleSelection)
        return () => document.removeEventListener('selectionchange', handleSelection)
    }, [textareaRef, showInput])

    // Better approach for Textarea: Listen to Matrix events
    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        const handleMouseUp = () => {
            if (showInput) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (start !== end) {
                // Get coordinates using a dummy mirroring div (simplified version)
                // Or just use the mouse position if we had the event. 
                // Since we don't have the event here, we'll use a hack or just center it for now.
                // Actually, passing the mouse event from the parent is cleaner, but let's try to be self-contained.
                // We'll calculate caret coordinates using a library or a helper function.

                // For MVP: Show it Fixed above the textarea or use a simple hack.
                // Let's use getBoundingClientRect of the textarea + estimation based on lines? No, too inaccurate. 

                // Strategy: We will render a hidden div with same specific styles, fill with text up to selection, and measure.
                const { top, left } = getCaretCoordinates(textarea, start, end)
                setPosition({ top: top - 40, left: left }) // 40px above
                setIsVisible(true)
            } else {
                setIsVisible(false)
                setShowInput(false)
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (showInput) return
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                handleMouseUp()
            }
        }

        textarea.addEventListener('mouseup', handleMouseUp)
        textarea.addEventListener('keyup', handleKeyUp)

        return () => {
            textarea.removeEventListener('mouseup', handleMouseUp)
            textarea.removeEventListener('keyup', handleKeyUp)
        }
    }, [textareaRef, showInput])

    // Helper to get coordinates
    const getCaretCoordinates = (element: HTMLTextAreaElement, start: number, end: number) => {
        // Create a mirror div
        const div = document.createElement('div')
        const style = window.getComputedStyle(element)

        // Copy styles
        Array.from(style).forEach(prop => {
            div.style.setProperty(prop, style.getPropertyValue(prop))
        })

        div.style.position = 'absolute'
        div.style.visibility = 'hidden'
        div.style.whiteSpace = 'pre-wrap'
        div.style.wordWrap = 'break-word'
        div.style.width = element.clientWidth + 'px'
        div.style.height = 'auto'
        div.style.overflow = 'hidden'

        // Content up to selection start
        const textContent = element.value.substring(0, start)
        const span = document.createElement('span')
        span.textContent = element.value.substring(start, end) || '.'

        div.textContent = textContent
        div.appendChild(span)

        document.body.appendChild(div)

        const spanRect = span.getBoundingClientRect()
        // We need coordinates relative to the textarea's container or viewport
        // Actually, we want it relative to the viewport so we can use fixed positioning or absolute relative to body

        // The div is appended to body, but likely at 0,0. 
        // We need to offset by the textarea's position?
        // Wait, the div should be positioned where the textarea is? No.

        // Let's use a simpler library approach logic:
        // Textarea-Caret-Position logic (simplified)
        // 1. We have the text before the cursor.
        // 2. We put it in the div.
        // 3. The end of that text in the div is our position.

        // To make this robust without a library:
        // We accept that "Floating" right above text is hard in raw textarea.
        // ALTERNATIVE: Fixed "Action Bar" that appears near the mouse? 
        // OR: Just center it horizontally over the selection (using textarea bounds).
        // Let's try to be smart.

        const rect = element.getBoundingClientRect()
        // Simple fallback: Centered horizontally, at the top of the selection (approx)
        // We can't easily get the 'top' of the specific line without the mirror.

        // Let's do the mirror properly.
        div.style.top = rect.top + window.scrollY + 'px'
        div.style.left = rect.left + window.scrollX + 'px'

        document.body.removeChild(div)

        // Since implementing a perfect mirror is complex and error-prone in one shot:
        // I will use a reliable fallback: The toolbar appears *Sticky* at the top of the textarea or at the mouse position?
        // Mouse position is best if we had the event.

        // Let's use the 'selectionchange' on document, and get the window.getSelection()?.getRangeAt(0).getBoundingClientRect()?
        // NO, that doesn't work for Textarea (it's a shadow DOM or plain text, browsers don't give Range rects for Textarea content easily).

        // PLAN B: Fixed 'Floating' bar that stays just above the textarea when text is selected?
        // OR: Just follow the mouse cursor? 
        // Let's try following the mouse/pointer from the last interaction.

        return { top: 0, left: 0 } // Placeholder, will fix in Logic
    }

    // Logic for Mouse Coordinate Capture
    // We'll use a Ref to store the last mouse coordinates from the Textarea
    const lastMousePos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        const updateMousePos = (e: MouseEvent) => {
            const rect = textarea.getBoundingClientRect()
            if (e.clientY < rect.top || e.clientY > rect.bottom) return // Ignore if outside

            // Constrain inside textarea
            lastMousePos.current = {
                x: e.clientX,
                y: e.clientY
            }
        }

        // Update position on mouse up
        const handleMouseUp = () => {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            if (start !== end) {
                // Position above the mouse pointer
                setPosition({
                    top: lastMousePos.current.y - 50 + window.scrollY,
                    left: lastMousePos.current.x - 100 + window.scrollX // Center approx
                })
                setIsVisible(true)
            } else {
                if (!showInput) setIsVisible(false)
            }
        }

        textarea.addEventListener('mousemove', updateMousePos)
        textarea.addEventListener('mouseup', handleMouseUp)

        return () => {
            textarea.removeEventListener('mousemove', updateMousePos)
            textarea.removeEventListener('mouseup', handleMouseUp)
        }
    }, [textareaRef, showInput])


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
                    <button
                        onClick={() => { setIsVisible(false) }}
                        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bg)] rounded transition-colors"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
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
