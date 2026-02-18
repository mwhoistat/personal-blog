'use client'

import { useAuth } from '@/components/AuthProvider'

export default function DebugPage() {
    const { user, loading } = useAuth()

    if (loading) return <div>Loading...</div>

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Debug Info</h1>
            <pre style={{ background: '#f4f4f5', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
                {JSON.stringify({
                    loading,
                    user: user ? {
                        id: user.id,
                        email: 'HIDDEN', // Profile type might not have email depending on definition
                        role: user.role,
                        username: user.username
                    } : 'null'
                }, null, 2)}
            </pre>
            <p>
                Jika <strong>user</strong> adalah <code>null</code>, berarti tidak ada profil di tabel <code>profiles</code>.<br />
                Jika <strong>role</strong> bukan <code>admin</code>, berarti query UPDATE belum berhasil.
            </p>
        </div>
    )
}
