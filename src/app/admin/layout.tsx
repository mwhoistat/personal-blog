'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { LayoutDashboard, FileText, FolderKanban, MessageSquare, ArrowLeft, Menu, X } from 'lucide-react'

const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/articles', label: 'Artikel', icon: FileText },
    { href: '/admin/projects', label: 'Proyek', icon: FolderKanban },
    { href: '/admin/comments', label: 'Komentar', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (user.role !== 'admin') {
                // If user is logged in but not admin, redirect to home
                router.push('/')
            }
        }
    }, [user, loading, router])

    // Prevent rendering while loading or if unauthorized
    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin" style={{
                    width: '32px', height: '32px',
                    border: '3px solid var(--color-border)',
                    borderTopColor: 'var(--color-accent)',
                    borderRadius: '50%'
                }} />
            </div>
        )
    }

    // If finished loading and not admin, return null (useEffect will redirect)
    if (!user || user.role !== 'admin') {
        return null
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50,
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    display: 'none', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                }}
                className="show-mobile-flex"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                style={{
                    width: '240px',
                    borderRight: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '1.5rem 0.75rem',
                    position: 'sticky',
                    top: '64px',
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                }}
                className={sidebarOpen ? 'sidebar-mobile-open' : 'sidebar-desktop'}
            >
                <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Admin Panel</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Kelola konten blog</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {adminLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.625rem',
                                    padding: '0.625rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                    backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                <div style={{ marginTop: '2rem', padding: '0 0.5rem' }}>
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none',
                    }}>
                        <ArrowLeft size={14} /> Kembali ke Blog
                    </Link>
                </div>
            </aside>

            {/* Content */}
            <div style={{ flex: 1, padding: '1.5rem', minWidth: 0 }}>
                {children}
            </div>

            <style jsx global>{`
        @media (min-width: 768px) {
          .show-mobile-flex { display: none !important; }
          .sidebar-desktop { display: block !important; }
          .sidebar-mobile-open { display: block !important; }
        }
        @media (max-width: 767px) {
          .show-mobile-flex { display: flex !important; }
          .sidebar-desktop { display: none !important; position: fixed !important; top: 64px !important; left: 0 !important; z-index: 40 !important; height: calc(100vh - 64px) !important; }
          .sidebar-mobile-open { display: block !important; position: fixed !important; top: 64px !important; left: 0 !important; z-index: 40 !important; height: calc(100vh - 64px) !important; }
        }
      `}</style>
        </div>
    )
}
