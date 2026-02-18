'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { ArticleDetailSkeleton } from '@/components/Skeleton'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, ExternalLink, Github, Eye, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const demoProject: Project = {
    id: '1', title: 'E-Commerce Platform', slug: 'e-commerce-platform',
    description: 'Platform e-commerce modern dengan fitur keranjang, pembayaran, dan dashboard admin.',
    content: `# E-Commerce Platform

Sebuah platform e-commerce fullstack yang dibangun dengan teknologi modern.

## Fitur Utama

- **Katalog Produk**: Browse dan search produk dengan filter
- **Keranjang Belanja**: Add to cart, update quantity, remove items
- **Pembayaran**: Integrasi Stripe untuk payment processing
- **Dashboard Admin**: Manajemen produk, order, dan analytics
- **User Authentication**: Register, login, profile management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Payment | Stripe API |
| Deployment | Vercel |

## Screenshots

Tampilan modern dan responsive di semua device.

## Pelajaran yang Didapat

Proyek ini mengajarkan banyak hal tentang:
1. State management di React
2. Integrasi payment gateway
3. Database design untuk e-commerce
4. Performance optimization`,
    image_url: 'https://picsum.photos/seed/ecommerce/1200/600',
    demo_url: 'https://example.com', github_url: 'https://github.com',
    tags: ['Next.js', 'Supabase', 'Stripe', 'Tailwind CSS'], featured: true, view_count: 456,
    created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z',
}

export default function ProjectDetailPage() {
    const params = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProject = useCallback(async () => {
        const supabase = createClient()
        try {
            const { data } = await supabase
                .from('projects').select('*').eq('slug', params.slug).single()
            if (data) {
                setProject(data)
                await supabase.rpc('increment_view_count', { table_name: 'projects', record_slug: params.slug as string })
            } else {
                setProject(demoProject)
            }
        } catch {
            setProject(demoProject)
        } finally {
            setLoading(false)
        }
    }, [params.slug])

    useEffect(() => { fetchProject() }, [fetchProject])

    if (loading) return <ArticleDetailSkeleton />
    if (!project) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <p>Proyek tidak ditemukan.</p>
            <Link href="/projects" style={{ color: 'var(--color-accent)' }}>Kembali ke daftar proyek</Link>
        </div>
    )

    return (
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }} className="animate-fade-in">
            <Link href="/projects" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
                <ArrowLeft size={16} /> Kembali
            </Link>

            {project.featured && (
                <span style={{
                    display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                    fontSize: '0.75rem', fontWeight: 600, background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    color: 'white', marginBottom: '1rem',
                }}>
                    ⭐ Featured Project
                </span>
            )}

            <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2,
                marginBottom: '0.75rem', letterSpacing: '-0.025em',
            }}>
                {project.title}
            </h1>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {project.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={14} />{formatDate(project.created_at)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Eye size={14} />{project.view_count} views</span>
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {project.tags?.map((tag) => (
                    <span key={tag} style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem',
                        borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500,
                        backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)',
                    }}>
                        <Tag size={10} />{tag}
                    </span>
                ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem',
                        borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'white',
                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)', textDecoration: 'none',
                    }}>
                        <ExternalLink size={16} />Live Demo
                    </a>
                )}
                {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem',
                        borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)',
                        border: '1px solid var(--color-border)', textDecoration: 'none', backgroundColor: 'var(--color-bg-secondary)',
                    }}>
                        <Github size={16} />Source Code
                    </a>
                )}
            </div>

            {project.image_url && (
                <div style={{ borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
                    <img src={project.image_url} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            )}

            <MarkdownRenderer content={project.content} />
        </article>
    )
}
