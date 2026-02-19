'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Activity, FileText, FolderKanban, Settings, Lock, Trash2 } from 'lucide-react'

interface LogEntry {
    id: string
    action: string
    target: string
    details: string | null
    created_at: string
}

const actionIcons: Record<string, React.ElementType> = {
    'create_article': FileText,
    'update_article': FileText,
    'delete_article': Trash2,
    'toggle_article': FileText,
    'create_project': FolderKanban,
    'update_project': FolderKanban,
    'delete_project': Trash2,
    'update_settings': Settings,
    'change_password': Lock,
}

const actionLabels: Record<string, string> = {
    'create_article': 'Membuat artikel',
    'update_article': 'Mengedit artikel',
    'delete_article': 'Menghapus artikel',
    'toggle_article': 'Mengubah status artikel',
    'create_project': 'Membuat proyek',
    'update_project': 'Mengedit proyek',
    'delete_project': 'Menghapus proyek',
    'update_settings': 'Mengubah pengaturan',
    'change_password': 'Mengubah password',
}

export default function ActivityPage() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            const supabase = createClient()
            try {
                const { data } = await supabase
                    .from('activity_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50)
                setLogs(data || [])
            } catch {
                setLogs([])
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Activity size={20} style={{ color: 'var(--color-accent)' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Activity Log</h1>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Riwayat aktivitas terbaru di dashboard admin.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
            ) : logs.length === 0 ? (
                <div style={{
                    padding: '4rem 2rem', textAlign: 'center', borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                }}>
                    <Activity size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem', opacity: 0.4 }} />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>Belum ada aktivitas tercatat.</p>
                </div>
            ) : (
                <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Aktivitas</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Target</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Detail</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const Icon = actionIcons[log.action] || Activity
                                    const label = actionLabels[log.action] || log.action
                                    return (
                                        <tr key={log.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Icon size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                                {log.target || '—'}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                                {log.details || '—'}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                                {formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
