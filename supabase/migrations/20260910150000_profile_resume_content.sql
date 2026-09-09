alter table public.profiles
  add column if not exists email text,
  add column if not exists resume_content jsonb not null default '{}'::jsonb;

comment on column public.profiles.email is 'Contact email shown on resumes (may differ from sign-in email)';
comment on column public.profiles.resume_content is 'Saved resume sections: summary, experience, education, skills, and more';
