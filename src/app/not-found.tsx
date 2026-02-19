import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <h1 className="text-9xl font-bold font-mono-tech text-[var(--color-bg-secondary)] select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--color-accent)] bg-[var(--color-bg)] px-4 border border-[var(--color-accent)]">SIGNAL_LOST</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Node Not Found</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
                The requested resource could not be located on this server. Check your connection or verify the URL protocol.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors font-mono-tech text-sm"
            >
                <Home size={16} /> RETURN_HOME
            </Link>
        </div>
    )
}
