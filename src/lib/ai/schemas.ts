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
});

export const generatePromptSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  campaignContext: z.string(),
  approvedDirection: z.string(),
  constraints: z.array(z.string()).default([]),
});

export type ConsolidateFeedbackInput = z.infer<typeof consolidateFeedbackSchema>;
export type GeneratePromptInput = z.infer<typeof generatePromptSchema>;
