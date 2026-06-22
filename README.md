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

The UI is integrated from the handoff and still reads mock data from `src/features/agency/data/mockData.ts`. Supabase and AI routes are wired as backend connection seams, ready for the next pass where mock reads/writes are replaced with database-backed operations.
