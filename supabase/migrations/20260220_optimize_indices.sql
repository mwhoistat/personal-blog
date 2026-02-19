-- Migration: Optimize Indices for Performance
-- Created: 2026-02-20
-- Description: Adds indices to frequently queried columns to improve sort and filter performance.

-- Articles Indices
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON public.articles USING GIN(tags);

-- Projects Indices
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON public.projects USING GIN(tags);

-- Composite Index for common "Published & Recent" query
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at ON public.articles(status, created_at DESC);
