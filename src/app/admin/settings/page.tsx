'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Github, Linkedin, Twitter, Instagram, Youtube, Mail, Loader2 } from 'lucide-react'

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
    const [links, setLinks] = useState<SocialLink[]>(
        defaultLinks.map(l => ({ ...l, value: '' }))
    )
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const showToast = (type: 'success' | 'error', text: string) => {
        setToast({ type, text })
        setTimeout(() => setToast(null), 3000)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const supabase = createClient()

        try {
            // Upsert each setting
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
                showToast('success', 'Pengaturan berhasil disimpan!')
            }
        } catch {
            showToast('error', 'Terjadi kesalahan')
        } finally {
            setSaving(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.75rem',
        borderRadius: '0.5rem', border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)',
        fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.2s ease',
    }

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
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100,
                    padding: '0.875rem 1.25rem', borderRadius: '0.625rem',
                    backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', fontWeight: 600, fontSize: '0.875rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease',
                }}>
                    {toast.text}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Pengaturan</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Kelola link sosial media yang ditampilkan di website.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Social Links Section */}
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
                                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={saving} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'white', background: saving ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                }}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
            </form>
        </div>
    )
}
