import OpenAI from 'openai';

import { getOptionalEnv, requireEnv } from '@/lib/env';
import type { ConsolidateFeedbackInput } from '@/lib/ai/schemas';

export async function consolidateFeedback(input: ConsolidateFeedbackInput) {
  const openai = new OpenAI({
    apiKey: requireEnv('OPENAI_API_KEY'),
  });

  const model = getOptionalEnv('OPENAI_MODEL', 'gpt-4o-mini');

  const response = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You consolidate agency creative feedback into concise JSON with themes, conflicts, required actions, suggested actions, and approval risks.',
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ],
  });

  const content = response.choices[0]?.message.content ?? '{}';

  return { model, output: JSON.parse(content) as unknown };
}
