'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { Sun, Moon, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
    const { theme, toggleTheme } = useTheme()
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/articles', label: 'Artikel' },
        { href: '/projects', label: 'Proyek' },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/articles?q=${encodeURIComponent(searchQuery.trim())}`
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(16px)',
                backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
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
                        letterSpacing: '-0.03em',
                        textDecoration: 'none',
                    }}
                    className="gradient-text-animated"
                >
                    Atha.
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActiveLink(link.href) ? 'active' : ''}`}
                            style={{
                                padding: '0.5rem 0.875rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: isActiveLink(link.href) ? 600 : 500,
                                color: isActiveLink(link.href) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {/* Search */}
                    {searchOpen ? (
                        <form onSubmit={handleSearch} className="animate-scale-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-accent)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text)',
                                    fontSize: '0.875rem',
                                    width: '180px',
                                    outline: 'none',
                                    boxShadow: '0 0 0 3px var(--color-accent-light)',
                                }}
                            />
                            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.375rem', display: 'flex' }}>
                                <X size={18} />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--color-text-secondary)', cursor: 'pointer',
                                padding: '0.5rem', borderRadius: '0.5rem',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center',
                            }}
                        >
                            <Search size={18} />
                        </button>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--color-text-secondary)', cursor: 'pointer',
                            padding: '0.5rem', borderRadius: '0.5rem',
                            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center',
                        }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--color-text-secondary)', cursor: 'pointer',
                            padding: '0.5rem', display: 'none',
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
                    className="show-mobile-block animate-slide-down"
                    style={{
                        padding: '0.5rem 1.5rem 1rem',
                        borderTop: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg)',
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'block',
                                padding: '0.75rem 0',
                                color: isActiveLink(link.href) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9375rem',
                                fontWeight: isActiveLink(link.href) ? 600 : 500,
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
