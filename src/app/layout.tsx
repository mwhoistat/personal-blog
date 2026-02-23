import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import PublicLayoutWrapper from '@/components/PublicLayoutWrapper'
import { Toaster } from 'sonner'
import './globals.css'

// Fonts configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Atha. | Cybersecurity & Network Engineer',
    template: '%s | Atha.',
  },
  description: 'Personal portfolio and blog of Nurathallah. Exploring cybersecurity, networking, and fullstack development.',
  keywords: ['cybersecurity', 'networking', 'security engineer', 'pentesting', 'portfolio'],
  authors: [{ name: 'Nurathallah Putra Pratama' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Atha. Security Portfolio',
    title: 'Atha. | Cybersecurity Specialist',
    description: 'Security research, network engineering, and code.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[var(--color-accent)] selection:text-black">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[var(--color-accent)] text-black font-bold font-mono-tech rounded-md">
          Skip to Content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <PublicLayoutWrapper>
              <main id="main-content" className="flex-1">
                {children}
                <Toaster richColors position="bottom-right" />
              </main>
            </PublicLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
