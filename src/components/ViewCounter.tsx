'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface ViewCounterProps {
    slug: string
    table: 'articles' | 'projects'
}

export default function ViewCounter({ slug, table }: ViewCounterProps) {
    const initialized = useRef(false)

    useEffect(() => {
        // Prevent double counting in Strict Mode (dev)
        if (initialized.current) return
        initialized.current = true

        const increment = async () => {
            const supabase = createClient()
            try {
                await supabase.rpc('increment_view_count', {
                    table_name: table,
                    record_slug: slug
                })
            } catch (error) {
                console.error('Error incrementing view count:', error)
            }
        }

        // Small delay to ensure it's a real visit? Not really needed, but okay.
        increment()
    }, [slug, table])

    return null
}
