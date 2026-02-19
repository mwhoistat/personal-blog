'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, FolderKanban, ArrowLeft, Menu, X, Settings, Activity, LogOut, BadgeCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'

const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/articles', label: 'Artikel', icon: FileText },
    { href: '/admin/projects', label: 'Proyek', icon: FolderKanban },
    { href: '/admin/certificates', label: 'Sertifikat', icon: BadgeCheck },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
    { href: '/admin/activity', label: 'Activity Log', icon: Activity },
]

export default function AdminShell({
    children,
    userProfile
}: {
    children: React.ReactNode
    userProfile: Profile
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
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
                    width: '260px',
                    borderRight: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '1.5rem 1rem',
                    position: 'sticky',
                    top: '0',
                    height: '100vh',
                    overflowY: 'auto',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 40
                }}
                className={sidebarOpen ? 'sidebar-mobile-open' : 'sidebar-desktop'}
            >
                <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-[var(--color-accent)] to-cyan-500 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Admin Panel</h2>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', paddingLeft: '0.25rem' }}>
                        {userProfile.full_name || userProfile.username || 'Administrator'}
                    </p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                    {adminLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname?.startsWith(`${href}/`)
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                    backgroundColor: isActive ? 'rgba(var(--color-accent-rgb), 0.1)' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent'
                                }}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none',
                        padding: '0.75rem', borderRadius: '0.5rem',
                        transition: 'color 0.2s'
                    }} className="hover:text-[var(--color-text)]">
                        <ArrowLeft size={16} /> Public Site
                    </Link>

                    <button
                        onClick={handleSignOut}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            fontSize: '0.875rem', color: '#ef4444', textDecoration: 'none',
                            padding: '0.75rem', borderRadius: '0.5rem',
                            background: 'none', border: 'none', cursor: 'pointer', margin: 0,
                            width: '100%', textAlign: 'left',
                            transition: 'background 0.2s'
                        }}
                        className="hover:bg-red-500/10"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                    {children}
                </div>
            </main>

            <div
                className={sidebarOpen ? 'fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm' : 'hidden'}
                onClick={() => setSidebarOpen(false)}
            />

            <style jsx global>{`
        @media (min-width: 1024px) {
          .show-mobile-flex { display: none !important; }
          .sidebar-desktop { display: flex !important; }
          .sidebar-mobile-open { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .show-mobile-flex { display: flex !important; }
          .sidebar-desktop { transform: translateX(-100%); position: fixed !important; top: 0 !important; left: 0 !important; height: 100vh !important; }
          .sidebar-mobile-open { transform: translateX(0); position: fixed !important; top: 0 !important; left: 0 !important; height: 100vh !important; }
        }
      `}</style>
        </div>
    )
}
