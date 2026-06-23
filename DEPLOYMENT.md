# Agency OS — Deployment Guide

A step-by-step guide to deploying this single-company internal app: **Next.js 15
+ Supabase (Postgres, Auth, Storage) + OpenAI**, hosted on **Vercel**.

Estimated time: ~30–45 minutes.

---

## 0. Prerequisites

- [Node.js](https://nodejs.org) 20+ and `pnpm` (`npm i -g pnpm`)
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Vercel](https://vercel.com) account
- An [OpenAI](https://platform.openai.com) API key (for feedback consolidation
  and prompt generation)
- The Supabase CLI: `npm i -g supabase`

---

## 1. Create the Supabase project

1. Go to https://supabase.com/dashboard → **New project**.
2. Pick a name, a strong **database password** (save it), and a region close to
   your team.
3. Wait for it to finish provisioning (~2 min).
4. In **Project Settings → API**, copy these — you'll need them shortly:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (secret — server only)

---

## 2. Apply the database schema

The schema lives in `supabase/migrations/`. There are two migrations:
`…_initial_agency_os.sql` (tables + RLS) and `…_auth_storage_automation.sql`
(profile trigger, storage bucket, notifications/audit, cron function).

**Option A — Supabase CLI (recommended)**

```bash
# from the project root
supabase login
supabase link --project-ref <your-project-ref>   # ref is in the dashboard URL
supabase db push                                  # applies both migrations
```

**Option B — SQL editor (manual)**

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the contents of `supabase/migrations/20260622000000_initial_agency_os.sql`,
   run it.
3. Paste `supabase/migrations/20260622000001_auth_storage_automation.sql`, run it.

**(Optional) Seed sample data** so the app isn't empty on first load:

```bash
psql "postgresql://postgres:<db-password>@db.<project-ref>.supabase.co:5432/postgres" \
  -f supabase/seed.sql
```

or paste `supabase/seed.sql` into the SQL Editor.

After this you should see the tables under **Database → Tables** and a private
**assets** bucket under **Storage**.

---

## 3. Configure Auth

1. **Authentication → Providers → Email**: keep **Email** enabled.
2. For an internal tool you can **disable "Confirm email"**
   (Authentication → Providers → Email → toggle off) so new accounts can sign in
   immediately. Leave it on if you prefer email verification.
3. **Authentication → URL Configuration**: set the **Site URL** to your eventual
   Vercel URL (you can update this after step 5), e.g.
   `https://your-app.vercel.app`.

> The first account that signs up automatically becomes **admin** (via the
> `handle_new_user` trigger). Everyone after that defaults to **creative**.
> Change roles later in **Database → Tables → profiles**.

---

## 4. Run it locally (verify before deploying)

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
OPENAI_API_KEY=<your openai key>
OPENAI_MODEL=gpt-4o-mini
CRON_SECRET=<any long random string>
```

Then:

```bash
pnpm dev
```

Open http://localhost:3000 → you'll be redirected to **/login**. Create an
account (this becomes admin), sign in, and confirm the dashboard loads. Try
**Clients → New** to confirm writes hit the database.

---

## 5. Deploy to Vercel

1. Push this branch to GitHub (already done if you're reading this in the repo).
2. In Vercel: **Add New → Project → Import** your GitHub repo.
3. Framework preset: **Next.js** (auto-detected). Root directory: repo root.
4. **Environment Variables** — add the same keys as `.env.local`, but set
   `NEXT_PUBLIC_APP_URL` to your Vercel URL:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key (mark as **Secret**) |
   | `OPENAI_API_KEY` | your OpenAI key (Secret) |
   | `OPENAI_MODEL` | `gpt-4o-mini` |
   | `CRON_SECRET` | the same random string |

5. Click **Deploy**.
6. After it deploys, copy the production URL and:
   - Update **Supabase → Authentication → URL Configuration → Site URL** to it.
   - Update the `NEXT_PUBLIC_APP_URL` env var in Vercel to match, then redeploy.

---

## 6. Verify the cron job

`vercel.json` registers an hourly cron hitting
`/api/cron/close-review-cycles`, which closes review cycles past their deadline.
Vercel automatically sends `Authorization: Bearer $CRON_SECRET`, which the route
checks.

- Confirm it under **Vercel → your project → Settings → Cron Jobs**.
- Test manually:
  ```bash
  curl -H "Authorization: Bearer <CRON_SECRET>" \
    https://your-app.vercel.app/api/cron/close-review-cycles
  # => {"closed": 0}
  ```

> Cron jobs require a Vercel **Pro** plan. On Hobby, either upgrade or trigger
> `close_due_review_cycles()` another way (e.g. Supabase `pg_cron`, or an
> external scheduler calling the endpoint).

---

## 7. Post-deploy checklist

- [ ] `/login` loads; you can create an account and sign in
- [ ] Dashboard, Clients, Campaigns, Assets, Approvals, Activity, Analytics,
      Brand Kits all render
- [ ] **Clients → New** creates a row that persists after refresh
- [ ] Set your account's `role` to `admin` in `profiles` if it isn't already
- [ ] Cron job is listed and returns `{"closed": …}`
- [ ] OpenAI key works: the AI routes return results (test from an asset's
      consolidation flow once review data exists)

---

## What's production-ready vs. still scaffolded

**Working end-to-end:** auth + per-user profiles, RLS, all list/overview pages
reading live data, Clients write flow, asset-detail loading real assets, AI
routes (consolidation + prompt generation) with optional persistence, signed
file-upload URLs, activity logging, and the review-cycle auto-close cron.

**Still mock / not yet wired (follow the existing patterns to finish):**

- Most "create/edit" buttons besides **New Client** are not wired yet — the
  server actions exist in `src/app/(agency)/actions.ts`; copy the
  `NewClientButton` pattern to wire New Asset, New Campaign, approvals, and
  feedback submission.
- Asset-detail **tabs** (versions, feedback, approvals) still read mock data;
  they'll show empty for real assets until wired to the DB.
- File **upload UI** — the signed-URL API exists; the front-end uploader does
  not. Flow: `POST /api/storage/upload-url` → PUT the file to `signedUrl` →
  record the returned `path` via `createAssetVersion`.
- Analytics **charts** use demo series (per-client breakdown is real).
- Real-time updates, email notifications, and the audit-log UI are not built
  (the `notifications` and `audit_log` tables exist).
- Designer/Client dashboards filter on demo ids; the **admin/founder** view
  shows real data.

None of these block deployment — the app runs and is usable today; they're the
roadmap for turning it into a full workflow tool.
