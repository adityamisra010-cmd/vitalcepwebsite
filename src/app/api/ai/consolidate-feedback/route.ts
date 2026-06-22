import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { consolidateFeedback } from '@/lib/ai/consolidation';
import { consolidateFeedbackSchema } from '@/lib/ai/schemas';
import { saveConsolidation } from '@/lib/db/agency';

export async function POST(request: Request) {
  try {
    const input = consolidateFeedbackSchema.parse(await request.json());
    const { model, output } = await consolidateFeedback(input);

    // Persist the consolidation when a review cycle is supplied. Persistence
    // failures (e.g. Supabase unconfigured) must not drop the AI result, so
    // they are swallowed and surfaced as a null id.
    let consolidationId: string | null = null;
    if (input.reviewCycleId) {
      try {
        const saved = await saveConsolidation({
          review_cycle_id: input.reviewCycleId,
          model,
          input,
          output,
        });
        consolidationId = saved.id;
      } catch {
        consolidationId = null;
      }
    }

    return NextResponse.json({ result: output, model, consolidationId });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to consolidate feedback.' },
      { status: 500 },
    );
  }
}
