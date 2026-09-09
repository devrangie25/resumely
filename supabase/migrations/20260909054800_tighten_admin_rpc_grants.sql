revoke all on function public.admin_dashboard() from public;
revoke all on function public.admin_dashboard() from anon;
grant execute on function public.admin_dashboard() to authenticated;

create index if not exists resume_events_resume_id_idx
  on public.resume_events (resume_id);
