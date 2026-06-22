import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { generateCreativePrompt } from '@/lib/ai/prompt-generation';
import { generatePromptSchema } from '@/lib/ai/schemas';

export async function POST(request: Request) {
  try {
    const input = generatePromptSchema.parse(await request.json());
    const result = await generateCreativePrompt(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate prompt.' },
      { status: 500 },
    );
  }
}
