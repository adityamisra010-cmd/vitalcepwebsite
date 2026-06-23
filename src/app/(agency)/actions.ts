'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentProfile } from '@/lib/auth';
import {
  createApproval,
  createAsset,
  createCampaign,
  createClient,
  createFeedbackItem,
  logActivity,
  upsertBrandKit,
} from '@/lib/db/agency';
import type { AssetRow } from '@/types/database';

type ActionResult = { ok: boolean; error?: string; id?: string };

async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Not authenticated');
  return profile;
}

export async function createClientAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await requireProfile();
    const name = String(formData.get('name') ?? '').trim();
    if (!name) return { ok: false, error: 'Name is required' };

    const client = await createClient({
      name,
      industry: String(formData.get('industry') ?? '') || null,
      brand_color: String(formData.get('brand_color') ?? '') || null,
    });

    await logActivity({
      actor_id: profile.id,
      entity_type: 'client',
      entity_id: client.id,
      event_type: 'client_created',
      metadata: { description: `created client ${name}`, actor: profile.full_name },
    }).catch(() => {});

    revalidatePath('/clients');
    return { ok: true, id: client.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function createCampaignAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await requireProfile();
    const name = String(formData.get('name') ?? '').trim();
    const clientId = String(formData.get('client_id') ?? '');
    if (!name || !clientId) return { ok: false, error: 'Name and client are required' };

    const campaign = await createCampaign({
      name,
      client_id: clientId,
      description: String(formData.get('description') ?? '') || null,
    });

    await logActivity({
      actor_id: profile.id,
      entity_type: 'campaign',
      entity_id: campaign.id,
      event_type: 'campaign_created',
      metadata: { description: `created campaign ${name}`, actor: profile.full_name },
    }).catch(() => {});

    revalidatePath('/campaigns');
    return { ok: true, id: campaign.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function createAssetAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await requireProfile();
    const name = String(formData.get('name') ?? '').trim();
    const clientId = String(formData.get('client_id') ?? '');
    const campaignId = String(formData.get('campaign_id') ?? '');
    const type = String(formData.get('type') ?? 'image') as AssetRow['type'];
    if (!name || !clientId || !campaignId)
      return { ok: false, error: 'Name, client and campaign are required' };

    const asset = await createAsset({
      name,
      client_id: clientId,
      campaign_id: campaignId,
      type,
      description: String(formData.get('description') ?? '') || null,
      designer_id: profile.id,
    });

    await logActivity({
      actor_id: profile.id,
      entity_type: 'asset',
      entity_id: asset.id,
      event_type: 'brief_created',
      metadata: {
        description: `created asset ${name}`,
        actor: profile.full_name,
        assetId: asset.id,
        assetName: name,
      },
    }).catch(() => {});

    revalidatePath('/assets');
    return { ok: true, id: asset.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function submitFeedbackAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await requireProfile();
    const reviewCycleId = String(formData.get('review_cycle_id') ?? '');
    const assetVersionId = String(formData.get('asset_version_id') ?? '');
    const description = String(formData.get('description') ?? '').trim();
    if (!reviewCycleId || !assetVersionId || !description)
      return { ok: false, error: 'Review cycle, version and description are required' };

    const item = await createFeedbackItem({
      review_cycle_id: reviewCycleId,
      asset_version_id: assetVersionId,
      author_id: profile.id,
      issue_type: String(formData.get('issue_type') ?? 'design_improvement'),
      priority: String(formData.get('priority') ?? 'suggested'),
      category: String(formData.get('category') ?? '') || null,
      description,
      suggested_fix: String(formData.get('suggested_fix') ?? '') || null,
    });

    const assetId = String(formData.get('asset_id') ?? '');
    if (assetId) {
      await logActivity({
        actor_id: profile.id,
        entity_type: 'asset',
        entity_id: assetId,
        event_type: 'feedback_submitted',
        metadata: { description: 'submitted feedback', actor: profile.full_name, assetId },
      }).catch(() => {});
      revalidatePath(`/assets/${assetId}`);
    }

    return { ok: true, id: item.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function decideApprovalAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await requireProfile();
    const assetVersionId = String(formData.get('asset_version_id') ?? '');
    const decision = String(formData.get('decision') ?? '');
    if (!assetVersionId || !decision)
      return { ok: false, error: 'Version and decision are required' };

    const approval = await createApproval({
      asset_version_id: assetVersionId,
      reviewer_id: profile.id,
      decision,
      notes: String(formData.get('notes') ?? '') || null,
    });

    const assetId = String(formData.get('asset_id') ?? '');
    if (assetId) {
      await logActivity({
        actor_id: profile.id,
        entity_type: 'asset',
        entity_id: assetId,
        event_type: decision === 'approved' ? 'asset_approved' : 'review_closed',
        metadata: { description: `recorded ${decision}`, actor: profile.full_name, assetId },
      }).catch(() => {});
      revalidatePath('/approvals');
      revalidatePath(`/assets/${assetId}`);
    }

    return { ok: true, id: approval.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function saveBrandKitAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireProfile();
    const clientId = String(formData.get('client_id') ?? '');
    const name = String(formData.get('name') ?? '').trim();
    if (!clientId || !name) return { ok: false, error: 'Client and name are required' };

    const parseJson = (key: string) => {
      const raw = String(formData.get(key) ?? '');
      if (!raw) return undefined;
      try {
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    };

    const kit = await upsertBrandKit({
      client_id: clientId,
      name,
      primary_colors: parseJson('primary_colors'),
      fonts: parseJson('fonts'),
      logos: parseJson('logos'),
      voice: parseJson('voice'),
      guidelines: parseJson('guidelines'),
    });

    revalidatePath('/brand-kits');
    return { ok: true, id: kit.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
}
