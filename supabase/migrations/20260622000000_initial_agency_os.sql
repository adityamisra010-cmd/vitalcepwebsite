create extension if not exists pgcrypto;

create type public.agency_role as enum (
  'admin',
  'account_manager',
  'creative',
  'reviewer',
  'client'
);

create type public.campaign_status as enum (
  'active',
  'paused',
  'completed'
);

create type public.asset_type as enum (
  'image',
  'video',
  'copy',
  'motion'
);

create type public.asset_status as enum (
  'brief_received',
  'generating',
  'internal_review',
  'revision_required',
  'client_review',
  'approved',
  'published'
);

create type public.feedback_priority as enum (
  'critical',
  'required',
  'suggested'
);

create type public.feedback_issue_type as enum (
  'objective_error',
  'compliance_issue',
  'brand_issue',
  'conversion_issue',
  'design_improvement',
  'new_requirement',
  'question'
);

create type public.approval_decision as enum (
  'approved',
  'minor_edits',
  'changes_required',
  'rejected'
);

-- Single-company internal deployment: no organizations / multi-tenant layer.
-- Every authenticated member of this agency can access all rows. Application
-- roles (agency_role) drive UI and permission behaviour, not data isolation.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.agency_role not null default 'creative',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  brand_color text,
  contacts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  status public.campaign_status not null default 'active',
  description text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  designer_id uuid references public.profiles(id) on delete set null,
  name text not null,
  type public.asset_type not null,
  status public.asset_status not null default 'brief_received',
  priority text not null default 'medium',
  current_version integer not null default 0,
  due_date date,
  description text,
  preview_url text,
  revision_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.asset_versions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  version_number integer not null,
  storage_path text,
  preview_url text,
  notes text,
  status text not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (asset_id, version_number)
);

create table public.review_cycles (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  status text not null default 'open',
  opened_by uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.review_cycle_assets (
  id uuid primary key default gen_random_uuid(),
  review_cycle_id uuid not null references public.review_cycles(id) on delete cascade,
  asset_version_id uuid not null references public.asset_versions(id) on delete cascade,
  unique (review_cycle_id, asset_version_id)
);

create table public.feedback_items (
  id uuid primary key default gen_random_uuid(),
  review_cycle_id uuid not null references public.review_cycles(id) on delete cascade,
  asset_version_id uuid not null references public.asset_versions(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  issue_type public.feedback_issue_type not null,
  priority public.feedback_priority not null,
  category text,
  description text not null,
  suggested_fix text,
  pin_x numeric,
  pin_y numeric,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  asset_version_id uuid not null references public.asset_versions(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  decision public.approval_decision not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.ai_consolidations (
  id uuid primary key default gen_random_uuid(),
  review_cycle_id uuid not null references public.review_cycles(id) on delete cascade,
  model text not null,
  input jsonb not null,
  output jsonb not null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_prompt_generations (
  id uuid primary key default gen_random_uuid(),
  asset_version_id uuid references public.asset_versions(id) on delete cascade,
  consolidation_id uuid references public.ai_consolidations(id) on delete set null,
  model text not null,
  prompt text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  primary_colors jsonb not null default '[]'::jsonb, -- [{ name, hex, usage }]
  fonts jsonb not null default '[]'::jsonb,           -- [{ name, weights, usage, sample }]
  logos jsonb not null default '[]'::jsonb,           -- [{ name, variant, bg }]
  voice jsonb not null default '[]'::jsonb,           -- [{ principle, description }]
  guidelines jsonb not null default '[]'::jsonb,      -- string[]
  guidelines_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id) -- one brand kit per client
);

create index clients_name_idx on public.clients(name);
create index campaigns_client_id_idx on public.campaigns(client_id);
create index assets_campaign_id_idx on public.assets(campaign_id);
create index asset_versions_asset_id_idx on public.asset_versions(asset_id);
create index feedback_items_review_cycle_id_idx on public.feedback_items(review_cycle_id);
create index approvals_asset_version_id_idx on public.approvals(asset_version_id);
create index activity_events_created_at_idx on public.activity_events(created_at desc);

-- Row level security: gate on authentication only. There is a single agency,
-- so any signed-in member may read and write. Tighten per-role later if needed.

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.campaigns enable row level security;
alter table public.assets enable row level security;
alter table public.asset_versions enable row level security;
alter table public.review_cycles enable row level security;
alter table public.review_cycle_assets enable row level security;
alter table public.feedback_items enable row level security;
alter table public.approvals enable row level security;
alter table public.ai_consolidations enable row level security;
alter table public.ai_prompt_generations enable row level security;
alter table public.activity_events enable row level security;
alter table public.brand_kits enable row level security;

create policy "Members can read profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Members can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can manage clients"
on public.clients for all
to authenticated
using (true)
with check (true);

create policy "Members can manage campaigns"
on public.campaigns for all
to authenticated
using (true)
with check (true);

create policy "Members can manage assets"
on public.assets for all
to authenticated
using (true)
with check (true);

create policy "Members can manage asset versions"
on public.asset_versions for all
to authenticated
using (true)
with check (true);

create policy "Members can manage review cycles"
on public.review_cycles for all
to authenticated
using (true)
with check (true);

create policy "Members can manage review cycle assets"
on public.review_cycle_assets for all
to authenticated
using (true)
with check (true);

create policy "Members can manage feedback"
on public.feedback_items for all
to authenticated
using (true)
with check (true);

create policy "Members can manage approvals"
on public.approvals for all
to authenticated
using (true)
with check (true);

create policy "Members can manage AI consolidations"
on public.ai_consolidations for all
to authenticated
using (true)
with check (true);

create policy "Members can manage AI prompts"
on public.ai_prompt_generations for all
to authenticated
using (true)
with check (true);

create policy "Members can manage activity"
on public.activity_events for all
to authenticated
using (true)
with check (true);

create policy "Members can manage brand kits"
on public.brand_kits for all
to authenticated
using (true)
with check (true);
