import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ]

    try {
        const { createServerSupabaseClient } = await import('@/lib/supabase-server')
        const supabase = await createServerSupabaseClient()

        const { data: articles } = await supabase
            .from('articles')
            .select('slug, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: false })

        const articleRoutes: MetadataRoute.Sitemap = (articles || []).map((a: { slug: string; updated_at: string }) => ({
            url: `${baseUrl}/articles/${a.slug}`,
            lastModified: new Date(a.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        const { data: projects } = await supabase
            .from('projects')
            .select('slug, updated_at')
            .order('updated_at', { ascending: false })

        const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((p: { slug: string; updated_at: string }) => ({
            url: `${baseUrl}/projects/${p.slug}`,
            lastModified: new Date(p.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }))

        return [...staticRoutes, ...articleRoutes, ...projectRoutes]
    } catch {
        // If Supabase is not available, just return static routes
        return staticRoutes
    }
}
