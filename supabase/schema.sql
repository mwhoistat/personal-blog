-- Supabase Schema for Personal Blog
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- Articles table
create table if not exists public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null default '',
  excerpt text not null default '',
  cover_image text,
  category text not null default 'Uncategorized',
  tags text[] default '{}',
  published boolean default false,
  view_count integer default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null default '',
  content text not null default '',
  image_url text,
  demo_url text,
  github_url text,
  tags text[] default '{}',
  featured boolean default false,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(published);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_featured on public.projects(featured);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.projects enable row level security;

-- Profiles: anyone can read, users can update own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Articles: anyone can read published, admins can CRUD
create policy "Published articles are viewable by everyone" on public.articles for select using (published = true);
create policy "Admins can do everything with articles" on public.articles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Projects: anyone can read, admins can CRUD
create policy "Projects are viewable by everyone" on public.projects for select using (true);
create policy "Admins can do everything with projects" on public.projects for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);



-- Function to handle profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto profile creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment view count
create or replace function increment_view_count(table_name text, record_slug text)
returns void as $$
begin
  if table_name = 'articles' then
    update public.articles set view_count = view_count + 1 where slug = record_slug;
  elsif table_name = 'projects' then
    update public.projects set view_count = view_count + 1 where slug = record_slug;
  end if;
end;
$$ language plpgsql security definer;
