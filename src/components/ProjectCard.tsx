import Link from 'next/link'
import { ExternalLink, Github, Eye } from 'lucide-react'
import type { Project } from '@/lib/types'

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div
            style={{
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-secondary)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
        >
            {project.image_url && (
                <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
                    <div style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <img
                            src={project.image_url}
                            alt={project.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                            }}
                        />
                        {project.featured && (
                            <span style={{
                                position: 'absolute',
                                top: '0.75rem',
                                right: '0.75rem',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                color: 'white',
                            }}>
                                ⭐ Featured
                            </span>
                        )}
                    </div>
                </Link>
            )}
            <div style={{ padding: '1.25rem' }}>
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    {project.tags?.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.6875rem',
                                fontWeight: 500,
                                backgroundColor: 'var(--color-accent-light)',
                                color: 'var(--color-accent)',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        lineHeight: 1.4,
                    }}>
                        {project.title}
                    </h3>
                </Link>

                {/* Description */}
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {project.description}
                </p>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s ease',
                                }}
                            >
                                <ExternalLink size={12} />
                                Demo
                            </a>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <Github size={12} />
                                Code
                            </a>
                        )}
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <Eye size={12} />
                        {project.view_count}
                    </span>
                </div>
            </div>
        </div>
    )
}
