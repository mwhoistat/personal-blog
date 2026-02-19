export interface Profile {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
    bio: string | null
    role: 'admin' | 'user'
    created_at: string
}

export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    cover_image: string | null
    category: string
    tags: string[]
    published: boolean // @deprecated use status instead
    status: ArticleStatus
    published_at: string | null
    view_count: number
    author_id: string
    created_at: string
    updated_at: string
    author?: Profile
}

export interface Project {
    id: string
    title: string
    slug: string
    description: string
    content: string
    image_url: string | null
    demo_url: string | null
    github_url: string | null
    tags: string[]
    featured: boolean
    status: ArticleStatus // Shared status type
    published_at: string | null
    view_count: number
    created_at: string
    updated_at: string
    // GitHub Integration
    github_repo_id?: number
    is_github_imported?: boolean
    stars?: number
    forks?: number
    language?: string
}

export interface SiteSetting {
    key: string
    value: string
    updated_at: string
}

export interface ActivityLog {
    id: string
    user_id: string
    action: string
    target: string
    details: string | null
    created_at: string
    user?: Profile
}
export type CertificateCategory = 'course' | 'competition' | 'award' | 'bootcamp' | 'other'

export interface Certificate {
    id: string
    title: string
    issuer: string
    issue_date: string
    credential_id?: string | null
    credential_url?: string | null
    description?: string | null
    image_url: string
    file_url?: string | null
    category: CertificateCategory
    is_featured: boolean
    status: ArticleStatus
    published_at: string | null
    created_at: string
    updated_at: string
}
