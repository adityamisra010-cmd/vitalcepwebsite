import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { generateCreativePrompt } from '@/lib/ai/prompt-generation';
import { generatePromptSchema } from '@/lib/ai/schemas';
import { savePromptGeneration } from '@/lib/db/agency';

export async function POST(request: Request) {
  try {
    const input = generatePromptSchema.parse(await request.json());
    const { model, prompt } = await generateCreativePrompt(input);

    // Persist the prompt when an asset version or consolidation is supplied.
    // Persistence failures must not drop the AI result.
    let promptId: string | null = null;
    if (input.assetVersionId || input.consolidationId) {
      try {
        const saved = await savePromptGeneration({
          asset_version_id: input.assetVersionId ?? null,
          consolidation_id: input.consolidationId ?? null,
          model,
          prompt,
          metadata: {
            assetId: input.assetId,
            assetName: input.assetName,
            campaignContext: input.campaignContext,
            constraints: input.constraints,
          },
        });
        promptId = saved.id;
      } catch {
        promptId = null;
      }
    }

    return NextResponse.json({ prompt, model, promptId });
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
