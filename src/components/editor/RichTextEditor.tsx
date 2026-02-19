'use client'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useCallback, useEffect, useRef } from 'react'
import { Bold, Italic, Link2, Code, List, Heading1, Heading2, Quote, Image as ImageIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import DOMPurify from 'isomorphic-dompurify'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

export default function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const supabase = createClient()
    // Use ref to access editor inside uploadImage (which is passed to userEditor)
    const editorRef = useRef<any>(null)

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            // 1. Optimistic UI: Insert local blob URL immediately
            const blobUrl = URL.createObjectURL(file)
            if (editorRef.current) {
                editorRef.current.chain().focus().setImage({ src: blobUrl }).run()
            }

            // 2. Compress Image
            let fileToUpload = file
            try {
                // Dynamically import to avoid server-side issues (though this is a client component)
                const { compressImage } = await import('@/lib/image-compression')
                fileToUpload = await compressImage(file)
            } catch (compressionError) {
                console.warn('Image compression failed, falling back to original', compressionError)
            }

            const fileExt = fileToUpload.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `article-images/${fileName}`

            // 3. Upload in background
            const { error: uploadError } = await supabase.storage
                .from('content_assets')
                .upload(filePath, fileToUpload, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('content_assets').getPublicUrl(filePath)

            // 3. Replace blob URL with actual public URL
            if (editorRef.current) {
                const { state, view } = editorRef.current
                state.doc.descendants((node: any, pos: number) => {
                    if (node.type.name === 'image' && node.attrs.src === blobUrl) {
                        const transaction = view.state.tr.setNodeMarkup(pos, null, { ...node.attrs, src: data.publicUrl })
                        view.dispatch(transaction)
                        return false // Stop traversal
                    }
                    return true
                })
            }

            return data.publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Gagal mengupload gambar')
            // Revert optimistic update? For now just alert.
            // Ideally we remove the node with the blobUrl
            return null
        }
    }

    const addImage = useCallback(() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async () => {
            if (input.files?.length) {
                // Don't await here to unblock UI
                uploadImage(input.files[0])
            }
        }
        input.click()
    }, []) // No dependency needed as we use ref

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-h-[500px] w-auto mx-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[var(--color-accent)] underline underline-offset-4 cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Mulai menulis cerita Anda...',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2',
            },
            handlePaste: (view, event, slice) => {
                const text = event.clipboardData?.getData('text/plain')
                const html = event.clipboardData?.getData('text/html')

                // 1. Prioritize HTML if available (Gemini usually sends structured HTML)
                if (html && html.trim().length > 0) {
                    // Sanitize HTML to ensure we only get clean structure
                    // We strip styles to prevent weird collapsing issues and force Tiptap to use its node structure
                    const cleanHtml = DOMPurify.sanitize(html, {
                        ALLOWED_TAGS: ['p', 'div', 'br', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'blockquote', 'a'],
                        ALLOWED_ATTR: ['href', 'target', 'rel'], // Strip class and style
                    })

                    // If the sanitized HTML is empty or just text, fall back to plain text parser
                    if (cleanHtml.trim().length > 0 && cleanHtml !== text) {
                        editorRef.current?.commands.insertContent(cleanHtml)
                        return true
                    }
                }

                // 2. Fallback: Custom Plain Text Parser
                // Used when HTML is missing or invalid
                if (text && text.trim().length > 0) {
                    event.preventDefault()

                    // Normalize
                    let processed = text
                        .replace(/\r\n/g, '\n')
                        .replace(/\u200B/g, '')

                    // Split by double newlines for Paragraphs (standard LLM output)
                    const paragraphs = processed.split(/\n\s*\n/)

                    const htmlContent = paragraphs.map((para: string) => {
                        if (!para.trim()) return ''
                        // Handle formatting manually if needed, or just wrap in <p>
                        // Convert internal newlines to <br>
                        const safeText = para
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\n/g, '<br>')

                        return `<p>${safeText}</p>`
                    }).join('')

                    editorRef.current?.commands.insertContent(htmlContent)
                    return true
                }

                return false
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0]
                    if (file.type.startsWith('image/')) {
                        // We use optimistic upload, so just trigger it and preventing default generic insertion
                        uploadImage(file)
                        return true
                    }
                }
                return false
            }
        },
        immediatelyRender: false, // Fix hydration mismatch
    })

    // Update ref whenever editor instance changes
    useEffect(() => {
        editorRef.current = editor
    }, [editor])

    // Sync content if it changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only updates if content is significantly different to avoid cursor jumps
            // editor.commands.setContent(content) 
            // BE CAREFUL: This causes cursor jumps on every keystroke if not managed.
            // Usually better to only set initial content or treat as uncontrolled after init.
            // We'll rely on initial content for now.
            // Check if content is empty (initial load)
            if (editor.isEmpty) {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])


    if (!editor) return null

    return (
        <div className="relative w-full">
            {/* Bubble Menu: Appears on Selection */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 p-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('bold') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('italic') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('underline') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <span className="underline decoration-2">U</span>
                    </button>
                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
                    <button
                        onClick={() => {
                            const url = window.prompt('URL:')
                            if (url) editor.chain().focus().setLink({ href: url }).run()
                        }}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('link') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Link2 size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('code') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Code size={16} />
                    </button>
                </BubbleMenu>
            )}

            {/* Floating Menu: Appears on new line */}
            {editor && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 p-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl ml-[-40px]">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('heading', { level: 1 }) ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('heading', { level: 2 }) ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('bulletList') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] ${editor.isActive('blockquote') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        <Quote size={18} />
                    </button>
                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
                    <button
                        onClick={addImage}
                        className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                        title="Upload Image"
                    >
                        <ImageIcon size={18} />
                    </button>
                </FloatingMenu>
            )}

            <EditorContent editor={editor} />
        </div>
    )
}
