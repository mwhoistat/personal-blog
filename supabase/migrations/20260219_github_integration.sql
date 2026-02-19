-- Add GitHub integration fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS github_repo_id bigint,
ADD COLUMN IF NOT EXISTS is_github_imported boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stars integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS forks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS language text;

-- Add index for efficient querying of imported projects
CREATE INDEX IF NOT EXISTS idx_projects_github_imported ON public.projects(is_github_imported);
CREATE INDEX IF NOT EXISTS idx_projects_github_repo_id ON public.projects(github_repo_id);
