import { Project } from './types'

const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubRepo {
    id: number
    name: string
    full_name: string
    html_url: string
    description: string | null
    stargazers_count: number
    forks_count: number
    language: string | null
    topics: string[]
    updated_at: string
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
    const token = process.env.GITHUB_TOKEN

    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Blog-Importer',
    }

    if (token) {
        headers['Authorization'] = `token ${token}`
    }

    try {
        const res = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`, {
            headers,
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!res.ok) {
            if (res.status === 404) throw new Error('User not found')
            if (res.status === 403) throw new Error('Rate limit exceeded or invalid token')
            throw new Error(`GitHub API Error: ${res.statusText}`)
        }

        const repos: GitHubRepo[] = await res.json()
        // Filter out forks if desired, or keep them. keeping them for now.
        return repos
    } catch (error) {
        console.error('Failed to fetch GitHub repos:', error)
        throw error
    }
}

export function mapRepoToProject(repo: GitHubRepo): Partial<Project> {
    return {
        title: repo.name,
        slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: repo.description || '',
        github_url: repo.html_url,
        tags: repo.topics || [repo.language || 'Code'],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || undefined,
        github_repo_id: repo.id,
        is_github_imported: true,
        content: `Imported from GitHub. \n\n${repo.description || ''}\n\n[View on GitHub](${repo.html_url})`
    }
}
