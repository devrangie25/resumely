alter table public.profiles
  add column if not exists email text;

comment on column public.profiles.email is 'Contact email shown on resumes (may differ from sign-in email)';
