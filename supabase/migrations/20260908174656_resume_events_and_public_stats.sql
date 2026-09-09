create table public.resume_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid references public.resumes (id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default now(),
  constraint resume_events_event_type_check
    check (event_type = any (array[
      'created'::text,
      'duplicated'::text,
      'deleted'::text,
      'downloaded'::text,
      'emailed'::text
    ]))
);

create index resume_events_user_id_created_at_idx
  on public.resume_events (user_id, created_at desc);
create index resume_events_event_type_idx
  on public.resume_events (event_type);
create index resume_events_user_event_created_idx
  on public.resume_events (user_id, event_type, created_at desc);

comment on table public.resume_events is
  'First-party product events for landing stats and the admin dashboard';

alter table public.resume_events enable row level security;

create policy "Users can insert own events"
  on public.resume_events
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can select own events"
  on public.resume_events
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function private.get_public_stats()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'users', (select count(*)::int from public.profiles),
    'resumes', (select count(*)::int from public.resumes),
    'downloads', (
      select count(*)::int
      from public.resume_events
      where event_type = 'downloaded'
    ),
    'emails_sent', (
      select count(*)::int
      from public.resume_events
      where event_type = 'emailed'
    )
  );
$$;

create or replace function public.get_public_stats()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select private.get_public_stats();
$$;

revoke all on function public.get_public_stats() from public;
grant execute on function public.get_public_stats() to anon, authenticated;
grant select, insert on public.resume_events to authenticated;
