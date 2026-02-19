'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Award, Calendar, ExternalLink, Loader2, FileText, CheckCircle2, Search, Filter, X } from 'lucide-react'
import type { Certificate } from '@/lib/types'
import Link from 'next/link'

export default function CertificatesPublicPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
    const [filter, setFilter] = useState('all')
    const supabase = createClient()

    useEffect(() => {
        const fetchCertificates = async () => {
            const { data } = await supabase
                .from('certificates')
                .select('*')
                .eq('status', 'published')
                .lte('published_at', new Date().toISOString())
                .order('is_featured', { ascending: false })
                .order('issue_date', { ascending: false })

            if (data) setCertificates(data)
            setLoading(false)
        }
        fetchCertificates()
    }, [])

    const filtered = filter === 'all'
        ? certificates
        : certificates.filter(c => c.category === filter)

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedCert) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [selectedCert])

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-16 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 text-xs font-mono-tech mb-4">
                        <Award size={12} />
                        <span>CREDENTIALS_DB</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-mono-tech mb-4 tracking-tight">
                        Certificates & <span className="text-[var(--color-accent)]">Awards</span>
                    </h1>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        A collection of verified authentications, professional courses, and industry recognitions acquired throughout my journey.
                    </p>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {['all', 'course', 'competition', 'award', 'bootcamp', 'other'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-mono-tech transition-all uppercase border
                                ${filter === cat
                                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)] font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="flex flex-col items-center gap-4 text-[var(--color-accent)]">
                            <Loader2 className="animate-spin" size={40} />
                            <span className="font-mono-tech text-sm animate-pulse">SYNCING_DATABASE...</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((cert, i) => (
                            <div
                                key={cert.id}
                                onClick={() => setSelectedCert(cert)}
                                className="group relative bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] cursor-pointer transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-secondary)] to-transparent opacity-60 z-10" />
                                    <img
                                        src={cert.image_url}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`
                                            px-3 py-1 text-[10px] font-bold font-mono-tech uppercase tracking-widest rounded backdrop-blur-md border shadow-lg
                                            ${cert.category === 'award' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/30'}
                                        `}>
                                            {cert.category}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative z-20 -mt-10">
                                    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border)] shadow-xl group-hover:translate-y-[-5px] transition-transform duration-300">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                                            {cert.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
                                            <Award size={14} className="text-[var(--color-accent)]" />
                                            <span>{cert.issuer}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-mono-tech text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3">
                                            <span>{new Date(cert.issue_date).getFullYear()}</span>
                                            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                VIEW_DETAILS <ExternalLink size={10} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedCert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCert(null)} />
                    <div className="relative w-full max-w-4xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up max-h-[90vh]">
                        <button
                            onClick={() => setSelectedCert(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-[var(--color-danger)] transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Side */}
                        <div className="w-full md:w-1/2 bg-[var(--color-bg)] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
                            <img src={selectedCert.image_url} alt={selectedCert.title} className="max-w-full max-h-[50vh] object-contain shadow-2xl rounded" />
                        </div>

                        {/* Details Side */}
                        <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar">
                            <div className="mb-6">
                                <span className="text-[var(--color-accent)] font-mono-tech text-xs uppercase tracking-widest mb-2 block">
                                    {selectedCert.category}
                                </span>
                                <h2 className="text-2xl font-bold mb-2">{selectedCert.title}</h2>
                                <p className="text-lg text-[var(--color-text-secondary)]">{selectedCert.issuer}</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[var(--color-bg)] p-3 rounded border border-[var(--color-border)]">
                                        <span className="block text-xs text-[var(--color-text-muted)] mb-1 font-mono-tech">ISSUED</span>
                                        <span className="font-bold text-sm">{new Date(selectedCert.issue_date).toLocaleDateString()}</span>
                                    </div>
                                    {selectedCert.credential_id && (
                                        <div className="bg-[var(--color-bg)] p-3 rounded border border-[var(--color-border)]">
                                            <span className="block text-xs text-[var(--color-text-muted)] mb-1 font-mono-tech">ID</span>
                                            <span className="font-bold text-sm font-mono">{selectedCert.credential_id}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedCert.description && (
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                                        {selectedCert.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {selectedCert.credential_url && (
                                    <a
                                        href={selectedCert.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 px-4 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] font-bold rounded text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Verify Credential
                                    </a>
                                )}
                                {selectedCert.file_url && (
                                    <a
                                        href={selectedCert.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-bold rounded text-center hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText size={18} />
                                        View PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
