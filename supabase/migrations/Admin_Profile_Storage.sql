-- Create admin_profiles bucket (skip if it already exists)
insert into storage.buckets (id, name, public)
values ('admin_profiles', 'admin_profiles', false)
on conflict (id) do nothing;

-- Drop existing policies for admin_profiles bucket if they exist
drop policy if exists "Admins can upload their own avatar" on storage.objects;
drop policy if exists "Admins can update their own avatar" on storage.objects;
drop policy if exists "Admins can delete their own avatar" on storage.objects;
drop policy if exists "Anyone can view admin avatars" on storage.objects;

-- Create policies for admin_profiles bucket

-- Policy: Admins can upload their own avatar
create policy "Admins can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'admin_profiles' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Admins can update their own avatar
create policy "Admins can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'admin_profiles' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Admins can delete their own avatar
create policy "Admins can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'admin_profiles' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can view admin avatars
create policy "Anyone can view admin avatars"
  on storage.objects for select
  using (
    bucket_id = 'admin_profiles'
  );