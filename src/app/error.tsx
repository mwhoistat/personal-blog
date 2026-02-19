'use client'

import { useEffect } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <AlertOctagon size={48} className="text-[var(--color-danger)] mb-6 animate-pulse" />

            <h2 className="text-2xl font-bold mb-2">SYSTEM FAILURE</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md font-mono-tech text-xs">
                ERR_CODE: {error.digest || 'UNKNOWN_EXCEPTION'}
                <br />
                {error.message}
            </p>

            <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-[var(--color-bg)] transition-colors font-mono-tech text-sm"
            >
                <RotateCcw size={16} /> REBOOT_COMPONENT
            </button>
        </div>
    )
}
