-- Barbaza Cooperative Supabase migration
-- Safe to run on an existing database. It creates missing objects, adds missing columns,
-- and normalizes old statuses to the current system values.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('super_admin', 'administrator', 'branch_user');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.account_status as enum ('active', 'inactive', 'suspended');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.request_status as enum ('pending', 'activated', 'disconnected', 'subscribe');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.customer_status as enum ('pending', 'activated', 'disconnected', 'subscribe');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.lineman_status as enum ('active', 'assigned', 'on_leave', 'completed', 'unavailable');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.audit_action as enum ('login', 'create', 'update', 'delete', 'view', 'logout', 'approve', 'assign', 'remark');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  municipality text,
  province text not null default 'Antique',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  position text not null default 'Branch User',
  role public.app_role not null default 'branch_user',
  branch_id uuid references public.branches(id) on delete set null,
  email text unique,
  profile_photo_url text,
  status public.account_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null default 'Branch User',
  branch text not null default 'All branches',
  email text not null unique,
  password text not null,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('Bundle', 'Cable TV', 'TV Extension', 'Internet', 'Business')),
  monthly_price numeric(10,2) not null default 0 check (monthly_price >= 0),
  speed_mbps integer check (speed_mbps is null or speed_mbps >= 0),
  tv_channels_min integer check (tv_channels_min is null or tv_channels_min >= 0),
  tv_channels_max integer check (tv_channels_max is null or tv_channels_max >= 0),
  installation_fee numeric(10,2) not null default 0 check (installation_fee >= 0),
  membership_fee numeric(10,2) not null default 0 check (membership_fee >= 0),
  router_fee numeric(10,2) not null default 0 check (router_fee >= 0),
  lock_in_months integer not null default 12 check (lock_in_months > 0),
  description text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  box_number text not null unique,
  full_name text not null,
  barangay text not null,
  address text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  plan_id uuid references public.service_plans(id) on delete set null,
  status public.customer_status not null default 'pending',
  remarks text,
  remarks_status text not null default 'viewed' check (remarks_status in ('new', 'viewed', 'resolved')),
  remarks_recipient text,
  remarks_version integer not null default 0,
  remarks_updated_by text,
  remarks_updated_at timestamptz,
  history jsonb not null default '[]'::jsonb,
  latest_request_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activation_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  applicant_name text not null,
  barangay text not null,
  address text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  plan_id uuid references public.service_plans(id) on delete set null,
  status public.request_status not null default 'pending',
  remarks text,
  remarks_status text not null default 'viewed' check (remarks_status in ('new', 'viewed', 'resolved')),
  remarks_recipient text,
  remarks_version integer not null default 0,
  remarks_updated_by text,
  remarks_updated_at timestamptz,
  schedule_date date,
  submitted_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.customers
  add column if not exists box_number text,
  add column if not exists full_name text,
  add column if not exists barangay text,
  add column if not exists address text,
  add column if not exists branch_id uuid,
  add column if not exists plan_id uuid,
  add column if not exists status public.customer_status default 'pending',
  add column if not exists remarks text,
  add column if not exists remarks_status text default 'viewed',
  add column if not exists remarks_recipient text,
  add column if not exists remarks_version integer default 0,
  add column if not exists remarks_updated_by text,
  add column if not exists remarks_updated_at timestamptz,
  add column if not exists history jsonb default '[]'::jsonb,
  add column if not exists latest_request_id uuid,
  add column if not exists created_by uuid,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table if exists public.activation_requests
  add column if not exists request_number text,
  add column if not exists customer_id uuid,
  add column if not exists applicant_name text,
  add column if not exists barangay text,
  add column if not exists address text,
  add column if not exists branch_id uuid,
  add column if not exists plan_id uuid,
  add column if not exists status public.request_status default 'pending',
  add column if not exists remarks text,
  add column if not exists remarks_status text default 'viewed',
  add column if not exists remarks_recipient text,
  add column if not exists remarks_version integer default 0,
  add column if not exists remarks_updated_by text,
  add column if not exists remarks_updated_at timestamptz,
  add column if not exists schedule_date date,
  add column if not exists submitted_by uuid,
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz,
  add column if not exists history jsonb default '[]'::jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create table if not exists public.linemans (
  id uuid primary key default gen_random_uuid(),
  lineman_number text not null unique,
  full_name text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  status public.lineman_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.linemans
  add column if not exists lineman_number text,
  add column if not exists full_name text,
  add column if not exists branch_id uuid,
  add column if not exists status public.lineman_status default 'active',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create table if not exists public.lineman_assignments (
  id uuid primary key default gen_random_uuid(),
  lineman_id uuid not null references public.linemans(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  activation_request_id uuid references public.activation_requests(id) on delete set null,
  box_number text,
  plan_id uuid references public.service_plans(id) on delete set null,
  status public.lineman_status not null default 'assigned',
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text
);

alter table if exists public.lineman_assignments
  add column if not exists lineman_id uuid,
  add column if not exists customer_id uuid,
  add column if not exists activation_request_id uuid,
  add column if not exists box_number text,
  add column if not exists plan_id uuid,
  add column if not exists status public.lineman_status default 'assigned',
  add column if not exists assigned_by uuid,
  add column if not exists assigned_at timestamptz default now(),
  add column if not exists completed_at timestamptz,
  add column if not exists notes text;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table if exists public.notifications
  add column if not exists recipient_id uuid,
  add column if not exists actor_id uuid,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists title text,
  add column if not exists message text,
  add column if not exists is_read boolean default false,
  add column if not exists read_at timestamptz,
  add column if not exists created_at timestamptz default now();

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table if exists public.system_settings
  add column if not exists key text,
  add column if not exists value jsonb default '{}'::jsonb,
  add column if not exists updated_by uuid,
  add column if not exists updated_at timestamptz default now();

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_type text not null,
  entity_id uuid,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table if exists public.audit_logs
  add column if not exists actor_id uuid,
  add column if not exists action public.audit_action,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists description text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now();

create index if not exists branches_name_idx on public.branches(name);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_branch_idx on public.profiles(branch_id);
create index if not exists app_users_email_idx on public.app_users(email);
create index if not exists app_users_branch_idx on public.app_users(branch);
create index if not exists service_plans_category_idx on public.service_plans(category);
create index if not exists service_plans_available_idx on public.service_plans(is_available);
create index if not exists customers_branch_idx on public.customers(branch_id);
create index if not exists customers_status_idx on public.customers(status);
create index if not exists customers_plan_idx on public.customers(plan_id);
create index if not exists customers_latest_request_idx on public.customers(latest_request_id);
create index if not exists activation_requests_status_idx on public.activation_requests(status);
create index if not exists activation_requests_branch_idx on public.activation_requests(branch_id);
create index if not exists activation_requests_customer_idx on public.activation_requests(customer_id);
create index if not exists linemans_branch_idx on public.linemans(branch_id);
create index if not exists lineman_assignments_lineman_idx on public.lineman_assignments(lineman_id);
create index if not exists notifications_recipient_idx on public.notifications(recipient_id, is_read);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
      and status = 'active'
  );
$$;

create or replace function public.is_privileged_user()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin() or exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'administrator'
      and status = 'active'
  );
