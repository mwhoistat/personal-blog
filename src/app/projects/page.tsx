'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import CyberCard from '@/components/CyberCard'
import { ProjectCardSkeleton } from '@/components/Skeleton'
import { Terminal, Filter, Search } from 'lucide-react'
import type { Project } from '@/lib/types'

function ProjectsContent() {
    const searchParams = useSearchParams()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchProjects = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'published')
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false })

            if (data) setProjects(data)
            setLoading(false)
        }
        fetchProjects()
    }, [])

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) || p.slug.includes(filter))

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 mb-4 text-[var(--color-cyan)] font-mono-tech text-sm">
                        <Terminal size={14} />
                        <span>root@atha:~/projects# ls -la</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Projects</h1>
                    <p className="text-[var(--color-text-secondary)] max-w-xl">
                        A collection of open source tools, scripts, and fullstack applications I've engineered.
                    </p>
                </div>

                {/* Filter (Visual only for now, logic can be added/expanded) */}
                <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] p-1 rounded-lg border border-[var(--color-border)]">
                    {['all', 'scripts', 'web', 'infra'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-xs font-mono-tech transition-colors ${filter === f
                                ? 'bg-[var(--color-cyan)] text-[var(--color-bg)] font-bold'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
                ) : (
                    filteredProjects.map((project) => (
                        <CyberCard
                            key={project.id}
                            title={project.title}
                            excerpt={project.description}
                            slug={project.slug}
                            type="project"
                            image={project.image_url || undefined}
                            tags={project.tags}
                        />
                    ))
                )}
            </div>

            {!loading && projects.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-lg">
                    <Terminal size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                    <p className="text-[var(--color-text-secondary)] font-mono-tech">No protocols found in this directory.</p>
                </div>
            )}
        </div>
    )
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ProjectsContent />
        </Suspense>
    )
}
