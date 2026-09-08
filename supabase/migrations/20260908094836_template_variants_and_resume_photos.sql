alter table public.resumes drop constraint if exists resumes_template_id_check;
alter table public.resumes add constraint resumes_template_id_check
  check (template_id ~ '^(classic|modern|minimal)(-[a-z0-9]+)?$');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resume-photos',
  'resume-photos',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own resume photos" on storage.objects;
drop policy if exists "Users can update own resume photos" on storage.objects;
drop policy if exists "Users can delete own resume photos" on storage.objects;
drop policy if exists "Users can read own resume photos" on storage.objects;

create policy "Users can upload own resume photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);

create policy "Users can update own resume photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
)
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);

create policy "Users can delete own resume photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);

create policy "Users can read own resume photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);
