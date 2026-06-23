import { NextResponse } from 'next/server';

import { getOptionalEnv } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Scheduled job: close any review cycle whose deadline has passed. Wire this to
 * Vercel Cron (see vercel.json). Protected by CRON_SECRET — Vercel sends it as
 * `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: Request) {
  const secret = getOptionalEnv('CRON_SECRET');
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.rpc('close_due_review_cycles');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ closed: data ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron failed' },
      { status: 500 },
    );
  }
}
