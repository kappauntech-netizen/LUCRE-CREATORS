-- Lucre Creators · Platform Foundation
-- Multi-tenancy, missing domains, immutable audit and persistent rate limiting.

create type public.organization_type as enum ('LUCRE', 'BRAND');
create type public.organization_member_role as enum ('OWNER', 'ADMIN', 'MANAGER', 'ANALYST', 'FINANCE', 'MEMBER');
create type public.contract_status as enum ('DRAFT', 'SENT', 'ACCEPTED', 'SIGNED', 'VOID', 'EXPIRED');
create type public.contract_type as enum ('CREATOR_AGREEMENT', 'BRAND_AGREEMENT', 'CAMPAIGN_AGREEMENT', 'USAGE_RIGHTS');
create type public.community_post_status as enum ('DRAFT', 'PUBLISHED', 'HIDDEN', 'REMOVED');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  type public.organization_type not null,
  name text not null,
  slug text not null unique,
  legal_name text,
  document text,
  status public.account_status not null default 'PENDING',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  member_role public.organization_member_role not null default 'MEMBER',
  status public.account_status not null default 'PENDING',
  invited_by uuid references public.profiles(id),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

alter table public.profiles add column if not exists deleted_at timestamptz;
alter table public.creators add column if not exists deleted_at timestamptz;
alter table public.brands add column if not exists organization_id uuid references public.organizations(id);
alter table public.brands add column if not exists deleted_at timestamptz;
alter table public.brand_contacts add column if not exists organization_id uuid references public.organizations(id);
alter table public.campaigns add column if not exists organization_id uuid references public.organizations(id);
alter table public.campaigns add column if not exists product text;
alter table public.campaigns add column if not exists exclusivity text;
alter table public.campaigns add column if not exists deleted_at timestamptz;

