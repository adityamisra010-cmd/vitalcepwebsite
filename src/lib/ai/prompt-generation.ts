import OpenAI from 'openai';

import { getOptionalEnv, requireEnv } from '@/lib/env';
import type { GeneratePromptInput } from '@/lib/ai/schemas';

export async function generateCreativePrompt(input: GeneratePromptInput) {
  const openai = new OpenAI({
    apiKey: requireEnv('OPENAI_API_KEY'),
  });

  const model = getOptionalEnv('OPENAI_MODEL', 'gpt-4o-mini');

  const response = await openai.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content:
          'You write production-ready creative generation prompts for an agency team. Be specific, structured, and implementation-oriented.',
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ],
  });

  return {
    model,
    prompt: response.choices[0]?.message.content ?? '',
  };
}
