'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import CertificateForm from '@/components/admin/CertificateForm'
import { Loader2 } from 'lucide-react'
import type { Certificate } from '@/lib/types'

export default function EditCertificatePage() {
    const params = useParams()
    const [certificate, setCertificate] = useState<Certificate | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchCertificate = async () => {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('id', params.id)
                .single()

            if (data) setCertificate(data)
            setLoading(false)
        }

        if (params.id) fetchCertificate()
    }, [params.id])

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>
    if (!certificate) return <div>Certificate not found</div>

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-mono-tech mb-1">Edit Certificate</h1>
                <p className="text-[var(--color-text-secondary)] text-sm">Update certificate details.</p>
            </div>
            <CertificateForm initialData={certificate} />
        </div>
    )
}
