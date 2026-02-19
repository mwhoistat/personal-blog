'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Terminal, Shield, Cpu, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import CyberCard from '@/components/CyberCard'
import type { Article, Project } from '@/lib/types'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Typewriter effect state
  const [text, setText] = useState('')
  const fullText = "Cybersecurity Researcher & Network Engineer."

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch 3 latest articles
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(3)

      // Fetch 2 latest projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(2)

      if (articlesData) setArticles(articlesData)
      if (projectsData) setProjects(projectsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 min-h-[80vh] flex flex-col justify-center border-b border-[var(--color-border)] animate-fade-in-up">
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-mono-tech">
            <span className="animate-pulse">●</span> SYSTEM_READY
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cyan)]">Atha</span>.
          </h1>

          <div className="font-mono-tech text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8 h-8 flex items-center">
            <span className="text-[var(--color-accent)] mr-2">{'>'}</span>
            {text}
            <span className="animate-pulse w-3 h-6 bg-[var(--color-text)] ml-1"></span>
          </div>

          <p className="max-w-xl text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed">
            Specializing in penetration testing, network infrastructure, and secure fullstack development.
            Building systems that are robust, scalable, and secure by design.
          </p>

          <div className="flex gap-4">
            <Link href="/projects" className="group flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-6 py-3 rounded-md font-bold hover:bg-[var(--color-accent)] transition-all">
              View Protocols <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all font-mono-tech text-sm flex items-center">
              ./init_contact.sh
            </Link>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--color-accent)]/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 opacity-20 hidden md:block">
          <Shield size={300} strokeWidth={0.5} />
        </div>
      </section>

      {/* QUICK STATS / SKILLS BAR */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center md:justify-between gap-6 md:gap-16">
          {[
            { label: 'NETWORK SECURITY', icon: Shield, val: 'SECURE' },
            { label: 'PENETRATION TESTING', icon: Terminal, val: 'ACTIVE' },
            { label: 'SYSTEM ARCHITECTURE', icon: Cpu, val: 'OPTIMIZED' }
          ].map((skill, i) => (
            <div key={i} className="flex items-center gap-4 group min-w-[200px] md:min-w-0">
              <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bg)] transition-colors">
                <skill.icon size={24} />
              </div>
              <div>
                <h4 className="font-mono-tech text-xs text-[var(--color-text-muted)] tracking-wider mb-1">{skill.label}</h4>
                <p className="font-bold text-sm tracking-widest">{skill.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST LOGS (ARTICLES) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-[var(--color-accent)]">01.</span> Latest Logs
            </h2>
            <p className="text-[var(--color-text-secondary)]">Recent security research and technical write-ups.</p>
          </div>
          <Link href="/articles" className="hidden md:flex items-center gap-2 text-[var(--color-accent)] font-mono-tech text-sm hover:underline">
            VIEW_ALL_LOGS <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-[var(--color-bg-secondary)] animate-pulse border border-[var(--color-border)]"></div>
            ))
          ) : (
            articles.map((article) => (
              <CyberCard
                key={article.id}
                title={article.title}
                excerpt={article.content.substring(0, 100) + '...'} // Simple extraction, real app should store excerpt
                slug={article.slug}
                type="article"
                date={article.created_at}
                tags={JSON.parse(JSON.stringify(article.tags || []))}
                image={article.cover_image || undefined}
              />
            ))
          )}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/articles" className="flex items-center justify-center w-full py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-mono-tech text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
            VIEW_ALL_LOGS
          </Link>
        </div>
      </section>

      {/* FEATURED PROTOCOLS (PROJECTS) */}
      <section className="py-24 px-6 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-[var(--color-cyan)]">02.</span> Deployed Protocols
              </h2>
              <p className="text-[var(--color-text-secondary)]">Open source tools and infrastructure projects.</p>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-[var(--color-cyan)] font-mono-tech text-sm hover:underline">
              ACCESS_ALL_PROJECTS <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-[var(--color-bg)] animate-pulse border border-[var(--color-border)]"></div>
              ))
            ) : (
              projects.map((project) => (
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
        </div>
      </section>
    </div>
  )
}
