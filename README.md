# Agency OS

Internal agency operating system for managing clients, campaigns, assets, review cycles, structured feedback, approvals, AI feedback consolidation, and AI prompt generation.

This is a **single-company** deployment: there is no multi-tenant / organization layer. Every authenticated member belongs to the one agency. Row-level security gates access on authentication only, and application roles (`admin`, `account_manager`, `creative`, `reviewer`, `client`) drive UI and permission behaviour rather than data isolation.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui-ready project config
- Supabase
- OpenAI API
- Vercel-ready deployment shape

## Local Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The integrated app code lives in `src/features/agency` and is mounted through native Next routes under `src/app`.

## Routes

- `/`
- `/clients`
- `/campaigns`
- `/assets`
- `/assets/[id]`
- `/assets/[id]/review`
- `/assets/[id]/consolidation`
- `/assets/[id]/revision-package`
- `/assets/[id]/ai-prompt`
- `/approvals`
- `/brand-kits`
- `/analytics`
- `/activity`
- `/settings`

## Connection Points

- Supabase browser client: `src/lib/supabase/client.ts`
- Supabase server client: `src/lib/supabase/server.ts`
- Supabase auth middleware: `src/lib/supabase/middleware.ts`
- Database query helpers: `src/lib/db/agency.ts`
- Initial schema migration: `supabase/migrations/20260622000000_initial_agency_os.sql`
- AI feedback consolidation route: `src/app/api/ai/consolidate-feedback/route.ts`
- AI prompt generation route: `src/app/api/ai/generate-prompt/route.ts`

## Current State

Data flows from Supabase through a typed data-access layer (`src/lib/db/agency.ts`,
row types in `src/types/database.ts`) into the pages. The list/overview routes —
dashboard (`/`), clients, campaigns, assets, approvals, activity, analytics and
brand-kits — are server components that fetch real data and pass it to the
feature pages. Each page keeps its mock data as a fallback, so the app still
renders fully when Supabase is unconfigured or the tables are empty.

The AI routes (`/api/ai/consolidate-feedback`, `/api/ai/generate-prompt`)
persist their output to `ai_consolidations` / `ai_prompt_generations` when the
relevant ids (`reviewCycleId`, `assetVersionId`/`consolidationId`) are supplied;
persistence is best-effort and never blocks the AI response.

Run `supabase/seed.sql` after the migration to populate sample data.

Still on mock: the asset-detail routes (`/assets/[id]/*`), the Settings page,
the analytics time-series charts, and designer workload (no designers table yet).
They follow the same wiring pattern when ready.
