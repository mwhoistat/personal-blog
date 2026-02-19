import CertificateForm from '@/components/admin/CertificateForm'

export default function NewCertificatePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-mono-tech mb-1">Add New Certificate</h1>
                <p className="text-[var(--color-text-secondary)] text-sm">Upload a new certification or award.</p>
            </div>
            <CertificateForm />
        </div>
    )
}
