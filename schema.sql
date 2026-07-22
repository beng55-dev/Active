-- Barbaza Cooperative: Supabase database schema
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('administrator', 'branch_user');
create type public.account_status as enum ('active', 'inactive', 'suspended');
create type public.request_status as enum ('pending', 'approved', 'rejected', 'on_hold', 'scheduled', 'completed');
create type public.customer_status as enum ('activated', 'subscribed', 'pending', 'disconnected');
create type public.lineman_status as enum ('active', 'on_leave', 'assigned', 'completed', 'unavailable');
create type public.audit_action as enum ('login', 'create', 'update', 'delete', 'view', 'logout');

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  municipality text,
  province text not null default 'Antique',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  position text not null default 'Branch User',
  role public.app_role not null default 'branch_user',
  branch_id uuid references public.branches(id) on delete set null,
  email text,
  profile_photo_url text,
  status public.account_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('Cable', 'Internet', 'Bundle')),
  price numeric(10,2) not null check (price >= 0),
  billing_period text not null default 'month',
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  box_number text not null unique,
  full_name text not null,
  address text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  plan_id uuid references public.service_plans(id) on delete set null,
  remarks public.customer_status not null default 'pending',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activation_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  applicant_name text not null,
  address text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  plan_id uuid references public.service_plans(id) on delete set null,
  status public.request_status not null default 'pending',
  remarks text,
  submitted_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.linemans (
  id uuid primary key default gen_random_uuid(),
  lineman_number text not null unique,
  full_name text not null,
  branch_id uuid not null references public.branches(id) on delete restrict,
  status public.lineman_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lineman_assignments (
  id uuid primary key default gen_random_uuid(),
  lineman_id uuid not null references public.linemans(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  box_number text,
  plan_id uuid references public.service_plans(id) on delete set null,
  status public.lineman_status not null default 'assigned',
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_type text not null,
  entity_id uuid,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index customers_branch_idx on public.customers(branch_id);
create index customers_status_idx on public.customers(remarks);
create index activation_requests_status_idx on public.activation_requests(status);
create index activation_requests_branch_idx on public.activation_requests(branch_id);
create index linemans_branch_idx on public.linemans(branch_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger activation_requests_updated_at before update on public.activation_requests for each row execute function public.set_updated_at();
create trigger linemans_updated_at before update on public.linemans for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.branches (name) values
  ('Barbaza'), ('Laua-an'), ('Bugasong'), ('Patnongon'), ('Belison'),
  ('Sibalom'), ('San Remigio'), ('San Jose'), ('Hamtic')
on conflict (name) do nothing;

insert into public.service_plans (name, category, price) values
  ('Cable Basic', 'Cable', 250), ('Cable Standard', 'Cable', 400),
  ('Cable Premium', 'Cable', 650), ('Fiber 50 Mbps', 'Internet', 999),
  ('Fiber 100 Mbps', 'Internet', 1499), ('Fiber 200 Mbps', 'Internet', 2199),
  ('Home Bundle Plus', 'Bundle', 1799)
on conflict (name) do nothing;

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.service_plans enable row level security;
alter table public.customers enable row level security;
alter table public.activation_requests enable row level security;
alter table public.linemans enable row level security;
alter table public.lineman_assignments enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator' and status = 'active');
$$;

create policy "authenticated users can view branches" on public.branches for select to authenticated using (true);
create policy "authenticated users can view plans" on public.service_plans for select to authenticated using (true);
create policy "admins manage branches" on public.branches for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage plans" on public.service_plans for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "users view profiles" on public.profiles for select to authenticated using (true);
create policy "users edit own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users view customers" on public.customers for select to authenticated using (true);
create policy "authenticated users create customers" on public.customers for insert to authenticated with check (created_by = auth.uid() or public.is_admin());
create policy "admins update customers" on public.customers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users view requests" on public.activation_requests for select to authenticated using (true);
create policy "authenticated users create requests" on public.activation_requests for insert to authenticated with check (submitted_by = auth.uid() or public.is_admin());
create policy "admins manage requests" on public.activation_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users view linemans" on public.linemans for select to authenticated using (true);
create policy "admins manage linemans" on public.linemans for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users view assignments" on public.lineman_assignments for select to authenticated using (true);
create policy "admins manage assignments" on public.lineman_assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins view audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "authenticated users create audit logs" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid() or public.is_admin());
