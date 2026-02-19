'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal, Menu, X, Wifi, ShieldCheck, Cpu } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import SearchOverlay from '@/components/SearchOverlay'

const navLinks = [
    { name: '~/home', href: '/' },
    { name: '~/articles', href: '/articles' },
    { name: '~/projects', href: '/projects' },
    { name: '~/certificates', href: '/certificates' },
    { name: '~/about', href: '/about' },
    { name: '~/contact', href: '/contact' },
]

export default function Navbar() {
    const pathname = usePathname()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false)
        }
        if (mobileMenuOpen) {
            window.addEventListener('keydown', handleEscape)
        }
        return () => window.removeEventListener('keydown', handleEscape)
    }, [mobileMenuOpen])

    // Global Search Hotkey
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setSearchOpen(true)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    if (!mounted) return null

    return (
        <>
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'glass-panel border-b border-[var(--color-border)] py-3'
                    : 'bg-transparent border-b border-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="group flex items-center gap-3 font-mono-tech text-lg font-bold hover:text-[var(--color-accent)] transition-colors">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors">
                            <Terminal size={18} className="text-[var(--color-accent)]" />
                        </div>
                        <span className="tracking-tighter">
                            <span className="text-[var(--color-accent)]">root</span>
                            <span className="text-[var(--color-text-muted)]">@</span>
                            <span>atha</span>
                            <span className="text-[var(--color-text-muted)]">:</span>
                            <span className="text-[var(--color-cyan)]">~</span>
                            <span className="animate-pulse text-[var(--color-accent)]">#</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        relative px-4 py-2 font-mono-tech text-sm transition-all duration-200 rounded-md
                                        ${isActive
                                            ? 'text-[var(--color-bg)] bg-[var(--color-accent)] font-bold'
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]'
                                        }
                                    `}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Status / Command Center */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono-tech text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-all group cursor-pointer"
                        >
                            <span className="text-[var(--color-accent)]">⌘</span>
                            <span>K</span>
                        </button>

                        <div className="h-6 w-px bg-[var(--color-border)]"></div>

                        {/* System Status */}
                        <div className="flex items-center gap-2 text-xs font-mono-tech text-[var(--color-accent)] bg-[var(--color-accent)]/5 px-3 py-1.5 rounded border border-[var(--color-accent)]/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                            <Wifi size={12} className="animate-pulse" />
                            <span>NET_ONLINE</span>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)] rounded border border-transparent hover:border-[var(--color-border)] transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`md:hidden fixed inset-0 bg-[var(--color-bg)]/95 backdrop-blur-xl z-[60] transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <div className="flex flex-col h-full p-6">
                        <div className="flex justify-between items-center mb-12 border-b border-[var(--color-border)] pb-6">
                            <div className="font-mono-tech text-xl font-bold flex items-center gap-2">
                                <Terminal size={20} className="text-[var(--color-accent)]" />
                                <span>SYSTEM_MENU</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded border border-[var(--color-border)] hover:border-[var(--color-danger)] text-[var(--color-text)] hover:text-[var(--color-danger)] transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        group flex items-center p-4 rounded-lg border border-transparent transition-all
                                        ${pathname === link.href
                                            ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20 text-[var(--color-accent)]'
                                            : 'hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border)] text-[var(--color-text-secondary)]'
                                        }
                                    `}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="font-mono-tech text-xs opacity-50 mr-4 w-6">0{i + 1}</span>
                                    <span className="font-mono-tech text-lg font-bold group-hover:translate-x-1 transition-transform">{link.name}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto">
                            <div className="mb-6">
                                <button
                                    onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                                    className="w-full flex items-center justify-center gap-2 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
                                >
                                    <span className="font-mono-tech">SEARCH_DATABASE</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[var(--color-bg-secondary)] p-4 rounded border border-[var(--color-border)] flex flex-col items-center justify-center gap-2 text-[var(--color-accent)]">
                                    <ShieldCheck size={24} />
                                    <span className="text-xs font-mono-tech">SECURE</span>
                                </div>
                                <div className="bg-[var(--color-bg-secondary)] p-4 rounded border border-[var(--color-border)] flex flex-col items-center justify-center gap-2 text-[var(--color-cyan)]">
                                    <Cpu size={24} />
                                    <span className="text-xs font-mono-tech">OPTIMIZED</span>
                                </div>
                            </div>

                            <div className="text-center border-t border-[var(--color-border)] pt-8">
                                <p className="text-[var(--color-text-muted)] text-xs font-mono-tech uppercase tracking-widest">
                                    System Version 2.0.4
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
