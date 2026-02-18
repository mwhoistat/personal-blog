'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { FileText, FolderKanban, MessageSquare, Eye } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ articles: 0, projects: 0, comments: 0, totalViews: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient()
            try {
                const [articles, projects, comments] = await Promise.all([
                    supabase.from('articles').select('view_count'),
                    supabase.from('projects').select('view_count'),
                    supabase.from('comments').select('id'),
                ])
                const articleViews = (articles.data || []).reduce((sum, a) => sum + (a.view_count || 0), 0)
                const projectViews = (projects.data || []).reduce((sum, p) => sum + (p.view_count || 0), 0)
                setStats({
                    articles: articles.data?.length || 0,
                    projects: projects.data?.length || 0,
                    comments: comments.data?.length || 0,
                    totalViews: articleViews + projectViews,
                })
            } catch {
                // Demo stats
                setStats({ articles: 6, projects: 5, comments: 12, totalViews: 1845 })
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: 'Artikel', value: stats.articles, icon: FileText, color: '#6366f1' },
        { label: 'Proyek', value: stats.projects, icon: FolderKanban, color: '#a855f7' },
        { label: 'Komentar', value: stats.comments, icon: MessageSquare, color: '#10b981' },
        { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#f59e0b' },
    ]

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                Selamat datang di admin panel. Kelola artikel, proyek, dan komentar.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                {cards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} style={{
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        transition: 'transform 0.2s ease',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</span>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '0.5rem',
                                backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={18} style={{ color }} />
                            </div>
                        </div>
                        <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{value}</p>
                    </div>
                ))}
            </div>

            <div style={{
                padding: '2rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-secondary)',
                textAlign: 'center',
            }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Gunakan sidebar untuk mengelola konten blog Anda.
                </p>
            </div>
        </div>
    )
}
