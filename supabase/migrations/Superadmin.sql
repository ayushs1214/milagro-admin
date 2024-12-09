-- Create initial superadmin user
do $$
declare
  superadmin_id uuid;
begin
  -- Create auth user if not exists
  insert into auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    instance_id
  )
  values (
    'ayushietetsec@gmail.com',
    crypt('Ayushsingh69@', gen_salt('bf')), -- Updated password with new secure value
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Super Admin"}',
    now(),
    now(),
    'authenticated',
    '00000000-0000-0000-0000-000000000000'
  )
  on conflict (email) do nothing
  returning id into superadmin_id;

  -- Get the user ID if insert didn't happen
  if superadmin_id is null then
    select id into superadmin_id from auth.users where email = 'ayushietetsec@gmail.com';
  end if;

  -- Create profile if not exists
  insert into public.profiles (
    id,
    email,
    name,
    role,
    status,
    permissions,
    created_at,
    updated_at
  )
  values (
    superadmin_id,
    'ayushietetsec@gmail.com',
    'Super Admin',
    'superadmin',
    'active',
    '["all"]',
    now(),
    now()
  )
  on conflict (id) do update
  set
    role = 'superadmin',
    status = 'active',
    permissions = '["all"]',
    updated_at = now();

  -- Log activity
  insert into public.user_activity_logs (
    user_id,
    action,
    details
  )
  values (
    superadmin_id,
    'admin_created',
    jsonb_build_object(
      'role', 'superadmin',
      'email', 'ayushietetsec@gmail.com'
    )
  );
end;
$$;