'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, Filter, MoreVertical, Award, Calendar, ExternalLink, Loader2, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import type { Certificate } from '@/lib/types'

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const supabase = createClient()

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        try {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .order('issue_date', { ascending: false })

            if (error) throw error
            setCertificates(data || [])
        } catch (error) {
            console.error('Error fetching certificates:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteCertificate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) return

        try {
            const { error } = await supabase.from('certificates').delete().eq('id', id)
            if (error) throw error
            setCertificates(certificates.filter(c => c.id !== id))
        } catch (error) {
            alert('Error deleting certificate')
            console.error(error)
        }
    }

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = cert.title.toLowerCase().includes(search.toLowerCase()) ||
            cert.issuer.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || cert.category === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-mono-tech mb-1">Certificates</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Manage your awards, certifications, and courses.</p>
                </div>
                <Link
                    href="/admin/certificates/new"
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    <span>Add New</span>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[var(--color-bg-secondary)] p-4 rounded-lg border border-[var(--color-border)]">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or issuer..."
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-[var(--color-text-muted)]" />
                    <select
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="course">Course</option>
                        <option value="competition">Competition</option>
                        <option value="award">Award</option>
                        <option value="bootcamp">Bootcamp</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
                </div>
            ) : filteredCertificates.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[var(--color-border)] rounded-lg">
                    <Award className="mx-auto text-[var(--color-text-muted)] mb-3" size={48} />
                    <h3 className="text-lg font-bold mb-1">No Certificates Found</h3>
                    <p className="text-[var(--color-text-secondary)]">Get started by adding your first certificate.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map((cert) => (
                        <div key={cert.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-300">
                            <div className="aspect-video relative bg-[var(--color-bg)] overflow-hidden">
                                <img
                                    src={cert.image_url}
                                    alt={cert.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {cert.is_featured && (
                                    <div className="absolute top-2 right-2 bg-[var(--color-accent)] text-[var(--color-bg)] text-xs font-bold px-2 py-1 rounded shadow-lg">
                                        FEATURED
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded border ${cert.category === 'award' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                                            cert.category === 'competition' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                                                'border-[var(--color-cyan)]/30 text-[var(--color-cyan)] bg-[var(--color-cyan)]/5'
                                        }`}>
                                        {cert.category}
                                    </span>
                                    <div className="flex gap-1">
                                        <Link
                                            href={`/admin/certificates/${cert.id}`}
                                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg)] rounded transition-colors"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => deleteCertificate(cert.id)}
                                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-[var(--color-bg)] rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-1 line-clamp-1" title={cert.title}>{cert.title}</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm mb-3 flex items-center gap-1">
                                    <Award size={14} /> {cert.issuer}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-auto">
                                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 font-mono-tech">
                                        <Calendar size={12} />
                                        {new Date(cert.issue_date).toLocaleDateString()}
                                    </span>
                                    {cert.credential_url && (
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
                                        >
                                            Verify <ExternalLink size={10} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
