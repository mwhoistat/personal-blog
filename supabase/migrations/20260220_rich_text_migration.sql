-- Migration: Rich Text & Draft System Support
-- Date: 2026-02-20

-- 1. Create Status Enum
DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update Articles Table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status status_type DEFAULT 'draft';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Migrate existing 'published' boolean to 'status' enum
UPDATE public.articles SET status = 'published', published_at = created_at WHERE published = true;
UPDATE public.articles SET status = 'draft' WHERE published = false;

-- Drop old 'published' column (optional, but cleaner)
-- ALTER TABLE public.articles DROP COLUMN published; 
-- Keeping it for now for safety, but we will ignore it in application code.

-- 3. Update Projects Table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status status_type DEFAULT 'draft';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Migrate existing 'published' boolean (if applicable, Projects use 'featured' but let's assume standard publishing too)
-- Actually Projects don't have 'published' column in schema.sql, only 'featured'.
-- Let's add 'status' to allow Draft projects.
UPDATE public.projects SET status = 'published'; -- Assume all existing are published for now.

-- 4. Create Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
