'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Github, Linkedin, Twitter, Instagram, Youtube, Mail, MapPin, GraduationCap, Shield, Code, Terminal } from 'lucide-react'

const socialIcons: Record<string, React.ElementType> = {
    social_github: Github,
    social_linkedin: Linkedin,
    social_twitter: Twitter,
    social_instagram: Instagram,
    social_youtube: Youtube,
    social_email: Mail,
}

const socialLabels: Record<string, string> = {
    social_github: 'GitHub',
    social_linkedin: 'LinkedIn',
    social_twitter: 'Twitter',
    social_instagram: 'Instagram',
    social_youtube: 'YouTube',
    social_email: 'Email',
}

export default function AboutPage() {
    const [socials, setSocials] = useState<{ key: string; value: string }[]>([])

    useEffect(() => {
        const fetchSocials = async () => {
            const supabase = createClient()
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('key, value')
                    .like('key', 'social_%')
                if (data) setSocials(data.filter(d => d.value))
            } catch {
                // Table might not exist
            }
        }
        fetchSocials()
    }, [])

    const skills = [
        { icon: Shield, label: 'Cybersecurity', desc: 'Penetration Testing, Network Security, CTF' },
        { icon: Terminal, label: 'Networking', desc: 'Cisco, MikroTik, TCP/IP, Subnetting' },
        { icon: Code, label: 'Web Development', desc: 'Next.js, React, TypeScript, Supabase' },
    ]

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }} className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem', fontSize: '2rem', color: 'white', fontWeight: 800,
                }}>
                    A
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                    Nurathallah Putra Pratama
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    Siswa SMK jurusan Teknik Komputer dan Jaringan yang antusias dengan dunia <strong>Cybersecurity</strong>, <strong>Pentesting</strong>, dan Teknologi Jaringan. Saat ini sedang mengeksplorasi Web Development untuk membangun sistem yang aman dan modern.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    <MapPin size={14} />
                    <span>Indonesia</span>
                    <span style={{ margin: '0 0.25rem' }}>·</span>
                    <GraduationCap size={14} />
                    <span>SMK — TKJ</span>
                </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Keahlian</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {skills.map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="card-interactive" style={{
                            display: 'flex', alignItems: 'flex-start', gap: '1rem',
                            padding: '1rem 1.25rem', borderRadius: '0.75rem',
                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '0.5rem', flexShrink: 0,
                                background: 'var(--color-accent-light)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)',
                            }}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{label}</p>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Connect */}
            {socials.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Hubungi Saya</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {socials.map(({ key, value }) => {
                            const Icon = socialIcons[key]
                            const label = socialLabels[key]
                            if (!Icon) return null
                            const href = key === 'social_email' ? `mailto:${value}` : value
                            return (
                                <a
                                    key={key}
                                    href={href}
                                    target={key === 'social_email' ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 1rem', borderRadius: '0.5rem',
                                        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text-secondary)', textDecoration: 'none',
                                        fontSize: '0.8125rem', fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-accent)'
                                        e.currentTarget.style.color = 'var(--color-accent)'
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)'
                                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                                    }}
                                >
                                    <Icon size={16} />
                                    {label}
                                </a>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
