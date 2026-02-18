'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import SearchBar from '@/components/SearchBar'
import { ProjectCardSkeleton } from '@/components/Skeleton'
import { Code } from 'lucide-react'
import type { Project } from '@/lib/types'

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
            setProjects(data || [])
        } catch {
            setProjects([])
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
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Silakan tambahkan proyek baru di Admin Panel.</p>
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
