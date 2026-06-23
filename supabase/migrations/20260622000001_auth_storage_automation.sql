-- Auth provisioning, storage, automation, and remaining tables for the
-- single-company Agency OS. Applied after the initial schema migration.

/* ───────────────────────────── Profiles ──────────────────────────────── */

-- Automatically create a profile row when a user signs up. Role and name are
-- read from the sign-up metadata; role defaults to 'creative'. The very first
-- user to sign up becomes 'admin'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_first boolean;
begin
  select count(*) = 0 into is_first from public.profiles;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case
      when is_first then 'admin'::public.agency_role
      else coalesce(
        (new.raw_user_meta_data->>'role')::public.agency_role,
        'creative'::public.agency_role
      )
    end
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- A read-only view that presents profiles as "designers" for workload UIs.
create or replace view public.designers as
  select id, full_name, email, role
  from public.profiles
  where role in ('creative', 'account_manager', 'admin');

/* ─────────────────────────── Notifications ───────────────────────────── */

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  entity_type text,
  entity_id uuid,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx
  on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users read their own notifications"
on public.notifications for select
to authenticated
using (user_id = auth.uid());

create policy "Users update their own notifications"
on public.notifications for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Members create notifications"
on public.notifications for insert
to authenticated
with check (true);

/* ───────────────────────────── Audit log ─────────────────────────────── */

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx
  on public.audit_log(created_at desc);

alter table public.audit_log enable row level security;

create policy "Members read audit log"
on public.audit_log for select
to authenticated
using (true);

create policy "Members append audit log"
on public.audit_log for insert
to authenticated
with check (true);

/* ─────────────────────────────── Storage ─────────────────────────────── */

-- Private bucket for asset versions, briefs, brand-kit files and AI outputs.
insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do nothing;

-- Any authenticated member can read/write objects in the assets bucket.
create policy "Members read asset objects"
on storage.objects for select
to authenticated
using (bucket_id = 'assets');

create policy "Members write asset objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'assets');

create policy "Members update asset objects"
on storage.objects for update
to authenticated
using (bucket_id = 'assets')
with check (bucket_id = 'assets');

create policy "Members delete asset objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'assets');

/* ──────────────────── Review-cycle auto-close support ─────────────────── */

-- Close any open review cycle whose deadline has passed. Invoked by a
-- scheduled job (Vercel Cron -> /api/cron/close-review-cycles).
create or replace function public.close_due_review_cycles()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  closed_count integer;
begin
  update public.review_cycles
  set status = 'closed', closed_at = now()
  where status = 'open'
    and due_at is not null
    and due_at < now();

  get diagnostics closed_count = row_count;
  return closed_count;
end;
$$;
