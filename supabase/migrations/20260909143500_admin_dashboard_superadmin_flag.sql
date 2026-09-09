create or replace function public.admin_dashboard()
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result json;
begin
  if not private.is_superadmin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select json_build_object(
    'overview', json_build_object(
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
      ),
      'created', (
        select count(*)::int
        from public.resume_events
        where event_type = 'created'
      ),
      'duplicated', (
        select count(*)::int
        from public.resume_events
        where event_type = 'duplicated'
      ),
      'deleted', (
        select count(*)::int
        from public.resume_events
        where event_type = 'deleted'
      )
    ),
    'daily', coalesce((
      select json_agg(row_to_json(d) order by d.day)
      from (
        select
          gs.day::date as day,
          count(e.id) filter (where e.event_type = 'downloaded')::int as downloads,
          count(e.id) filter (where e.event_type = 'emailed')::int as emails_sent,
          count(e.id) filter (where e.event_type = 'created')::int as created,
          count(e.id) filter (where e.event_type = 'duplicated')::int as duplicated,
          count(e.id) filter (where e.event_type = 'deleted')::int as deleted
        from generate_series(
          ((timezone('utc', now()))::date - 29),
          (timezone('utc', now()))::date,
          interval '1 day'
        ) as gs(day)
        left join public.resume_events e
          on (timezone('utc', e.created_at))::date = gs.day::date
        group by gs.day
      ) d
    ), '[]'::json),
    'users', coalesce((
      select json_agg(row_to_json(u) order by u.created_at desc)
      from (
        select
          p.id,
          au.email,
          p.full_name,
          p.created_at,
          coalesce(au.raw_app_meta_data ->> 'role', '') = 'superadmin' as is_superadmin,
          coalesce(r.resume_count, 0)::int as resume_count,
          coalesce(ev.download_count, 0)::int as download_count,
          coalesce(ev.email_send_count, 0)::int as email_send_count,
          coalesce(ev.deleted_count, 0)::int as deleted_count,
          coalesce(ev.duplicated_count, 0)::int as duplicated_count,
          coalesce(ev.created_count, 0)::int as created_count
        from public.profiles p
        join auth.users au on au.id = p.id
        left join (
          select user_id, count(*)::int as resume_count
          from public.resumes
          group by user_id
        ) r on r.user_id = p.id
        left join (
          select
            user_id,
            count(*) filter (where event_type = 'downloaded')::int as download_count,
            count(*) filter (where event_type = 'emailed')::int as email_send_count,
            count(*) filter (where event_type = 'deleted')::int as deleted_count,
            count(*) filter (where event_type = 'duplicated')::int as duplicated_count,
            count(*) filter (where event_type = 'created')::int as created_count
          from public.resume_events
          group by user_id
        ) ev on ev.user_id = p.id
      ) u
    ), '[]'::json)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_dashboard() from public;
revoke all on function public.admin_dashboard() from anon;
grant execute on function public.admin_dashboard() to authenticated;
