import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Nurathallah - Cybersecurity & Network Enthusiast',
    template: '%s | Nurathallah',
  },
  description: 'Blog personal Nurathallah Putra Pratama. Sharing tentang cybersecurity, pentesting, jaringan komputer, dan web development.',
  keywords: ['cybersecurity', 'pentesting', 'tkj', 'networking', 'webdev', 'blog'],
  authors: [{ name: 'Nurathallah Putra Pratama' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Nurathallah Blog',
    title: 'Nurathallah - Cybersecurity & Network Enthusiast',
    description: 'Blog personal Nurathallah Putra Pratama seputar cybersecurity dan teknologi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nurathallah - Cybersecurity & Network Enthusiast',
    description: 'Blog personal Nurathallah Putra Pratama seputar cybersecurity dan teknologi.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