$$;

create or replace function public.current_user_branch_id()
returns uuid language sql stable security definer set search_path = public as $$
  select branch_id from public.profiles where id = auth.uid();
$$;

create or replace function public.can_access_branch(target_branch_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_privileged_user()
    or (
      public.current_user_branch_id() is not null
      and public.current_user_branch_id() = target_branch_id
    );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_role text := lower(coalesce(new.raw_user_meta_data->>'role', ''));
begin
  insert into public.profiles (id, full_name, email, role, position)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    case raw_role
      when 'super_admin' then 'super_admin'::public.app_role
      when 'super admin' then 'super_admin'::public.app_role
      when 'administrator' then 'administrator'::public.app_role
      when 'admin' then 'administrator'::public.app_role
      when 'branch_user' then 'branch_user'::public.app_role
      when 'branch user' then 'branch_user'::public.app_role
      else 'branch_user'::public.app_role
    end,
    coalesce(nullif(new.raw_user_meta_data->>'position', ''), 'Branch User')
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        role = excluded.role,
        position = excluded.position,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists service_plans_updated_at on public.service_plans;
create trigger service_plans_updated_at before update on public.service_plans for each row execute function public.set_updated_at();

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers for each row execute function public.set_updated_at();

drop trigger if exists activation_requests_updated_at on public.activation_requests;
create trigger activation_requests_updated_at before update on public.activation_requests for each row execute function public.set_updated_at();

drop trigger if exists linemans_updated_at on public.linemans;
create trigger linemans_updated_at before update on public.linemans for each row execute function public.set_updated_at();

drop trigger if exists system_settings_updated_at on public.system_settings;
create trigger system_settings_updated_at before update on public.system_settings for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.branches (name) values
  ('Barbaza'), ('Laua-an'), ('Bugasong'), ('Patnongon'), ('Belison'),
  ('Sibalom'), ('San Remigio'), ('San Jose'), ('Hamtic')
on conflict (name) do nothing;

insert into public.service_plans (
  name,
  category,
  monthly_price,
  speed_mbps,
  tv_channels_min,
  tv_channels_max,
  installation_fee,
  membership_fee,
  router_fee,
  lock_in_months,
  description
) values
  (
    'Fiber & Cable Bundle (Package 1) - ₱1,020/mo',
    'Bundle',
    1020,
    25,
    80,
    85,
    1000,
    70,
    1500,
    12,
    'Monthly bundle with unlimited internet up to 25 Mbps and about 80 to 85 digital or HD TV channels.'
  ),
  (
    'Fiber & Cable Business Plan - up to 40Mbps',
    'Business',
    0,
    40,
    80,
    85,
    1000,
    70,
    1500,
    12,
    'Higher speed business package with digital television channel lineups. Configure branch pricing as needed.'
  ),
  (
    'Cable TV Standard Package - ₱360.00/month',
    'Cable TV',
    360,
    null,
    85,
    85,
    1000,
    70,
    0,
    12,
    'Cable TV package with 85 digital television channels. Passbook fee and security deposit are charged separately.'
  ),
  (
    'Cable TV Deluxe Package - ₱430.00/month',
    'Cable TV',
    430,
    null,
    85,
    85,
    1000,
    70,
    0,
    12,
    'Deluxe HD cable package with 85 digital television channels. Passbook fee and security deposit are charged separately.'
  ),
  (
    'Cable TV Premium Package - ₱490.00/month',
    'Cable TV',
    490,
    null,
    85,
    85,
    1000,
    70,
    0,
    12,
    'Premium HD cable package with 85 digital television channels. Passbook fee and security deposit are charged separately.'
  ),
  (
    'TV Extension Standard Package - ₱100.00/month',
    'TV Extension',
    100,
    null,
    null,
    null,
    500,
    800,
    0,
    12,
    'TV extension standard package with activation fee and installation fee.'
  ),
  (
    'TV Extension Deluxe Package - ₱130.00/month',
    'TV Extension',
    130,
    null,
    null,
    null,
    500,
    800,
    0,
    12,
    'TV extension deluxe package with activation fee and installation fee.'
  ),
  (
    'TV Extension Premium Package - ₱150.00/month',
    'TV Extension',
    150,
    null,
    null,
    null,
    500,
    800,
    0,
    12,
    'TV extension premium package with activation fee and installation fee.'
  ),
  (
    'Internet 1mbps - ₱990.00/month',
    'Internet',
    990,
    1,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 2mbps - ₱1,550.00/month',
    'Internet',
    1550,
    2,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 3mbps - ₱2,550.00/month',
    'Internet',
    2550,
    3,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 4mbps - ₱3,500.00/month',
    'Internet',
    3500,
    4,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 5mbps - ₱4,450.00/month',
    'Internet',
    4450,
    5,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 2mbps commercial - ₱2,000.00/month',
    'Internet',
    2000,
    2,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Commercial internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  ),
  (
    'Internet 4mbps commercial - ₱4,000.00/month',
    'Internet',
    4000,
    4,
    null,
    null,
    1000,
    70,
    1500,
    12,
    'Commercial internet plan with router fee, one-year lock-in, and additional CATV security deposit options.'
  )
on conflict (name) do update
set
  category = excluded.category,
  monthly_price = excluded.monthly_price,
  speed_mbps = excluded.speed_mbps,
  tv_channels_min = excluded.tv_channels_min,
  tv_channels_max = excluded.tv_channels_max,
  installation_fee = excluded.installation_fee,
  membership_fee = excluded.membership_fee,
  router_fee = excluded.router_fee,
  lock_in_months = excluded.lock_in_months,
  description = excluded.description,
  is_available = true,
  updated_at = now();

insert into public.system_settings (key, value) values
  ('brand_name', '{"value":"Barbaza Cooperative"}'::jsonb),
  ('default_package', '{"value":"Fiber & Cable Bundle (Package 1) - ₱1,020/mo"}'::jsonb),
  ('lock_in_months', '{"value":12}'::jsonb)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

update public.activation_requests
set status = 'activated'
where status::text in ('approved', 'completed');

update public.activation_requests
set status = 'subscribe'
where status::text in ('scheduled', 'on_hold');

update public.activation_requests
set status = 'disconnected'
where status::text = 'rejected';

update public.customers
set status = 'activated'
where status::text in ('approved', 'completed');

update public.customers
set status = 'subscribe'
where status::text in ('subscribed', 'scheduled', 'on_hold');

update public.customers
set status = 'disconnected'
where status::text = 'rejected';

update public.customers
set barangay = nullif(btrim(barangay), '')
where barangay is not null;

update public.activation_requests
set barangay = nullif(btrim(barangay), '')
where barangay is not null;

update public.customers
set barangay = btrim(split_part(address, ',', 1))
where coalesce(btrim(barangay), '') = ''
  and coalesce(btrim(address), '') <> '';

update public.activation_requests
set barangay = btrim(split_part(address, ',', 1))
where coalesce(btrim(barangay), '') = ''
  and coalesce(btrim(address), '') <> '';

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.app_users enable row level security;
alter table public.service_plans enable row level security;
alter table public.customers enable row level security;
alter table public.activation_requests enable row level security;
alter table public.linemans enable row level security;
alter table public.lineman_assignments enable row level security;
alter table public.notifications enable row level security;
alter table public.system_settings enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "authenticated users can view branches" on public.branches;
drop policy if exists "privileged users manage branches" on public.branches;
drop policy if exists "anyone can view branches" on public.branches;
drop policy if exists "anyone can manage branches" on public.branches;
create policy "anyone can view branches" on public.branches for select to public using (true);
create policy "anyone can manage branches" on public.branches for all to public using (true) with check (true);

drop policy if exists "authenticated users can view plans" on public.service_plans;
drop policy if exists "privileged users manage plans" on public.service_plans;
drop policy if exists "anyone can view plans" on public.service_plans;
drop policy if exists "anyone can manage plans" on public.service_plans;
create policy "anyone can view plans" on public.service_plans for select to public using (true);
create policy "anyone can manage plans" on public.service_plans for all to public using (true) with check (true);

drop policy if exists "users can view own profile or privileged profiles" on public.profiles;
drop policy if exists "users can edit own profile" on public.profiles;
drop policy if exists "privileged users manage profiles" on public.profiles;
create policy "users can view own profile or privileged profiles" on public.profiles for select to authenticated using (id = auth.uid() or public.is_privileged_user());
create policy "users can edit own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "privileged users manage profiles" on public.profiles for all to authenticated using (public.is_privileged_user()) with check (public.is_privileged_user());

drop policy if exists "authenticated users manage app users" on public.app_users;
drop policy if exists "anyone can manage app users" on public.app_users;
create policy "anyone can manage app users" on public.app_users for all to public using (true) with check (true);

drop policy if exists "users can view customers in accessible branches" on public.customers;
drop policy if exists "users can create customers in accessible branches" on public.customers;
drop policy if exists "users can update customers in accessible branches" on public.customers;
drop policy if exists "privileged users delete customers" on public.customers;
drop policy if exists "anyone can view customers" on public.customers;
drop policy if exists "anyone can create customers" on public.customers;
drop policy if exists "anyone can update customers" on public.customers;
drop policy if exists "anyone can delete customers" on public.customers;
create policy "anyone can view customers" on public.customers for select to public using (true);
create policy "anyone can create customers" on public.customers for insert to public with check (true);
create policy "anyone can update customers" on public.customers for update to public using (true) with check (true);
create policy "anyone can delete customers" on public.customers for delete to public using (true);

drop policy if exists "users can view requests in accessible branches" on public.activation_requests;
drop policy if exists "users can create requests in accessible branches" on public.activation_requests;
drop policy if exists "users can update requests in accessible branches" on public.activation_requests;
drop policy if exists "privileged users delete requests" on public.activation_requests;
drop policy if exists "anyone can view requests" on public.activation_requests;
drop policy if exists "anyone can create requests" on public.activation_requests;
drop policy if exists "anyone can update requests" on public.activation_requests;
drop policy if exists "anyone can delete requests" on public.activation_requests;
create policy "anyone can view requests" on public.activation_requests for select to public using (true);
create policy "anyone can create requests" on public.activation_requests for insert to public with check (true);
create policy "anyone can update requests" on public.activation_requests for update to public using (true) with check (true);
create policy "anyone can delete requests" on public.activation_requests for delete to public using (true);

drop policy if exists "users can view linemans in accessible branches" on public.linemans;
drop policy if exists "privileged users manage linemans" on public.linemans;
drop policy if exists "anyone can manage linemans" on public.linemans;
create policy "anyone can manage linemans" on public.linemans for all to public using (true) with check (true);

drop policy if exists "users can view assignments in accessible branches" on public.lineman_assignments;
drop policy if exists "privileged users manage assignments" on public.lineman_assignments;
drop policy if exists "users can view assignments in accessible branches" on public.lineman_assignments;
drop policy if exists "privileged users manage assignments" on public.lineman_assignments;
create policy "users can view assignments in accessible branches" on public.lineman_assignments for select to authenticated using (
  public.is_privileged_user()
  or exists (
    select 1
    from public.linemans
    where linemans.id = lineman_assignments.lineman_id
      and public.can_access_branch(linemans.branch_id)
  )
);
create policy "privileged users manage assignments" on public.lineman_assignments for all to authenticated using (public.is_privileged_user()) with check (public.is_privileged_user());

drop policy if exists "users can view own notifications" on public.notifications;
drop policy if exists "authenticated users create notifications" on public.notifications;
drop policy if exists "users can update own notifications" on public.notifications;
drop policy if exists "privileged users delete notifications" on public.notifications;
create policy "users can view own notifications" on public.notifications for select to authenticated using (
  recipient_id = auth.uid()
  or actor_id = auth.uid()
  or public.is_privileged_user()
);
create policy "authenticated users create notifications" on public.notifications for insert to authenticated with check (actor_id = auth.uid() or public.is_privileged_user());
create policy "users can update own notifications" on public.notifications for update to authenticated using (
  recipient_id = auth.uid() or public.is_privileged_user()
) with check (
  recipient_id = auth.uid() or public.is_privileged_user()
);
create policy "privileged users delete notifications" on public.notifications for delete to authenticated using (public.is_privileged_user());

drop policy if exists "privileged users manage system settings" on public.system_settings;
create policy "privileged users manage system settings" on public.system_settings for all to authenticated using (public.is_privileged_user()) with check (public.is_privileged_user());

drop policy if exists "privileged users view audit logs" on public.audit_logs;
drop policy if exists "authenticated users create audit logs" on public.audit_logs;
create policy "privileged users view audit logs" on public.audit_logs for select to authenticated using (public.is_privileged_user());
create policy "authenticated users create audit logs" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid() or public.is_privileged_user());

