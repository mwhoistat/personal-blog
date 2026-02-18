import Link from 'next/link'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-secondary)',
                marginTop: '4rem',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '3rem 1.5rem 2rem',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem',
                    }}
                >
                    {/* Brand */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                            <span style={{
                                background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                MyBlog
                            </span>
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            Personal blog tentang programming, desain, dan teknologi.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                            Navigasi
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { href: '/', label: 'Beranda' },
                                { href: '/articles', label: 'Artikel' },
                                { href: '/projects', label: 'Proyek' },
                                { href: '/about', label: 'Tentang' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                            Sosial Media
                        </h4>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s ease' }}>
                                <Github size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s ease' }}>
                                <Linkedin size={20} />
                            </a>
                            <a href="mailto:hello@example.com"
                                style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s ease' }}>
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8125rem',
                    }}
                >
                    <span>© {new Date().getFullYear()} MyBlog. Made with</span>
                    <Heart size={14} style={{ color: '#ef4444' }} />
                    <span>using Next.js</span>
                </div>
            </div>
        </footer>
    )
}
