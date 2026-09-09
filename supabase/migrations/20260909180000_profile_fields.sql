alter table public.profiles
  add column headline text,
  add column phone text,
  add column location text,
  add column website text,
  add column linkedin text,
  add column github text;

comment on column public.profiles.headline is 'Job title or professional headline';
comment on column public.profiles.phone is 'Contact phone number';
comment on column public.profiles.location is 'City, region, or country';
comment on column public.profiles.website is 'Personal website URL';
comment on column public.profiles.linkedin is 'LinkedIn profile URL';
comment on column public.profiles.github is 'GitHub profile URL';