insert into public.app_users (
  name,
  position,
  branch,
  email,
  password,
  status
) values
  ('Super Admin', 'Super Admin', 'All branches', 'superadmin@barbazacoop.com', 'super123', 'active'),
  ('Admin', 'Admin', 'All branches', 'admin@barbazacoop.com', 'admin123', 'active')
on conflict (email) do update
set
  name = excluded.name,
  position = excluded.position,
  branch = excluded.branch,
  password = excluded.password,
  status = excluded.status,
  updated_at = now();

with seed_linemans(lineman_number, full_name, branch_name, status) as (
  values
    ('LM-001', 'Pedro Garcia', 'Barbaza', 'active'),
    ('LM-002', 'Laua-an Field Tech', 'Laua-an', 'active'),
    ('LM-003', 'Ramon Santos', 'Bugasong', 'unavailable'),
    ('LM-004', 'Leo Cruz', 'Patnongon', 'active'),
    ('LM-005', 'Nestor Cruz', 'Belison', 'active'),
    ('LM-006', 'Rico Santos', 'Sibalom', 'active'),
    ('LM-007', 'Joel Garcia', 'San Remigio', 'active'),
    ('LM-008', 'Carlo Reyes', 'San Jose', 'active'),
    ('LM-009', 'Ben Dela Cruz', 'Hamtic', 'active')
)
insert into public.linemans (lineman_number, full_name, branch_id, status)
select
  sl.lineman_number,
  sl.full_name,
  b.id,
  sl.status::public.lineman_status
