'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, Lock, Terminal, AlertTriangle } from 'lucide-react'

import { z } from 'zod'
import { login } from './actions'

const loginSchema = z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const redirectPath = searchParams.get('redirect') || '/admin'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Zod Validation
        const result = loginSchema.safeParse({ email, password })
        if (!result.success) {
            const formatted = result.error.format()
            const errorMsg = formatted.email?._errors[0] || formatted.password?._errors[0] || "Invalid input"
            setError(errorMsg)
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('redirectTo', redirectPath)

        const response = await login(formData)

        if (response?.error) {
            setError(response.error)
            setLoading(false)
        }
        // If success, server action redirects.
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[var(--color-bg)]">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Shield size={48} className="mx-auto text-[var(--color-accent)] mb-4 animate-pulse" />
                    <h1 className="font-mono-tech text-2xl font-bold tracking-tight">SECURE_ENTRY_POINT</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-2">Identify yourself to proceed.</p>
                </div>

                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-8 shadow-2xl relative overflow-hidden">
                    {/* Top Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)]"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] px-4 py-3 rounded text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-mono-tech text-[var(--color-text-muted)] mb-2 uppercase">User Identifier</label>
                            <div className="relative">
                                <Terminal size={16} className="absolute left-3 top-3 text-[var(--color-text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-10 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text)] font-mono-tech placeholder:[var(--color-text-muted)]"
                                    placeholder="admin@atha.dev"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono-tech text-[var(--color-text-muted)] mb-2 uppercase">Access Key</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-3 text-[var(--color-text-muted)]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-10 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors text-[var(--color-text)] font-mono-tech"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] font-bold py-3 rounded hover:bg-[var(--color-accent-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin"></span>
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                <>
                                    ESTABLISH_SESSION <span className="font-mono-tech">{'>'}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[var(--color-text-muted)] mt-8 font-mono-tech">
                    Restricted Area. Unauthorized access is prohibited. <br />
                    System IP logged.
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]"></div>}>
            <LoginContent />
        </Suspense>
    )
}
