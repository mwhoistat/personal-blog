'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'
import ProjectCard from '@/components/ProjectCard'
import { ArticleCardSkeleton, ProjectCardSkeleton } from '@/components/Skeleton'
import { ArrowRight, Sparkles, Code, BookOpen } from 'lucide-react'
import type { Article, Project } from '@/lib/types'

// Demo data for when Supabase is not configured
const demoArticles: Article[] = [
  {
    id: '1', title: 'Memulai dengan Next.js 14 dan App Router', slug: 'memulai-nextjs-14',
    content: '', excerpt: 'Panduan lengkap untuk memulai proyek dengan Next.js 14 menggunakan App Router, Server Components, dan fitur terbaru.',
    cover_image: 'https://picsum.photos/seed/nextjs/800/400', category: 'Tutorial', tags: ['nextjs', 'react', 'webdev'],
    published: true, view_count: 234, author_id: '1', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2', title: 'TypeScript Best Practices untuk Developer', slug: 'typescript-best-practices',
    content: '', excerpt: 'Tips dan trik TypeScript yang akan meningkatkan kualitas kode dan produktivitas development Anda.',
    cover_image: 'https://picsum.photos/seed/typescript/800/400', category: 'Programming', tags: ['typescript', 'javascript'],
    published: true, view_count: 189, author_id: '1', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '3', title: 'Desain UI Modern dengan Tailwind CSS', slug: 'desain-ui-tailwind',
    content: '', excerpt: 'Cara membuat desain UI/UX yang beautiful dan responsive menggunakan Tailwind CSS framework.',
    cover_image: 'https://picsum.photos/seed/tailwind/800/400', category: 'Design', tags: ['tailwindcss', 'ui', 'design'],
    published: true, view_count: 156, author_id: '1', created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '4', title: 'Panduan Supabase untuk Fullstack Developer', slug: 'panduan-supabase',
    content: '', excerpt: 'Pelajari cara menggunakan Supabase sebagai backend untuk aplikasi fullstack modern Anda.',
    cover_image: 'https://picsum.photos/seed/supabase/800/400', category: 'Backend', tags: ['supabase', 'database', 'auth'],
    published: true, view_count: 312, author_id: '1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
]

const demoProjects: Project[] = [
  {
    id: '1', title: 'E-Commerce Platform', slug: 'e-commerce-platform',
    description: 'Platform e-commerce modern dengan fitur keranjang, pembayaran, dan dashboard admin.',
    content: '', image_url: 'https://picsum.photos/seed/ecommerce/800/400',
    demo_url: 'https://example.com', github_url: 'https://github.com',
    tags: ['Next.js', 'Supabase', 'Stripe'], featured: true, view_count: 456,
    created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: '2', title: 'Task Management App', slug: 'task-management-app',
    description: 'Aplikasi manajemen tugas dengan fitur drag-and-drop, label, dan kolaborasi tim.',
    content: '', image_url: 'https://picsum.photos/seed/taskapp/800/400',
    demo_url: 'https://example.com', github_url: 'https://github.com',
    tags: ['React', 'TypeScript', 'PostgreSQL'], featured: true, view_count: 321,
    created_at: '2024-01-18T00:00:00Z', updated_at: '2024-01-18T00:00:00Z',
  },
  {
    id: '3', title: 'Weather Dashboard', slug: 'weather-dashboard',
    description: 'Dashboard cuaca dengan visualisasi data interaktif dan prakiraan 7 hari ke depan.',
    content: '', image_url: 'https://picsum.photos/seed/weather/800/400',
    demo_url: 'https://example.com', github_url: 'https://github.com',
    tags: ['Vue.js', 'D3.js', 'API'], featured: false, view_count: 198,
    created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z',
  },
]

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    try {
      const [articlesRes, projectsRes] = await Promise.all([
        supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false }).limit(4),
        supabase.from('projects').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(3),
      ])
      setArticles(articlesRes.data?.length ? articlesRes.data : demoArticles)
      setProjects(projectsRes.data?.length ? projectsRes.data : demoProjects)
    } catch {
      setArticles(demoArticles)
      setProjects(demoProjects)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
      }}>
        {/* Gradient background blobs */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={14} />
            Personal Blog & Portfolio
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em',
          }}>
            Hai, Saya{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--color-accent), #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Nurathallah
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 2rem',
          }}>
            Siswa SMK TKJ yang antusias dengan <strong>Cybersecurity</strong>, <strong>Pentesting</strong>, dan Teknologi Jaringan. Sedang mengeksplorasi Web Development untuk membangun sistem yang aman.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/articles" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'white',
              background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            }}>
              <BookOpen size={18} />
              Baca Artikel
            </Link>
            <Link href="/projects" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              <Code size={18} />
              Lihat Proyek
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Latest Articles */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Artikel Terbaru</h2>
            <Link href="/articles" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'gap 0.2s ease',
            }}>
              Lihat Semua
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`animate-fade-in animate-fade-in-delay-${i + 1}`}>
                  <ArticleCardSkeleton />
                </div>
              ))
              : articles.map((article, i) => (
                <div key={article.id} className={`animate-fade-in animate-fade-in-delay-${i + 1}`}>
                  <ArticleCard article={article} />
                </div>
              ))
            }
          </div>
        </section>

        {/* Featured Projects */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Proyek Unggulan</h2>
            <Link href="/projects" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              Lihat Semua
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`animate-fade-in animate-fade-in-delay-${i + 1}`}>
                  <ProjectCardSkeleton />
                </div>
              ))
              : projects.map((project, i) => (
                <div key={project.id} className={`animate-fade-in animate-fade-in-delay-${i + 1}`}>
                  <ProjectCard project={project} />
                </div>
              ))
            }
          </div>
        </section>
      </div>
    </>
  )
}