from seed_linemans sl
join public.branches b on b.name = sl.branch_name
on conflict (lineman_number) do update
set
  full_name = excluded.full_name,
  branch_id = excluded.branch_id,
  status = excluded.status,
  updated_at = now();

with seed_customers(
  box_number,
  full_name,
  barangay,
  branch_name,
  plan_name,
  status,
  remarks,
  history
) as (
  values
    (
      '001',
      'Caleb Lovega',
      'Baghari',
      'Barbaza',
      'Fiber & Cable Bundle (Package 1) - â‚±1,020/mo',
      'pending',
      'Client suggested faster installation scheduling and a clearer update on approval.',
      jsonb_build_array(
        'Added by Branch User. Client suggested faster installation scheduling and a clearer update on approval.'
      )
    ),
    (
      '002',
      'Jesally Tiad',
      'Bahuyan',
      'Barbaza',
      'Fiber & Cable Bundle (Package 1) - â‚±1,020/mo',
      'activated',
      'Client suggested a home bundle that matches basic streaming and work needs.',
      jsonb_build_array(
        'Added by Branch User. Client suggested a home bundle that matches basic streaming and work needs.',
        'Super Admin approved the request on 2026-07-30.'
      )
    ),
    (
      '003',
      'Behryl Jean',
      'Beri',
      'Barbaza',
      'Fiber & Cable Business Plan - up to 40Mbps',
      'activated',
      'Client suggested faster internet for household use and smoother streaming.',
      jsonb_build_array(
        'Added by Juan Dela Cruz (Admin). Client suggested faster internet for household use and smoother streaming.',
        'Juan Dela Cruz approved the request on 2026-07-30.',
        'Juan Dela Cruz scheduled the request on 2026-07-30.',
        'Juan Dela Cruz confirmed the request as approved on 2026-07-30.'
      )
    )
)
insert into public.customers (
  box_number,
  full_name,
  barangay,
  address,
  branch_id,
  plan_id,
  status,
  remarks,
  remarks_version,
  history
)
select
  sc.box_number,
  sc.full_name,
  sc.barangay,
  sc.barangay || ', Barbaza, Antique',
  b.id,
  p.id,
  sc.status::public.customer_status,
  sc.remarks,
  0,
  sc.history
