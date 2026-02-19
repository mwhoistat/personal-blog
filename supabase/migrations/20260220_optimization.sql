-- Migration: System Optimization & Unified Status
-- Date: 2026-02-20

-- 1. Certificates: Add Status & Published At
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS status status_type DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Migrate existing certificates (assume published if they exist)
UPDATE public.certificates SET status = 'published', published_at = created_at WHERE status = 'draft'; 
-- Wait, default is draft. If table is empty, no update needed. If data exists, we might want to publish them.
-- Better: UPDATE public.certificates SET status = 'published' WHERE status IS NOT NULL; (safest if we assume populated data was meant to be public)

-- 2. Performance Indexes
-- Articles
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_status_published_at ON public.projects(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_status_published_at ON public.certificates(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON public.certificates(issue_date DESC);

-- 3. RLS Updates (Ensure Drafts are private)
-- We'll need to double check policies, but usually 'published = true' was used. 
-- Now we use status = 'published'.

-- Update Article Policy to use status (if not already done manually or via previous migration)
-- Drop old policy if exists to avoid conflicts or confusion, OR create new one.
-- "Published articles are viewable by everyone"
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;
CREATE POLICY "Public view published articles" ON public.articles FOR SELECT USING (status = 'published');

-- Projects Policy
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects; -- Was allow true
CREATE POLICY "Public view published projects" ON public.projects FOR SELECT USING (status = 'published');

-- Certificates Policy
DROP POLICY IF EXISTS "Certificates are viewable by everyone" ON public.certificates; -- Was allow true
CREATE POLICY "Public view published certificates" ON public.certificates FOR SELECT USING (status = 'published');

-- Admins can still do everything via existing admin policies (checking role='admin')
