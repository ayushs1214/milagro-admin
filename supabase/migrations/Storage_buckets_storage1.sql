-- Create storage buckets (skip if already exists)
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

-- Drop existing policies for avatars bucket
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Users can upload their own avatar." on storage.objects;

-- Avatars bucket policies

-- Policy: Avatar images are publicly accessible
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Users can upload their own avatar
create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Drop existing policies for products bucket
drop policy if exists "Product images are publicly accessible." on storage.objects;
drop policy if exists "Admins can manage product images." on storage.objects;

-- Products bucket policies

-- Policy: Product images are publicly accessible
create policy "Product images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy: Admins can manage product images
create policy "Admins can manage product images."
  on storage.objects for all
  using (
    bucket_id = 'products' and
    exists (
      select 1 from profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'superadmin')
    )
  );

-- Drop existing policies for documents bucket
drop policy if exists "Only authenticated users can view documents." on storage.objects;
drop policy if exists "Admins can manage documents." on storage.objects;

-- Documents bucket policies

-- Policy: Only authenticated users can view documents
create policy "Only authenticated users can view documents."
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated'
  );

-- Policy: Admins can manage documents
create policy "Admins can manage documents."
  on storage.objects for all
  using (
    bucket_id = 'documents' and
    exists (
      select 1 from profiles
      where id = auth.uid()
      and (role = 'admin' or role = 'superadmin')
    )
  );