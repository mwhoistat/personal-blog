'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password minimal 6 karakter' })
            return
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' })
            return
        }

        setLoading(true)
        const supabase = createClient()

        try {
            const { error } = await supabase.auth.updateUser({ password: password })

            if (error) throw error

            setMessage({ type: 'success', text: 'Password berhasil diperbarui!' })
            setPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Gagal memperbarui password' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '2rem' }}>Pengaturan</h1>

            <div style={{
                maxWidth: '500px',
                padding: '2rem',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: '1rem',
                border: '1px solid var(--color-border)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Lock size={20} className="text-[var(--color-accent)]" />
                    Ganti Password
                </h2>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: message.type === 'success' ? 'var(--color-success, #22c55e)' : 'var(--color-danger)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.875rem'
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Password Baru
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            fontWeight: 600,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Menyimpan...' : (
                            <>
                                <Save size={18} /> Simpan Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