from seed_customers sc
join public.branches b on b.name = sc.branch_name
left join public.service_plans p on p.name = sc.plan_name
on conflict (box_number) do update
set
  full_name = excluded.full_name,
  barangay = excluded.barangay,
  address = excluded.address,
  branch_id = excluded.branch_id,
  plan_id = excluded.plan_id,
  status = excluded.status,
  remarks = excluded.remarks,
  remarks_version = excluded.remarks_version,
  history = excluded.history,
  updated_at = now();

with seed_requests(
  request_number,
  box_number,
  applicant_name,
  barangay,
  branch_name,
  plan_name,
  status,
  remarks,
  history,
  schedule_date
) as (
  values
    (
      'ACT-001',
      '001',
      'Caleb Lovega',
      'Baghari',
      'Barbaza',
      'Fiber & Cable Bundle (Package 1) - â‚±1,020/mo',
      'pending',
      'Client suggested faster installation scheduling and a clearer update on approval.',
      jsonb_build_array(
        'Added by Branch User. Client suggested faster installation scheduling and a clearer update on approval.'
      ),
      null
    ),
    (
      'ACT-002',
      '002',
      'Jesally Tiad',
      'Bahuyan',
      'Barbaza',
      'Fiber & Cable Bundle (Package 1) - â‚±1,020/mo',
      'activated',
      'Client suggested a home bundle that matches basic streaming and work needs.',
      jsonb_build_array(
        'Added by Branch User. Client suggested a home bundle that matches basic streaming and work needs.',
        'Super Admin approved the request on 2026-07-30.'
      ),
      '2026-07-30'
    ),
    (
      'ACT-003',
      '003',
      'Behryl Jean',
      'Beri',
      'Barbaza',
      'Fiber & Cable Business Plan - up to 40Mbps',
      'activated',
      'Client suggested faster internet for household use and smoother streaming.',
      jsonb_build_array(
        'Added by Juan Dela Cruz (Admin). Client suggested faster internet for household use and smoother streaming.',
        'Juan Dela Cruz approved the request on 2026-07-30.',
        'Juan Dela Cruz scheduled the request on 2026-07-30.',
        'Juan Dela Cruz confirmed the request as approved on 2026-07-30.'
      ),
      '2026-07-30'
    )
)
insert into public.activation_requests (
  request_number,
  customer_id,
  applicant_name,
  barangay,
  address,
  branch_id,
  plan_id,
  status,
  remarks,
  remarks_version,
  schedule_date,
  history
)
select
  sr.request_number,
  c.id,
  sr.applicant_name,
  'Baghari',
  'Baghari, ' || sr.branch_name || ', Antique',
  b.id,
  p.id,
  sr.status::public.request_status,
  sr.remarks,
  0,
  sr.schedule_date::date,
  sr.history
from seed_requests sr
join public.customers c on c.box_number = sr.box_number
join public.branches b on b.name = sr.branch_name
left join public.service_plans p on p.name = sr.plan_name
on conflict (request_number) do update
set
  customer_id = excluded.customer_id,
  applicant_name = excluded.applicant_name,
  barangay = excluded.barangay,
  address = excluded.address,
  branch_id = excluded.branch_id,
  plan_id = excluded.plan_id,
  status = excluded.status,
  remarks = excluded.remarks,
  remarks_version = excluded.remarks_version,
  schedule_date = excluded.schedule_date,
  history = excluded.history,
  updated_at = now();

update public.customers c
set latest_request_id = r.id
from public.activation_requests r
where r.customer_id = c.id;
