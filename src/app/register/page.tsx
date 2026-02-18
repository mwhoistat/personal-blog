'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation for Admin Email
        // Only allow registration if email matches the configured admin email
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
        if (adminEmail && email !== adminEmail) {
            setError('Pendaftaran ditutup. Hanya email administrator yang diizinkan mendaftar.')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter.')
            return
        }
        setLoading(true)
        const { error: err } = await signUp(email, password, username, fullName)
        if (err) {
            setError(err)
            setLoading(false)
        } else {
            router.push('/login')
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 0.875rem 0.75rem 2.75rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text)',
        fontSize: '0.9375rem',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    }

    return (
        <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '0 1.5rem' }}>
            <div style={{
                padding: '2rem', borderRadius: '1rem',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
            }} className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                    }}>
                        <UserPlus size={24} style={{ color: 'white' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.375rem' }}>Buat Akun Admin</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Khusus untuk pemilik website</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem', borderRadius: '0.5rem',
                        backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)',
                        fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Nama Lengkap</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama lengkap" required style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)' }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)' }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)' }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" required minLength={6} style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)' }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '0.75rem',
                        borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                        color: 'white', background: loading ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    }}>
                        {loading ? 'Loading...' : 'Daftar Admin'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Sudah punya akun?{' '}
                    <Link href="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
