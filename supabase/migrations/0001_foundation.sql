-- Lucre Creators · Foundation V1
-- Execute no SQL Editor do Supabase ou via Supabase CLI.

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'CREATOR_MANAGER',
  'CAMPAIGN_MANAGER', 'FINANCE', 'MODERATOR', 'CREATOR', 'BRAND'
);

create type public.account_status as enum ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
create type public.application_status as enum ('SUBMITTED', 'IN_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED', 'INVITED');
create type public.campaign_status as enum ('DRAFT', 'PUBLISHED', 'MATCHING', 'ACTIVE', 'REVIEW', 'COMPLETED', 'ARCHIVED');
create type public.campaign_application_status as enum ('APPLIED', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'WITHDRAWN');
create type public.assignment_status as enum ('APPROVED', 'ACTIVE', 'CONTENT_REVIEW', 'COMPLETED', 'PAID', 'CANCELLED');
create type public.review_status as enum ('PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');
create type public.payment_status as enum ('PENDING', 'APPROVED', 'SCHEDULED', 'PAID', 'FAILED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_path text,
  role public.app_role not null default 'CREATOR',
  status public.account_status not null default 'PENDING',
  locale text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  location text not null,
  instagram_handle text,
  tiktok_handle text,
  primary_niche text not null,
  followers_range text not null,
  experience text not null,
  source text not null default 'public_website',
  status public.application_status not null default 'SUBMITTED',
  reviewer_id uuid references public.profiles(id),
  internal_notes text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique not null references public.profiles(id) on delete cascade,
  application_id uuid references public.creator_applications(id),
  bio text,
  location text,
  primary_niche text,
  categories text[] not null default '{}',
  languages text[] not null default '{pt-BR}',
  formats text[] not null default '{}',
  availability text,
  commercial_rate_min numeric(12,2),
  public_visible boolean not null default false,
  verified boolean not null default false,
  level text not null default 'RISING' check (level in ('RISING','VERIFIED','PRO','ELITE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creator_social_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  platform text not null check (platform in ('INSTAGRAM','TIKTOK','YOUTUBE','OTHER')),
  handle text not null,
  profile_url text,
  external_account_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (creator_id, platform, handle)
);

create table public.creator_metrics (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  platform text not null,
  followers bigint,
  engagement_rate numeric(8,4),
  avg_views bigint,
  conversion_rate numeric(8,4),
  captured_at timestamptz not null default now(),
  source text not null default 'MANUAL'
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  document text,
  website text,
  status public.account_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brand_contacts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  name text not null,
  email text not null,
  phone text,
  job_title text,
  created_at timestamptz not null default now()
);

create table public.brand_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  whatsapp text not null,
  objective text not null,
  budget_range text not null,
  brief text not null,
  source text not null default 'public_website',
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','QUALIFIED','CONVERTED','LOST')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id),
  name text not null,
  objective text not null,
  platform text not null,
  category text not null,
  brief text,
  budget numeric(14,2),
  fixed_compensation numeric(12,2),
  performance_percentage numeric(7,4),
  start_date date,
  end_date date,
  application_deadline timestamptz,
  usage_rights text,
  status public.campaign_status not null default 'DRAFT',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaign_requirements (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  requirement_type text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  pitch text,
  status public.campaign_application_status not null default 'APPLIED',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create table public.campaign_assignments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  status public.assignment_status not null default 'APPROVED',
  agreed_fixed_amount numeric(12,2),
  agreed_performance_percentage numeric(7,4),
  approved_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (campaign_id, creator_id)
);

create table public.campaign_deliverables (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.campaign_assignments(id) on delete cascade,
  platform text not null,
  format text not null,
  quantity integer not null default 1 check (quantity > 0),
  due_at timestamptz,
  status text not null default 'PENDING' check (status in ('PENDING','SUBMITTED','APPROVED','LATE','WAIVED')),
  created_at timestamptz not null default now()
);

create table public.content_submissions (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid not null references public.campaign_deliverables(id) on delete cascade,
  creator_id uuid not null references public.creators(id),
  asset_path text,
  external_url text,
  caption text,
  hashtags text[],
  publish_at timestamptz,
  review_status public.review_status not null default 'PENDING',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.content_submissions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  status public.review_status not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.campaign_assignments(id),
  creator_id uuid not null references public.creators(id),
  amount numeric(12,2) not null check (amount >= 0),
  due_date date,
  paid_at timestamptz,
  external_reference text,
  status public.payment_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_creator_id uuid not null references public.creators(id),
  referred_application_id uuid not null references public.creator_applications(id),
  referred_creator_id uuid references public.creators(id),
  status text not null default 'REFERRED' check (status in ('REFERRED','APPROVED','ACTIVATED','QUALIFIED','REWARDED','BLOCKED')),
  reward_amount numeric(12,2),
  created_at timestamptz not null default now(),
  unique (referrer_creator_id, referred_application_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.creator_scores (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  total_score numeric(5,2) not null check (total_score between 0 and 100),
  content_quality numeric(5,2),
  engagement numeric(5,2),
  reliability numeric(5,2),
  campaign_performance numeric(5,2),
  audience_fit numeric(5,2),
  calculation_version text not null,
  calculated_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  anonymous_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  source text,
  occurred_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index creator_applications_status_idx on public.creator_applications(status, created_at desc);
create index creator_metrics_creator_captured_idx on public.creator_metrics(creator_id, captured_at desc);
create index campaigns_status_dates_idx on public.campaigns(status, start_date, end_date);
create index campaign_applications_campaign_status_idx on public.campaign_applications(campaign_id, status);
create index payments_status_due_idx on public.payments(status, due_date);
create index notifications_profile_created_idx on public.notifications(profile_id, created_at desc);
create index analytics_events_name_occurred_idx on public.analytics_events(event_name, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','creator_applications','creators','brands','brand_leads','campaigns','campaign_applications','content_submissions','payments']
  loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name, role, status)
  values (new.id, null, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'CREATOR', 'PENDING')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_lucre_team()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() in ('SUPER_ADMIN','ADMIN','OPERATIONS','CREATOR_MANAGER','CAMPAIGN_MANAGER','FINANCE','MODERATOR'), false);
$$;

create or replace function public.prevent_profile_privilege_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_lucre_team() then
    if new.role is distinct from old.role or new.status is distinct from old.status then
      raise exception 'role and status can only be changed by Lucre operations';
    end if;
  end if;
  return new;
end;
$$;

create trigger protect_profile_privileges before update on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.creator_social_accounts enable row level security;
alter table public.creator_metrics enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_applications enable row level security;
alter table public.campaign_assignments enable row level security;
alter table public.campaign_deliverables enable row level security;
alter table public.content_submissions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

create policy profiles_self_select on public.profiles for select using (id = auth.uid() or public.is_lucre_team());
create policy profiles_self_update on public.profiles for update using (id = auth.uid() or public.is_lucre_team());
create policy creators_public_or_owner_select on public.creators for select using (
  public_visible or profile_id = auth.uid() or public.is_lucre_team()
);
create policy creators_owner_update on public.creators for update using (profile_id = auth.uid() or public.is_lucre_team());
create policy social_owner_select on public.creator_social_accounts for select using (
  exists (select 1 from public.creators c where c.id = creator_id and (c.profile_id = auth.uid() or c.public_visible)) or public.is_lucre_team()
);
create policy metrics_owner_select on public.creator_metrics for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy published_campaigns_select on public.campaigns for select using (status = 'PUBLISHED' or public.is_lucre_team());
create policy own_campaign_applications on public.campaign_applications for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy own_assignments_select on public.campaign_assignments for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy own_deliverables_select on public.campaign_deliverables for select using (
  exists (select 1 from public.campaign_assignments a join public.creators c on c.id = a.creator_id where a.id = assignment_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy own_submissions on public.content_submissions for all using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy own_payments_select on public.payments for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid()) or public.is_lucre_team()
);
create policy own_notifications on public.notifications for select using (profile_id = auth.uid() or public.is_lucre_team());
create policy own_notifications_update on public.notifications for update using (profile_id = auth.uid() or public.is_lucre_team());

-- Tabelas administrativas e formulários públicos não recebem policies para anon/authenticated.
-- Escritas públicas passam exclusivamente pelas rotas server-side com service role.
