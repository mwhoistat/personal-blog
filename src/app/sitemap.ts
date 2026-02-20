import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://my-blog.com'

    // Fetch all published articles
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())

    // Fetch all published projects
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())

    // Fetch all published certificates (optional for sitemap, but good to have)
    const { data: certificates } = await supabase
        .from('certificates')
        .select('updated_at')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('updated_at', { ascending: false })
        .limit(1)

    const articleUrls = (articles || []).map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const projectUrls = (projects || []).map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/certificates`,
            lastModified: certificates?.[0]?.updated_at ? new Date(certificates[0].updated_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...articleUrls,
        ...projectUrls,
    ]
}
