-- UKJobAlert: optional company logo + workplace/job photo support
-- Run once in Supabase SQL Editor before testing the upload feature.

alter table public.jobs
  add column if not exists company_logo_url text,
  add column if not exists job_image_url text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'job-media',
  'job-media',
  true,
  4194304,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
