-- Create Certificates Table
create table if not exists public.certificates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  issuer text not null,
  issue_date date not null,
  credential_id text,
  credential_url text,
  description text,
  image_url text not null,
  file_url text,
  category text not null check (category in ('course', 'competition', 'award', 'bootcamp', 'other')),
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.certificates enable row level security;

-- Policies for Certificates Table
create policy "Certificates are viewable by everyone" 
  on public.certificates for select 
  using (true);

create policy "Admins can insert certificates" 
  on public.certificates for insert 
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update certificates" 
  on public.certificates for update 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete certificates" 
  on public.certificates for delete 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Create Storage Bucket for Certificates
insert into storage.buckets (id, name, public) 
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Certificate images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'certificates' );

create policy "Admins can upload certificates"
  on storage.objects for insert
  with check (
    bucket_id = 'certificates' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update certificates files"
  on storage.objects for update
  using (
    bucket_id = 'certificates' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete certificates files"
  on storage.objects for delete
  using (
    bucket_id = 'certificates' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Indexes for performance
create index if not exists idx_certificates_category on public.certificates(category);
create index if not exists idx_certificates_featured on public.certificates(is_featured);
create index if not exists idx_certificates_date on public.certificates(issue_date desc);
