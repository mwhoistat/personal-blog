'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Github, Linkedin, Twitter, Instagram, Youtube, Mail, Loader2, Lock, Eye, EyeOff, Shield, Share2, CheckCircle, AlertCircle } from 'lucide-react'

interface SocialLink {
    key: string
    label: string
    icon: React.ElementType
    placeholder: string
    value: string
}

const defaultLinks: Omit<SocialLink, 'value'>[] = [
    { key: 'social_github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'social_linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { key: 'social_twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { key: 'social_instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { key: 'social_youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
    { key: 'social_email', label: 'Email', icon: Mail, placeholder: 'nama@email.com' },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'social' | 'security'>('social')

    // Social media state
    const [links, setLinks] = useState<SocialLink[]>(
        defaultLinks.map(l => ({ ...l, value: '' }))
    )
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text })
        setTimeout(() => setToast(null), 4000)
    }

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient()
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('key, value')
                    .in('key', defaultLinks.map(l => l.key))

                if (data) {
                    setLinks(prev => prev.map(link => {
                        const found = data.find(d => d.key === link.key)
                        return found ? { ...link, value: found.value || '' } : link
                    }))
                }
            } catch {
                // Table might not exist yet
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleChange = (key: string, value: string) => {
        setLinks(prev => prev.map(l => l.key === key ? { ...l, value } : l))
    }

    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const supabase = createClient()

        try {
            const promises = links.map(link =>
                supabase.from('site_settings').upsert(
                    { key: link.key, value: link.value.trim(), updated_at: new Date().toISOString() },
                    { onConflict: 'key' }
                )
            )
            const results = await Promise.all(promises)
            const hasError = results.some(r => r.error)

            if (hasError) {
                const err = results.find(r => r.error)?.error
                showToast('error', err?.message || 'Gagal menyimpan pengaturan')
            } else {
                showToast('success', 'Pengaturan sosial media berhasil disimpan!')
            }
        } catch {
            showToast('error', 'Terjadi kesalahan')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!currentPassword) {
            showToast('error', 'Masukkan password saat ini')
            return
        }
        if (newPassword.length < 8) {
            showToast('error', 'Password baru minimal 8 karakter')
            return
        }
        if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            showToast('error', 'Password harus kombinasi huruf dan angka')
            return
        }
        if (newPassword !== confirmPassword) {
            showToast('error', 'Konfirmasi password tidak cocok')
            return
        }
        if (newPassword === currentPassword) {
            showToast('error', 'Password baru harus berbeda dari password saat ini')
            return
        }

        setChangingPassword(true)
        const supabase = createClient()

        try {
            // First verify current password by attempting sign in
            const { data: { user } } = await supabase.auth.getUser()
            if (!user?.email) {
                showToast('error', 'Sesi tidak valid. Silakan login ulang.')
                setChangingPassword(false)
                return
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })

            if (signInError) {
                showToast('error', 'Password saat ini salah')
                setChangingPassword(false)
                return
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (updateError) {
                showToast('error', updateError.message || 'Gagal mengupdate password')
            } else {
                showToast('success', 'Password berhasil diubah!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch {
            showToast('error', 'Terjadi kesalahan saat mengubah password')
        } finally {
            setChangingPassword(false)
        }
    }

    // Password strength indicator
    const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
        if (!pw) return { label: '', color: 'transparent', width: '0%' }
        let score = 0
        if (pw.length >= 8) score++
        if (pw.length >= 12) score++
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
        if (/[0-9]/.test(pw)) score++
        if (/[^a-zA-Z0-9]/.test(pw)) score++

        if (score <= 1) return { label: 'Lemah', color: '#ef4444', width: '20%' }
        if (score <= 2) return { label: 'Cukup', color: '#f59e0b', width: '40%' }
        if (score <= 3) return { label: 'Baik', color: '#3b82f6', width: '60%' }
        if (score <= 4) return { label: 'Kuat', color: '#10b981', width: '80%' }
        return { label: 'Sangat Kuat', color: '#059669', width: '100%' }
    }

    const strength = getPasswordStrength(newPassword)

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.75rem',
        borderRadius: '0.5rem', border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)',
        fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    }

    const passwordInputStyle: React.CSSProperties = {
        ...inputStyle,
        paddingRight: '2.75rem',
    }

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '0.625rem 1.25rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.25s ease',
    })

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-text-muted)' }} />
            </div>
        )
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '640px' }}>
            {/* Toast */}
            {toast && (
                <div className="animate-toast" style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100,
                    padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
                    backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', fontWeight: 600, fontSize: '0.875rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.text}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.025em' }}>Pengaturan</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Kelola sosial media dan keamanan akun Anda.
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.375rem', marginBottom: '1.5rem',
                padding: '0.25rem', backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: '0.625rem', border: '1px solid var(--color-border)',
            }}>
                <button onClick={() => setActiveTab('social')} style={tabStyle(activeTab === 'social')}>
                    <Share2 size={16} /> Sosial Media
                </button>
                <button onClick={() => setActiveTab('security')} style={tabStyle(activeTab === 'security')}>
                    <Shield size={16} /> Keamanan
                </button>
            </div>

            {/* Social Media Tab */}
            {activeTab === 'social' && (
                <form onSubmit={handleSocialSubmit} className="animate-fade-in">
                    <div style={{
                        border: '1px solid var(--color-border)', borderRadius: '0.75rem',
                        overflow: 'hidden', marginBottom: '1.5rem',
                    }}>
                        <div style={{
                            padding: '1rem 1.25rem', backgroundColor: 'var(--color-bg-secondary)',
                            borderBottom: '1px solid var(--color-border)',
                        }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Sosial Media</h2>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                Masukkan URL akun sosial media Anda. Kosongkan jika tidak ingin ditampilkan.
                            </p>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {links.map(({ key, label, icon: Icon, placeholder, value }) => (
                                <div key={key}>
                                    <label style={{
                                        display: 'block', fontSize: '0.8125rem', fontWeight: 600,
                                        marginBottom: '0.375rem', color: 'var(--color-text-secondary)',
                                    }}>
                                        {label}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Icon size={16} style={{
                                            position: 'absolute', left: '0.875rem', top: '50%',
                                            transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
                                        }} />
                                        <input
                                            type={key === 'social_email' ? 'email' : 'url'}
                                            value={value}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            placeholder={placeholder}
                                            style={inputStyle}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--color-accent)'
                                                e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--color-border)'
                                                e.currentTarget.style.boxShadow = 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn-interactive" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                        color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    }}>
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="animate-fade-in">
                    <div style={{
                        border: '1px solid var(--color-border)', borderRadius: '0.75rem',
                        overflow: 'hidden', marginBottom: '1.5rem',
                    }}>
                        <div style={{
                            padding: '1rem 1.25rem', backgroundColor: 'var(--color-bg-secondary)',
                            borderBottom: '1px solid var(--color-border)',
                        }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Ganti Password</h2>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                Pastikan password baru minimal 8 karakter, kombinasi huruf dan angka.
                            </p>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Current Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>
                                    Password Saat Ini
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={passwordInputStyle}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-accent)'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                        style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: '1px solid var(--color-border)' }} />

                            {/* New Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>
                                    Password Baru
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                        minLength={8}
                                        style={passwordInputStyle}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-accent)'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)}
                                        style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {/* Strength indicator */}
                                {newPassword && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <div style={{
                                            width: '100%', height: '4px', backgroundColor: 'var(--color-bg-tertiary)',
                                            borderRadius: '2px', overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: strength.width, height: '100%',
                                                backgroundColor: strength.color, borderRadius: '2px',
                                                transition: 'width 0.3s ease, background-color 0.3s ease',
                                            }} />
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: strength.color, marginTop: '0.25rem', fontWeight: 500 }}>
                                            Kekuatan: {strength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-secondary)' }}>
                                    Konfirmasi Password Baru
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi password baru"
                                        required
                                        style={passwordInputStyle}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-accent)'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border)'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.375rem' }}>
                                        Password tidak cocok
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={changingPassword} className="btn-interactive" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                        color: 'white', background: changingPassword ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        border: 'none', cursor: changingPassword ? 'not-allowed' : 'pointer',
                    }}>
                        {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                        {changingPassword ? 'Mengubah...' : 'Ubah Password'}
                    </button>
                </form>
            )}
        </div>
    )
}
