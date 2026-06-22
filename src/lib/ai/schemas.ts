import { z } from 'zod';

export const feedbackItemSchema = z.object({
  id: z.string().optional(),
  issueType: z.string(),
  priority: z.string(),
  category: z.string(),
  description: z.string(),
  suggestedFix: z.string().optional(),
  author: z.string().optional(),
});

export const consolidateFeedbackSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  feedback: z.array(feedbackItemSchema).min(1),
  // When supplied, the consolidation result is persisted to ai_consolidations.
  reviewCycleId: z.string().uuid().optional(),
});

export const generatePromptSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  campaignContext: z.string(),
  approvedDirection: z.string(),
  constraints: z.array(z.string()).default([]),
  // When supplied, the generated prompt is persisted to ai_prompt_generations.
  assetVersionId: z.string().uuid().optional(),
  consolidationId: z.string().uuid().optional(),
});

export type ConsolidateFeedbackInput = z.infer<typeof consolidateFeedbackSchema>;
export type GeneratePromptInput = z.infer<typeof generatePromptSchema>;
