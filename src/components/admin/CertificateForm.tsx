'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Upload, X, FileText, Loader2, Save, Image as ImageIcon, Calendar } from 'lucide-react'
import type { Certificate, CertificateCategory, ArticleStatus } from '@/lib/types'

interface CertificateFormProps {
    initialData?: Certificate
}

export default function CertificateForm({ initialData }: CertificateFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)

    // Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        issuer: initialData?.issuer || '',
        issue_date: initialData?.issue_date || new Date().toISOString().split('T')[0],
        credential_id: initialData?.credential_id || '',
        credential_url: initialData?.credential_url || '',
        description: initialData?.description || '',
        category: initialData?.category || 'course',
        is_featured: initialData?.is_featured || false,
        status: initialData?.status || 'draft',
        published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : ''
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB')
                return
            }
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.type !== 'application/pdf') {
                alert('File must be a PDF')
                return
            }
            setPdfFile(file)
        }
    }

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `${path}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('certificates')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('certificates').getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = initialData?.image_url
            let pdfUrl = initialData?.file_url

            if (imageFile) {
                setUploading(true)
                imageUrl = await uploadFile(imageFile, 'images')
            }

            if (pdfFile) {
                setUploading(true)
                pdfUrl = await uploadFile(pdfFile, 'documents')
            }

            if (!imageUrl) {
                alert('Image is required')
                setLoading(false)
                return
            }

            // Prepare payload
            const payload = {
                ...formData,
                image_url: imageUrl,
                file_url: pdfUrl,
                updated_at: new Date().toISOString(),
                // Ensure published_at is set if status is published and date is missing
                published_at: formData.status === 'published' && !formData.published_at
                    ? new Date().toISOString()
                    : formData.published_at ? new Date(formData.published_at).toISOString() : null
            }

            if (initialData) {
                const { error } = await supabase
                    .from('certificates')
                    .update(payload)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('certificates')
                    .insert([payload])
                if (error) throw error
            }

            // Revalidate cache
            const { revalidatePathAction } = await import('@/app/actions/revalidate')
            await revalidatePathAction('/', 'layout')

            alert('Certificate saved successfully!')
            router.push('/admin/certificates')
            router.refresh()
        } catch (error) {
            console.error('Error saving certificate:', error)
            alert('Error saving certificate')
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Image Upload */}
                <div className="md:col-span-1 space-y-4">
                    <label className="block text-sm font-bold font-mono-tech mb-2">Certificate Image <span className="text-red-500">*</span></label>
                    <div className="relative aspect-[4/3] bg-[var(--color-bg-secondary)] border-2 border-dashed border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors group cursor-pointer overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
                                <ImageIcon size={48} className="mb-2" />
                                <span className="text-xs font-mono-tech">UPLOAD IMAGE</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">Max 5MB. Formats: JPG, PNG, WEBP</p>

                    <div className="pt-4 space-y-4 border-t border-[var(--color-border)]">
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as ArticleStatus })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        {formData.status === 'published' && (
                            <div className="space-y-2 animate-fade-in">
                                <label className="text-sm font-bold font-mono-tech">Published Date</label>
                                <input
                                    type="date"
                                    value={formData.published_at}
                                    onChange={e => setFormData({ ...formData, published_at: e.target.value })}
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Issuer <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.issuer}
                                onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Issue Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                required
                                value={formData.issue_date}
                                onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as CertificateCategory })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            >
                                <option value="course">Course</option>
                                <option value="competition">Competition</option>
                                <option value="award">Award</option>
                                <option value="bootcamp">Bootcamp</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Credential ID</label>
                            <input
                                type="text"
                                value={formData.credential_id}
                                onChange={e => setFormData({ ...formData, credential_id: e.target.value })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold font-mono-tech">Credential URL</label>
                            <input
                                type="url"
                                value={formData.credential_url}
                                onChange={e => setFormData({ ...formData, credential_url: e.target.value })}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold font-mono-tech">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-2 focus:border-[var(--color-accent)] outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold font-mono-tech">Upload PDF (Optional)</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] cursor-pointer transition-colors">
                                <Upload size={16} />
                                <span className="text-sm">Choose PDF</span>
                                <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                            </label>
                            {pdfFile ? (
                                <span className="text-sm text-[var(--color-accent)] flex items-center gap-1"><FileText size={14} /> {pdfFile.name}</span>
                            ) : initialData?.file_url ? (
                                <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><FileText size={14} /> Existing PDF</span>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                        />
                        <label htmlFor="featured" className="text-sm font-mono-tech cursor-pointer select-none">Mark as Featured</label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-[var(--color-border)]">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded font-bold border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-8 py-2 rounded font-bold bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    {(loading || uploading) && <Loader2 className="animate-spin" size={18} />}
                    {loading ? 'Saving...' : 'Save Certificate'}
                </button>
            </div>
        </form>
    )
}
