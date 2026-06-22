/**
 * Database row types for the single-company Agency OS schema.
 *
 * These mirror `supabase/migrations/20260622000000_initial_agency_os.sql`.
 * They describe rows exactly as Postgres returns them (snake_case columns).
 * UI-facing view models live in the feature layer; see `src/lib/db/agency.ts`
 * for the mappers that translate these rows into those shapes.
 */

export type AgencyRole =
  | 'admin'
  | 'account_manager'
  | 'creative'
  | 'reviewer'
  | 'client';

export type CampaignStatus = 'active' | 'paused' | 'completed';

export type AssetType = 'image' | 'video' | 'copy' | 'motion';

export type AssetStatus =
  | 'brief_received'
  | 'generating'
  | 'internal_review'
  | 'revision_required'
  | 'client_review'
  | 'approved'
  | 'published';

export type FeedbackPriority = 'critical' | 'required' | 'suggested';

export type FeedbackIssueType =
  | 'objective_error'
  | 'compliance_issue'
  | 'brand_issue'
  | 'conversion_issue'
  | 'design_improvement'
  | 'new_requirement'
  | 'question';

export type ApprovalDecision =
  | 'approved'
  | 'minor_edits'
  | 'changes_required'
  | 'rejected';

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: AgencyRole;
  created_at: string;
  updated_at: string;
}

export interface ClientContact {
  name: string;
  role: string;
  email: string;
}

export interface ClientRow {
  id: string;
  name: string;
  industry: string | null;
  brand_color: string | null;
  contacts: ClientContact[];
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  client_id: string;
  name: string;
  status: CampaignStatus;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetRow {
  id: string;
  client_id: string;
  campaign_id: string;
  designer_id: string | null;
  name: string;
  type: AssetType;
  status: AssetStatus;
  priority: string;
  current_version: number;
  due_date: string | null;
  description: string | null;
  preview_url: string | null;
  revision_count: number;
  created_at: string;
  updated_at: string;
}

export interface AssetVersionRow {
  id: string;
  asset_id: string;
  version_number: number;
  storage_path: string | null;
  preview_url: string | null;
  notes: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
}

export interface ReviewCycleRow {
  id: string;
  campaign_id: string;
  name: string;
  status: string;
  opened_by: string | null;
  due_at: string | null;
  closed_at: string | null;
  created_at: string;
}

export interface ReviewCycleAssetRow {
  id: string;
  review_cycle_id: string;
  asset_version_id: string;
}

export interface FeedbackItemRow {
  id: string;
  review_cycle_id: string;
  asset_version_id: string;
  author_id: string | null;
  issue_type: FeedbackIssueType;
  priority: FeedbackPriority;
  category: string | null;
  description: string;
  suggested_fix: string | null;
  pin_x: number | null;
  pin_y: number | null;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApprovalRow {
  id: string;
  asset_version_id: string;
  reviewer_id: string | null;
  decision: ApprovalDecision;
  notes: string | null;
  created_at: string;
}

export interface AiConsolidationRow {
  id: string;
  review_cycle_id: string;
  model: string;
  input: unknown;
  output: unknown;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface AiPromptGenerationRow {
  id: string;
  asset_version_id: string | null;
  consolidation_id: string | null;
  model: string;
  prompt: string;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface ActivityEventRow {
  id: string;
  actor_id: string | null;
  entity_type: string;
  entity_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandFont {
  name: string;
  weights: string[];
  usage: string;
  sample: string;
}

export interface BrandLogo {
  name: string;
  variant: string;
  bg: string;
}

export interface BrandVoice {
  principle: string;
  description: string;
}

export interface BrandKitRow {
  id: string;
  client_id: string;
  name: string;
  primary_colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  voice: BrandVoice[];
  guidelines: string[];
  guidelines_url: string | null;
  created_at: string;
  updated_at: string;
}
