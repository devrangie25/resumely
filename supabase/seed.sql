-- Local-only seed. The same users are also created on the linked cloud project.
-- Email:  dev@resumely.local
-- Password:  devpassword123
-- Superadmin:  devrangie25@gmail.com / Rsmly-Admin-2026!

do $$
declare
  uid uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
begin
  if exists (select 1 from auth.users where email = 'dev@resumely.local') then
    return;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_sso_user,
    is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    uid,
    'authenticated',
    'authenticated',
    'dev@resumely.local',
    extensions.crypt('devpassword123', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dev User"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  );

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    uid::text,
    uid,
    jsonb_build_object('sub', uid::text, 'email', 'dev@resumely.local', 'email_verified', true),
    'email',
    now(),
    now(),
    now()
  );
end $$;

do $$
declare
  admin_uid uuid := 'c1a7d4e2-5b80-4f1a-9c3e-2d8f0b6a17e4';
begin
  if exists (select 1 from auth.users where email = 'devrangie25@gmail.com') then
    update auth.users
    set
      raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"superadmin"}'::jsonb,
      encrypted_password = extensions.crypt('Rsmly-Admin-2026!', extensions.gen_salt('bf')),
      updated_at = now()
    where email = 'devrangie25@gmail.com';
    return;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_sso_user,
    is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    admin_uid,
    'authenticated',
    'authenticated',
    'devrangie25@gmail.com',
    extensions.crypt('Rsmly-Admin-2026!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"superadmin"}'::jsonb,
    '{"full_name":"Super Admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  );

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    admin_uid::text,
    admin_uid,
    jsonb_build_object('sub', admin_uid::text, 'email', 'devrangie25@gmail.com', 'email_verified', true),
    'email',
    now(),
    now(),
    now()
  );
end $$;
