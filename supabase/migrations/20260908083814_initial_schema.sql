create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Resume',
  template_id text not null default 'classic',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resumes_template_id_check check (template_id in ('classic', 'modern', 'minimal'))
);

create index resumes_user_id_updated_at_idx on public.resumes (user_id, updated_at desc);

comment on table public.profiles is 'User profile data synced from auth.users';
comment on table public.resumes is 'User-owned resume documents';

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;

create policy "Users can select own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users can select own resumes"
  on public.resumes
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can insert own resumes"
  on public.resumes
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update own resumes"
  on public.resumes
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete own resumes"
  on public.resumes
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function private.set_updated_at();

create trigger set_resumes_updated_at
  before update on public.resumes
  for each row
  execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.resumes to authenticated;
