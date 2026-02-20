-- Migration: Add SEO and Stats Fields to Articles and Projects
-- Date: 2026-02-20

-- 1. Updates to Articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 0;

-- 2. Updates to Projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 0;
