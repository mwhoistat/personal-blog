'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, username: string, fullName: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) console.error('[AuthProvider] Session Error:', sessionError)

                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    if (profile) {
                        setUser(profile)
                    } else {
                        // Profile missing or error (e.g. PGRST116)
                        // Treat as Guest/User with fallback data so UI doesn't crash or show logged out
                        console.warn('[AuthProvider] Profile unavailable, using session fallback:', profileError?.message || 'No row found')

                        const fallbackProfile: Profile = {
                            id: session.user.id,
                            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'unknown',
                            full_name: session.user.user_metadata?.full_name || 'Guest User',
                            avatar_url: session.user.user_metadata?.avatar_url || null,
                            bio: null,
                            role: 'user', // Default role for safety
                            created_at: new Date().toISOString()
                        }
                        setUser(fallbackProfile)
                    }
                } else {
                    // No session
                    setUser(null)
                }
            } catch (e) {
                console.error('[AuthProvider] Unexpected error:', e)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[AuthProvider] Auth State Change:', event)
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    if (profile) {
                        setUser(profile)
                    } else {
                        // Fallback for Auth State Change
                        const fallbackProfile: Profile = {
                            id: session.user.id,
                            username: session.user.email?.split('@')[0] || 'unknown',
                            full_name: session.user.user_metadata?.full_name || 'Unknown User',
                            avatar_url: session.user.user_metadata?.avatar_url || null,
                            bio: null,
                            role: 'user',
                            created_at: new Date().toISOString()
                        }
                        setUser(fallbackProfile)
                    }
                } else {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error && data.session) {
            // Manually refresh user state immediately to avoid waiting for the subscription
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.session.user.id)
                .single()
            setUser(profile)
            router.refresh() // Force Next.js to refresh server components/middleware context
        }
        return { error: error?.message || null }
    }

    const signUp = async (email: string, password: string, username: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, full_name: fullName },
            },
        })
        return { error: error?.message || null }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
