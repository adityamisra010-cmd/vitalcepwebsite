import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { consolidateFeedback } from '@/lib/ai/consolidation';
import { consolidateFeedbackSchema } from '@/lib/ai/schemas';

export async function POST(request: Request) {
  try {
    const input = consolidateFeedbackSchema.parse(await request.json());
    const result = await consolidateFeedback(input);

    return NextResponse.json({ result });
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
