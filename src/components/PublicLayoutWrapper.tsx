'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Hide Public Navbar/Footer on Admin pages and Login page (optional, but cleaner for Admin)
    // Actually, user might want Navbar on Login. I'll only hide on /admin for now to be safe.
    // The screenshot showed Admin Dashboard broken. Login page was fine (it has its own centered card).
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) {
        return <main className="min-h-screen bg-[var(--color-bg)]">{children}</main>
    }

    return (
        <>
            <Navbar />
            <main className="flex-1 bg-grid-pattern relative">
                {children}
            </main>
            <Footer />
        </>
    )
}
