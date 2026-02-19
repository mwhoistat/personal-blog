-- FIX RLS POLICIES FOR PROFILES TABLE
-- Run this in the Supabase SQL Editor

-- 1. Reset Policies
alter table public.profiles disable row level security;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;

-- 2. Re-enable RLS
alter table public.profiles enable row level security;

-- 3. Create Strict Policies

-- Allow Users to Read their OWN profile (Critical for Admin Check)
create policy "Users can read own profile"
on public.profiles
for select
using ( auth.uid() = id );

-- Allow Users to Update their OWN profile
create policy "Users can update own profile"
on public.profiles
for update
using ( auth.uid() = id );

-- Allow Users to Insert their OWN profile
create policy "Users can insert own profile"
on public.profiles
for insert
with check ( auth.uid() = id );

-- Optional: Allow public read if you have public profiles, otherwise restrict to own
-- For now, let's keep it restricted to ensure security, or allow all if needed for blog author display.
-- Safer to allow public read for blog features:
create policy "Public can view profiles"
on public.profiles
for select
using ( true );

-- 4. Verify Admin Role exists (optional helper, harmless if exists)
-- This ensures the column exists and has the correct constraint
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
    alter table public.profiles add column role text default 'user' check (role in ('admin', 'user'));
  end if;
end $$;