-- Upgrade safely if 0001 already has brand records.
insert into public.organizations (id, type, name, slug, legal_name, document, status)
select b.id, 'BRAND', b.name,
       lower(regexp_replace(b.name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(b.id::text, 1, 8),
       b.legal_name, b.document, b.status
from public.brands b
where b.organization_id is null
on conflict (id) do nothing;

update public.brands set organization_id = id where organization_id is null;
update public.brand_contacts bc set organization_id = b.organization_id
from public.brands b where bc.brand_id = b.id and bc.organization_id is null;
update public.campaigns c set organization_id = b.organization_id
from public.brands b where c.brand_id = b.id and c.organization_id is null;

alter table public.brands alter column organization_id set not null;
alter table public.brand_contacts alter column organization_id set not null;
alter table public.campaigns alter column organization_id set not null;

alter table public.payments add column if not exists organization_id uuid references public.organizations(id);
alter table public.payments add column if not exists campaign_id uuid references public.campaigns(id);
alter table public.payments add column if not exists deliverable_id uuid references public.campaign_deliverables(id);
alter table public.payments add column if not exists payment_type text not null default 'CREATOR_PAYMENT'
  check (payment_type in ('CREATOR_PAYMENT','BRAND_PAYMENT','PLATFORM_FEE','CAMPAIGN_FEE','PERFORMANCE_BONUS','REFERRAL_REWARD'));

update public.payments p set campaign_id = a.campaign_id,
  organization_id = c.organization_id
from public.campaign_assignments a
join public.campaigns c on c.id = a.campaign_id
where p.assignment_id = a.id and p.organization_id is null;

alter table public.analytics_events add column if not exists organization_id uuid references public.organizations(id);
alter table public.analytics_events add column if not exists campaign_id uuid references public.campaigns(id);
alter table public.analytics_events add column if not exists creator_id uuid references public.creators(id);
alter table public.audit_logs add column if not exists organization_id uuid references public.organizations(id);
alter table public.audit_logs add column if not exists request_id text;
alter table public.audit_logs add column if not exists ip_hash text;

create table public.creator_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.creator_category_assignments (
  creator_id uuid not null references public.creators(id) on delete cascade,
  category_id uuid not null references public.creator_categories(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (creator_id, category_id)
);

create table public.social_oauth_connections (
  id uuid primary key default gen_random_uuid(),
  creator_social_account_id uuid not null references public.creator_social_accounts(id) on delete cascade,
  provider text not null check (provider in ('INSTAGRAM','TIKTOK','YOUTUBE')),
  provider_account_id text not null,
  encrypted_token_reference text not null,
  scopes text[] not null default '{}',
  expires_at timestamptz,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','EXPIRED','REVOKED','ERROR')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create table public.matching_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version integer not null,
  weights jsonb not null,
  thresholds jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table public.matching_runs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  rule_id uuid not null references public.matching_rules(id),
  status text not null default 'RUNNING' check (status in ('RUNNING','COMPLETED','FAILED')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text
);

create table public.matching_results (
  id uuid primary key default gen_random_uuid(),
  matching_run_id uuid not null references public.matching_runs(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  match_score numeric(5,2) not null check (match_score between 0 and 100),
  factors jsonb not null,
  rank integer not null,
  decision text not null default 'PENDING' check (decision in ('PENDING','APPROVED','REJECTED','OVERRIDDEN')),
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (matching_run_id, creator_id)
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  campaign_id uuid references public.campaigns(id),
  creator_id uuid references public.creators(id),
  type public.contract_type not null,
  status public.contract_status not null default 'DRAFT',
  version integer not null default 1,
  document_path text,
  document_hash text,
  created_by uuid not null references public.profiles(id),
  accepted_at timestamptz,
  signed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (organization_id is not null or creator_id is not null)
);

create table public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete cascade,
  event_type text not null check (event_type in ('REFERRED','APPLICATION_SUBMITTED','APPROVED','ACTIVATED','CAMPAIGN_COMPLETED','REVENUE_GENERATED','REWARDED','FRAUD_FLAGGED')),
  amount numeric(12,2),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('GROWTH','CONTENT','TIKTOK','INSTAGRAM','LIVE_COMMERCE','BUSINESS','OPPORTUNITIES')),
  title text,
  body text not null,
  status public.community_post_status not null default 'PUBLISHED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

create table public.academy_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_path text,
  status text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  position integer not null default 0,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academy_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.academy_courses(id) on delete cascade,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  video_path text,
  position integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academy_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.academy_courses(id) on delete cascade,
  lesson_id uuid references public.academy_lessons(id) on delete cascade,
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (profile_id, course_id, lesson_id)
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon_key text not null,
  criteria jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.creator_badges (
  creator_id uuid not null references public.creators(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_by uuid references public.profiles(id),
  awarded_at timestamptz not null default now(),
  primary key (creator_id, badge_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  campaign_id uuid references public.campaigns(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id),
  body text not null,
  attachment_path text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references public.profiles(id),
  organization_id uuid references public.organizations(id),
  bucket text not null,
  object_path text not null,
  media_type text not null,
  byte_size bigint,
  content_type text,
  checksum text,
  status text not null default 'UPLOADED' check (status in ('UPLOADING','UPLOADED','PROCESSING','READY','REJECTED','DELETED')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (bucket, object_path)
);

create table public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  provider text not null,
  endpoint_url text not null,
  secret_reference text not null,
  events text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid references public.webhook_endpoints(id),
  provider text not null,
  external_event_id text,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'RECEIVED' check (status in ('RECEIVED','PROCESSING','PROCESSED','FAILED','IGNORED')),
  attempts integer not null default 0,
  next_attempt_at timestamptz,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, external_event_id)
);

create table public.rate_limits (
  key text not null,
  scope text not null,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (key, scope)
);

create index organization_memberships_profile_idx on public.organization_memberships(profile_id, status);
create index brands_organization_idx on public.brands(organization_id) where deleted_at is null;
create index campaigns_organization_status_idx on public.campaigns(organization_id, status) where deleted_at is null;
create index contracts_organization_status_idx on public.contracts(organization_id, status) where deleted_at is null;
create index matching_results_run_rank_idx on public.matching_results(matching_run_id, rank);
create index community_posts_status_created_idx on public.community_posts(status, created_at desc) where deleted_at is null;
create index messages_conversation_created_idx on public.messages(conversation_id, created_at desc) where deleted_at is null;
create index webhook_events_status_retry_idx on public.webhook_events(status, next_attempt_at);
create index rate_limits_updated_idx on public.rate_limits(updated_at);

create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger organization_memberships_set_updated_at before update on public.organization_memberships for each row execute function public.set_updated_at();
create trigger social_oauth_connections_set_updated_at before update on public.social_oauth_connections for each row execute function public.set_updated_at();
create trigger contracts_set_updated_at before update on public.contracts for each row execute function public.set_updated_at();
create trigger community_posts_set_updated_at before update on public.community_posts for each row execute function public.set_updated_at();
create trigger community_comments_set_updated_at before update on public.community_comments for each row execute function public.set_updated_at();
create trigger academy_courses_set_updated_at before update on public.academy_courses for each row execute function public.set_updated_at();
create trigger academy_lessons_set_updated_at before update on public.academy_lessons for each row execute function public.set_updated_at();
create trigger academy_progress_set_updated_at before update on public.academy_progress for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations for each row execute function public.set_updated_at();
create trigger webhook_endpoints_set_updated_at before update on public.webhook_endpoints for each row execute function public.set_updated_at();

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    public.is_lucre_team() or exists (
      select 1 from public.organization_memberships om
      where om.organization_id = target_organization_id
        and om.profile_id = auth.uid()
        and om.status = 'ACTIVE'
    ), false
  );
$$;

create or replace function public.is_organization_manager(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    public.is_lucre_team() or exists (
      select 1 from public.organization_memberships om
      where om.organization_id = target_organization_id
        and om.profile_id = auth.uid()
        and om.status = 'ACTIVE'
        and om.member_role in ('OWNER','ADMIN','MANAGER')
    ), false
  );
$$;

create or replace function public.is_conversation_participant(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    public.is_lucre_team() or exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = target_conversation_id and cp.profile_id = auth.uid()
    ), false
  );
$$;

create or replace function public.consume_rate_limit(
  p_key text, p_scope text, p_limit integer, p_window_seconds integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql security definer set search_path = public as $$
declare
  current_count integer;
  current_window timestamptz;
  window_interval interval := make_interval(secs => p_window_seconds);
begin
  insert into public.rate_limits as rl (key, scope, attempt_count, window_started_at, updated_at)
  values (p_key, p_scope, 1, now(), now())
  on conflict (key, scope) do update set
    attempt_count = case
      when rl.window_started_at + window_interval <= now() then 1
      else rl.attempt_count + 1
    end,
    window_started_at = case
      when rl.window_started_at + window_interval <= now() then now()
      else rl.window_started_at
    end,
    updated_at = now()
  returning attempt_count, window_started_at into current_count, current_window;

  allowed := current_count <= p_limit;
  retry_after := greatest(1, ceil(extract(epoch from (current_window + window_interval - now())))::integer);
  return next;
end;
$$;

revoke all on function public.consume_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;

create or replace function public.prevent_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit logs are immutable';
end;
$$;

create trigger audit_logs_immutable before update or delete on public.audit_logs
for each row execute function public.prevent_audit_mutation();

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.brands enable row level security;
alter table public.brand_contacts enable row level security;
alter table public.contracts enable row level security;
alter table public.matching_rules enable row level security;
alter table public.matching_runs enable row level security;
alter table public.matching_results enable row level security;
alter table public.referral_events enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
alter table public.academy_courses enable row level security;
alter table public.academy_lessons enable row level security;
alter table public.academy_progress enable row level security;
alter table public.badges enable row level security;
alter table public.creator_badges enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists published_campaigns_select on public.campaigns;
create policy campaigns_select on public.campaigns for select using (
  (status = 'PUBLISHED' and deleted_at is null)
  or public.is_organization_member(organization_id)
  or public.is_lucre_team()
);
create policy campaigns_brand_insert on public.campaigns for insert with check (public.is_organization_manager(organization_id));
create policy campaigns_brand_update on public.campaigns for update using (public.is_organization_manager(organization_id));

create policy organizations_member_select on public.organizations for select using (public.is_organization_member(id) and deleted_at is null);
create policy organizations_manager_update on public.organizations for update using (public.is_organization_manager(id));
create policy memberships_member_select on public.organization_memberships for select using (
  profile_id = auth.uid() or public.is_organization_manager(organization_id)
);
create policy memberships_manager_write on public.organization_memberships for all using (public.is_organization_manager(organization_id));
create policy brands_tenant_select on public.brands for select using (public.is_organization_member(organization_id) and deleted_at is null);
create policy brands_tenant_update on public.brands for update using (public.is_organization_manager(organization_id));
create policy brand_contacts_tenant on public.brand_contacts for select using (public.is_organization_member(organization_id));

create policy contracts_participant_select on public.contracts for select using (
  public.is_organization_member(organization_id)
  or exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid())
  or public.is_lucre_team()
);

drop policy if exists own_payments_select on public.payments;
create policy payments_participant_select on public.payments for select using (
  exists (select 1 from public.creators c where c.id = creator_id and c.profile_id = auth.uid())
  or public.is_organization_member(organization_id)
  or public.is_lucre_team()
);

create policy community_posts_read on public.community_posts for select using (status = 'PUBLISHED' and deleted_at is null);
create policy community_posts_create on public.community_posts for insert with check (author_profile_id = auth.uid());
create policy community_posts_owner_update on public.community_posts for update using (author_profile_id = auth.uid() or public.is_lucre_team());
create policy community_comments_read on public.community_comments for select using (deleted_at is null);
create policy community_comments_create on public.community_comments for insert with check (author_profile_id = auth.uid());
create policy community_comments_owner_update on public.community_comments for update using (author_profile_id = auth.uid() or public.is_lucre_team());
create policy community_likes_own on public.community_likes for all using (profile_id = auth.uid());

create policy academy_courses_read on public.academy_courses for select using (status = 'PUBLISHED' or public.is_lucre_team());
create policy academy_lessons_read on public.academy_lessons for select using (published or public.is_lucre_team());
create policy academy_progress_own on public.academy_progress for all using (profile_id = auth.uid() or public.is_lucre_team());
create policy badges_read on public.badges for select using (active or public.is_lucre_team());
create policy creator_badges_read on public.creator_badges for select using (true);

create policy conversations_participant_select on public.conversations for select using (
  public.is_conversation_participant(id)
);
create policy conversation_participants_own_select on public.conversation_participants for select using (
  profile_id = auth.uid()
  or public.is_conversation_participant(conversation_id)
);
create policy messages_participant_select on public.messages for select using (
  public.is_conversation_participant(conversation_id)
);
create policy messages_participant_insert on public.messages for insert with check (
  sender_profile_id = auth.uid()
  and public.is_conversation_participant(conversation_id)
);

create policy media_assets_owner_select on public.media_assets for select using (
  owner_profile_id = auth.uid() or public.is_organization_member(organization_id) or public.is_lucre_team()
);
create policy audit_team_select on public.audit_logs for select using (public.is_lucre_team());

-- Matching, referral events and administrative writes remain service-side only.
-- With RLS enabled and no client write policy, access is denied by default.
