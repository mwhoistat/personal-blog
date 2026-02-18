'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import SearchBar from '@/components/SearchBar'
import { ProjectCardSkeleton } from '@/components/Skeleton'
import { Code } from 'lucide-react'
import type { Project } from '@/lib/types'

const demoProjects: Project[] = [
    { id: '1', title: 'E-Commerce Platform', slug: 'e-commerce-platform', description: 'Platform e-commerce modern dengan fitur keranjang, pembayaran, dan dashboard admin.', content: '# E-Commerce Platform\n\nPlatform lengkap...', image_url: 'https://picsum.photos/seed/ecommerce/800/400', demo_url: 'https://example.com', github_url: 'https://github.com', tags: ['Next.js', 'Supabase', 'Stripe'], featured: true, view_count: 456, created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' },
    { id: '2', title: 'Task Management App', slug: 'task-management-app', description: 'Aplikasi manajemen tugas dengan fitur drag-and-drop dan kolaborasi.', content: '', image_url: 'https://picsum.photos/seed/taskapp/800/400', demo_url: 'https://example.com', github_url: 'https://github.com', tags: ['React', 'TypeScript', 'PostgreSQL'], featured: true, view_count: 321, created_at: '2024-01-18T00:00:00Z', updated_at: '2024-01-18T00:00:00Z' },
    { id: '3', title: 'Weather Dashboard', slug: 'weather-dashboard', description: 'Dashboard cuaca dengan visualisasi data interaktif.', content: '', image_url: 'https://picsum.photos/seed/weather/800/400', demo_url: 'https://example.com', github_url: 'https://github.com', tags: ['Vue.js', 'D3.js', 'API'], featured: false, view_count: 198, created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
    { id: '4', title: 'Chat Application', slug: 'chat-app', description: 'Aplikasi chat realtime dengan WebSocket.', content: '', image_url: 'https://picsum.photos/seed/chatapp/800/400', demo_url: 'https://example.com', github_url: 'https://github.com', tags: ['Node.js', 'Socket.io', 'Redis'], featured: false, view_count: 267, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
    { id: '5', title: 'Portfolio Website', slug: 'portfolio-website', description: 'Website portfolio personal dengan animasi modern.', content: '', image_url: 'https://picsum.photos/seed/portfolio/800/400', demo_url: 'https://example.com', github_url: 'https://github.com', tags: ['Next.js', 'Framer Motion', 'GSAP'], featured: false, view_count: 145, created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' },
]

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filtered, setFiltered] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchProjects = useCallback(async () => {
        const supabase = createClient()
        try {
            const { data } = await supabase
                .from('projects').select('*')
                .order('featured', { ascending: false })
                .order('created_at', { ascending: false })
            setProjects(data?.length ? data : demoProjects)
        } catch {
            setProjects(demoProjects)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])

    useEffect(() => {
        if (!searchQuery) {
            setFiltered(projects)
        } else {
            const q = searchQuery.toLowerCase()
            setFiltered(projects.filter((p) =>
                p.title.toLowerCase().includes(q) ||
                p.tags?.some((t) => t.toLowerCase().includes(q)) ||
                p.description.toLowerCase().includes(q)
            ))
        }
    }, [projects, searchQuery])

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Code size={24} style={{ color: 'var(--color-accent)' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Proyek</h1>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                    Koleksi proyek programming dan desain yang telah saya kerjakan.
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '2rem' }} className="animate-fade-in animate-fade-in-delay-1">
                <SearchBar placeholder="Cari proyek..." onSearch={handleSearch} />
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
                    <Code size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tidak ada proyek ditemukan</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Coba kata kunci lain.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((project, i) => (
                        <div key={project.id} className={`animate-fade-in animate-fade-in-delay-${(i % 3) + 1}`}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
