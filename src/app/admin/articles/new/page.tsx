import { useState, useRef } from 'react' // Added useRef
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { logActivity } from '@/lib/activity'
import { ArrowLeft, Save, Eye, EyeOff, Bold, Italic, Heading, Link2, Code, List, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useSmartPaste } from '@/hooks/useSmartPaste' // Import Hook

export default function NewArticlePage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [category, setCategory] = useState('Tutorial')
    const [tags, setTags] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [showSettings, setShowSettings] = useState(true)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null) // Create Ref

    // Smart Paste Integration
    useSmartPaste({
        textareaRef,
        onPaste: (newContent) => setContent(newContent)
    })

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text })
        setTimeout(() => setToast(null), 3000)
    }

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current // Use Ref
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = content.substring(start, end)
        const replacement = `${prefix}${selected || 'teks'}${suffix}`
        const newContent = content.substring(0, start) + replacement + content.substring(end)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'teks').length)
        }, 0)
    }

    // ... rest of code ...

    return (
        <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
            {/* ... code ... */}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* ... existing fields ... */}

                {/* Markdown Editor */}
                <div>
                    {/* ... header ... */}

                    {/* Toolbar */}
                    {!showPreview && (
                        {/* ... toolbar buttons ... */ }
                    )}

                    {showPreview ? (
                        <div style={{
                            minHeight: '400px', padding: '1.5rem',
                            border: '1px solid var(--color-border)', borderRadius: '0.5rem',
                            backgroundColor: 'var(--color-bg-secondary)', overflow: 'auto',
                        }}>
                            {content ? <MarkdownRenderer content={content} /> : (
                                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada konten untuk di-preview...</p>
                            )}
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef} // Attach Ref
                            id="md-editor"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tulis konten artikel dalam Markdown..." rows={20}
                            style={{
                                ...inputStyle, resize: 'vertical', lineHeight: 1.7,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                                fontSize: '0.875rem',
                                borderRadius: showPreview ? '0.5rem' : '0 0 0.5rem 0.5rem',
                            }} required />
                    )}
                </div>

                {/* ... submit button ... */}
            </form>
        </div>
    )
}
