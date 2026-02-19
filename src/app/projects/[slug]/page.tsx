import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { ArrowLeft, ExternalLink, Github, Terminal } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ViewCounter from '@/components/ViewCounter'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const supabase = createClient()

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single()

    if (!project) {
        notFound()
    }

    const techs = Array.isArray(project.technologies) ? project.technologies : []

    return (
        <div className="min-h-screen pb-20">
            <ViewCounter slug={project.slug} table="projects" />
            {/* Header */}
            <div className="pt-32 pb-12 px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="max-w-5xl mx-auto">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-cyan)] mb-8 font-mono-tech text-sm transition-colors">
                        <ArrowLeft size={16} /> ../return_to_index
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4 text-[var(--color-cyan)] font-mono-tech text-sm">
                                <Terminal size={14} />
                                <span>PROTOCOL_DEPLOYED</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
                            <p className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[var(--color-cyan)] text-[var(--color-bg)] font-bold rounded hover:opacity-90 transition-opacity">
                                        LIVE_DEMO <ExternalLink size={16} />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text)] transition-colors rounded">
                                        <Github size={18} /> SOURCE_CODE
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {techs.map((tech: string) => (
                                    <span key={tech} className="px-3 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs font-mono-tech text-[var(--color-cyan)]">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Project Image */}
                        {project.image_url && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] shadow-2xl group">
                                <div className="absolute inset-0 bg-[var(--color-cyan)]/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Image
                                    src={project.image_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-invert prose-lg max-w-none prose-pre:bg-[var(--color-bg-secondary)] prose-pre:border prose-pre:border-[var(--color-border)] prose-headings:font-bold prose-headings:text-[var(--color-text)]">
                    <MarkdownRenderer content={project.content} />
                </div>
            </div>
        </div>
    )
}
