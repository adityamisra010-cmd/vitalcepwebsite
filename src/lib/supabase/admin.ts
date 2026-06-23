import { createClient } from '@supabase/supabase-js';

import { requireEnv } from '@/lib/env';

/**
 * Server-only Supabase client using the service-role key. Bypasses RLS, so it
 * must never be imported into client components or exposed to the browser. Use
 * it only in trusted server contexts such as cron route handlers and webhooks.
 */
export function createSupabaseAdminClient() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
