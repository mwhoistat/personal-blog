'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { Sun, Moon, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
    const { theme, toggleTheme } = useTheme()
    const { user, signOut } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/articles', label: 'Artikel' },
        { href: '/projects', label: 'Proyek' },
        { href: '/about', label: 'Tentang' },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/articles?q=${encodeURIComponent(searchQuery.trim())}`
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'all 0.3s ease',
            }}
        >
            <nav
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1.5rem',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.025em',
                    }}
                >
                    MyBlog
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                padding: '0.5rem 0.875rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = 'var(--color-text)'
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = 'var(--color-text-secondary)'
                                e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Search */}
                    {searchOpen ? (
                        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text)',
                                    fontSize: '0.875rem',
                                    width: '180px',
                                    outline: 'none',
                                }}
                            />
                            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.375rem' }}>
                                <X size={18} />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Search size={18} />
                        </button>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'none',
                        }}
                        className="show-mobile"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    style={{
                        padding: '0.5rem 1.5rem 1rem',
                        borderTop: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg)',
                    }}
                    className="show-mobile-block"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'block',
                                padding: '0.75rem 0',
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9375rem',
                                fontWeight: 500,
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            <style jsx global>{`
        @media (min-width: 768px) {
          .show-mobile { display: none !important; }
          .show-mobile-block { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile-block { display: block !important; }
        }
      `}</style>
        </header>
    )
}
