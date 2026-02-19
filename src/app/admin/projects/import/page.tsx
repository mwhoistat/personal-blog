'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { fetchGitHubRepos, mapRepoToProject, GitHubRepo } from '@/lib/github'
import { ArrowLeft, Github, Download, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ImportGithubPage() {
    const [repos, setRepos] = useState<GitHubRepo[]>([])
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const init = async () => {
            // Get username from settings
            const { data } = await supabase.from('site_settings').select('value').eq('key', 'social_github_username').single()
            if (!data?.value) {
                setLoading(false)
                return
            }
            setUsername(data.value)
            loadRepos(data.value)
        }
        init()
    }, [])

    const loadRepos = async (user: string) => {
        setLoading(true)
        setError(null)
        try {
            // In a real app, this should call a Server Action to keep token secret
            // For this demo, we'll assume public access or token injected via next.config env
            // BUT: We need to use a server action or API route to avoid exposing the token if we use one.
            // Since we implemented fetchGitHubRepos in lib/github.ts which is server-side compatible, 
            // we should technically call it via a Server Action.
            // Let's mock the internal API call for now or use a specialized API route. 
            // *Correction*: We can't call lib functions with process.env from Client Components directly if they depend on Node-based env vars securely.
            // I'll create a simple API route for this.
            const res = await fetch(`/api/github/repos?username=${user}`)
            if (!res.ok) throw new Error('Failed to fetch repositories')
            const data = await res.json()
            setRepos(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async (repo: GitHubRepo) => {
        setImporting(repo.id)
        try {
            const projectData = mapRepoToProject(repo)
            const { error } = await supabase.from('projects').insert([projectData])
            if (error) throw error
            router.push('/admin/projects')
        } catch (err: any) {
            alert('Import failed: ' + err.message)
        } finally {
            setImporting(null)
        }
    }

    if (!username && !loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6 text-center">
                <Github size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
                <h1 className="text-2xl font-bold mb-4">GitHub Integration Not Configured</h1>
                <p className="text-[var(--color-text-secondary)] mb-8">Please set your GitHub username in Settings first.</p>
                <Link href="/admin/settings" className="btn-primary inline-flex items-center gap-2">
                    Go to Settings
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/projects" className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-mono-tech">Import from GitHub</h1>
                        <p className="text-sm text-[var(--color-text-secondary)]">Fetching public repositories for @{username}</p>
                    </div>
                </div>
                <button
                    onClick={() => username && loadRepos(username)}
                    className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-accent)]"
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {error && (
                <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-4 rounded-lg mb-8 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-[var(--color-bg-secondary)] animate-pulse rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map(repo => (
                        <div key={repo.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <Github size={24} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                                <div className="text-xs font-mono-tech text-[var(--color-text-muted)]">
                                    {new Date(repo.updated_at).toLocaleDateString()}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-2 truncate" title={repo.name}>{repo.name}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-6 h-10 overflow-hidden line-clamp-2">
                                {repo.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mb-6 font-mono-tech">
                                <span>★ {repo.stargazers_count}</span>
                                <span>⑂ {repo.forks_count}</span>
                                <span className="ml-auto text-[var(--color-cyan)]">{repo.language}</span>
                            </div>

                            <button
                                onClick={() => handleImport(repo)}
                                disabled={importing === repo.id}
                                className="w-full py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded hover:bg-[var(--color-accent)] hover:text-black transition-colors font-mono-tech text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {importing === repo.id ? (
                                    <span className="animate-spin">⟳</span>
                                ) : (
                                    <Download size={16} />
                                )}
                                IMPORT_PROJECT
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
