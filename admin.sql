-- Seed admin accounts for Barbaza Cooperative
-- This matches the app_users schema and the current login flow.

insert into public.app_users (
  name,
  position,
  branch,
  email,
  password,
  status
) values
  (
    'Super Admin',
    'Super Admin',
    'All branches',
    'superadmin@barbazacoop.com',
    'super123',
    'active'
  ),
  (
    'Admin',
    'Admin',
    'All branches',
    'admin@barbazacoop.com',
    'admin123',
    'active'
  )
;
