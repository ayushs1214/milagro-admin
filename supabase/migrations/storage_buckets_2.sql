-- Create storage buckets (skip if already exists)
insert into storage.buckets (id, name, public) values 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('documents', 'documents', false),
  ('signatures', 'signatures', false),
  ('expo_gallery', 'expo_gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for all buckets to avoid conflicts
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Product images are publicly accessible" on storage.objects;
drop policy if exists "Admins can manage product images" on storage.objects;
drop policy if exists "Only authenticated users can view documents" on storage.objects;
drop policy if exists "Admins can manage documents" on storage.objects;
drop policy if exists "Signatures are privately accessible" on storage.objects;
drop policy if exists "Admins can manage signatures" on storage.objects;
drop policy if exists "Expo images are publicly accessible" on storage.objects;
drop policy if exists "Admins can manage expo images" on storage.objects;

-- Avatars bucket policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Products bucket policies
create policy "Product images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Admins can manage product images"
  on storage.objects for all
  using (
    bucket_id = 'products' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'superadmin')
    )
  );

-- Documents bucket policies
create policy "Only authenticated users can view documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated'
  );

create policy "Admins can manage documents"
  on storage.objects for all
  using (
    bucket_id = 'documents' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'superadmin')
    )
  );

-- Signatures bucket policies
create policy "Signatures are privately accessible"
  on storage.objects for select
  using (
    bucket_id = 'signatures' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'superadmin')
    )
  );

create policy "Admins can manage signatures"
  on storage.objects for all
  using (
    bucket_id = 'signatures' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'superadmin')
    )
  );

-- Expo gallery bucket policies
create policy "Expo images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'expo_gallery' );

create policy "Admins can manage expo images"
  on storage.objects for all
  using (
    bucket_id = 'expo_gallery' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'superadmin')
    )
  );