'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
    table: 'articles' | 'projects' | 'certificates'
    id: string
    title?: string
}

export default function DeleteButton({ table, id, title }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title || 'this item'}"? This cannot be undone.`)) return

        setLoading(true)
        try {
            const { error } = await supabase.from(table).delete().eq('id', id)
            if (error) throw error

            toast.success('Deleted successfully')
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to delete: ' + error.message)
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
            title="Delete"
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
    )
}
