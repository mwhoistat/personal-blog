export interface Profile {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
    bio: string | null
    role: 'admin' | 'user'
    created_at: string
}

export interface Article {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    cover_image: string | null
    category: string
    tags: string[]
    published: boolean
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
    view_count: number
    created_at: string
    updated_at: string
}

export interface Comment {
    id: string
    article_id: string
    user_id: string
    content: string
    created_at: string
    user?: Profile
}
