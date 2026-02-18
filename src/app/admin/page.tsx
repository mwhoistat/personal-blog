'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { FileText, FolderKanban, Eye, Plus, TrendingUp, Clock } from 'lucide-react'
import type { Article } from '@/lib/types'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ articles: 0, projects: 0, totalViews: 0, published: 0 })
    const [recentArticles, setRecentArticles] = useState<Article[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient()
            try {
                const [articles, projects] = await Promise.all([
                    supabase.from('articles').select('*').order('created_at', { ascending: false }),
                    supabase.from('projects').select('view_count'),
                ])
                const articleData = articles.data || []
                const projectData = projects.data || []
                const articleViews = articleData.reduce((sum, a) => sum + (a.view_count || 0), 0)
                const projectViews = projectData.reduce((sum, p) => sum + (p.view_count || 0), 0)
                const publishedCount = articleData.filter(a => a.published).length

                setStats({
                    articles: articleData.length,
                    projects: projectData.length,
                    totalViews: articleViews + projectViews,
                    published: publishedCount,
                })
                setRecentArticles(articleData.slice(0, 5))
            } catch {
                // Supabase not configured
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: 'Total Artikel', value: stats.articles, icon: FileText, color: '#6366f1' },
        { label: 'Published', value: stats.published, icon: TrendingUp, color: '#10b981' },
        { label: 'Total Proyek', value: stats.projects, icon: FolderKanban, color: '#a855f7' },
        { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#f59e0b' },
    ]

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Selamat datang kembali! Kelola konten blog Anda.
                </p>
            </div>

            {/* Stats Cards */}
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
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Aksi Cepat</h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link href="/admin/articles/new" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.25rem', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.875rem',
                        color: 'white', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        textDecoration: 'none', transition: 'opacity 0.2s',
                    }}>
                        <Plus size={16} /> Tulis Artikel Baru
                    </Link>
                    <Link href="/admin/projects/new" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.25rem', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.875rem',
                        color: 'var(--color-text)', backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)', textDecoration: 'none', transition: 'all 0.2s',
                    }}>
                        <Plus size={16} /> Tambah Proyek
                    </Link>
                </div>
            </div>

            {/* Recent Articles */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Artikel Terbaru</h2>
                    <Link href="/admin/articles" style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                        Lihat Semua →
                    </Link>
                </div>

                {recentArticles.length === 0 ? (
                    <div style={{
                        padding: '3rem', textAlign: 'center', borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                    }}>
                        <FileText size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.75rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                            Belum ada artikel. Mulai menulis sekarang!
                        </p>
                        <Link href="/admin/articles/new" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                            Buat Artikel Pertama →
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        borderRadius: '0.75rem', border: '1px solid var(--color-border)',
                        overflow: 'hidden', backgroundColor: 'var(--color-bg-secondary)',
                    }}>
                        {recentArticles.map((article, i) => (
                            <div key={article.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.875rem 1.25rem',
                                borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                            }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <Link href={`/admin/articles/${article.id}/edit`} style={{
                                        fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)',
                                        textDecoration: 'none', display: 'block',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {article.title}
                                    </Link>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={11} /> {formatDate(article.created_at)}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Eye size={11} /> {article.view_count}
                                        </span>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, flexShrink: 0,
                                    backgroundColor: article.published ? 'rgba(16,185,129,0.1)' : 'var(--color-bg-tertiary)',
                                    color: article.published ? '#10b981' : 'var(--color-text-muted)',
                                }}>
                                    {article.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
