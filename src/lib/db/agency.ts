import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  AssetRow,
  BrandKitRow,
  CampaignRow,
  ClientRow,
} from '@/types/database';
import type {
  Asset,
  Campaign,
  Client,
} from '@/features/agency/data/mockData';

/* ────────────────────────────────────────────────────────────────────────
 * Raw reads
 * ──────────────────────────────────────────────────────────────────────── */

export async function listClients() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('clients').select('*').order('name');

  if (error) throw error;

  return (data ?? []) as ClientRow[];
}

export async function listCampaigns() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*, clients(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function listAssets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('assets')
    .select('*, clients(*), campaigns(*), asset_versions(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getAssetWithReviewContext(assetId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('assets')
    .select(
      '*, clients(*), campaigns(*), asset_versions(*), feedback_items(*), approvals(*)',
    )
    .eq('id', assetId)
    .single();

  if (error) throw error;

  return data;
}

/* ────────────────────────────────────────────────────────────────────────
 * Writes
 * ──────────────────────────────────────────────────────────────────────── */

export async function createClient(input: Partial<ClientRow> & { name: string }) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('clients')
    .insert(input)
    .select('*')
    .single();

  if (error) throw error;

  return data as ClientRow;
}

export async function updateClient(id: string, patch: Partial<ClientRow>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('clients')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return data as ClientRow;
}

export async function createCampaign(
  input: Partial<CampaignRow> & { name: string; client_id: string },
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('campaigns')
    .insert(input)
    .select('*')
    .single();

  if (error) throw error;

  return data as CampaignRow;
}

export async function createAsset(
  input: Partial<AssetRow> & {
    name: string;
    client_id: string;
    campaign_id: string;
    type: AssetRow['type'];
  },
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('assets')
    .insert(input)
    .select('*')
    .single();

  if (error) throw error;

  return data as AssetRow;
}

/* ────────────────────────────────────────────────────────────────────────
 * Brand kits
 * ──────────────────────────────────────────────────────────────────────── */

export async function listBrandKits() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('brand_kits').select('*');

  if (error) throw error;

  return (data ?? []) as BrandKitRow[];
}

export async function getBrandKitForClient(clientId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle();

  if (error) throw error;

  return (data ?? null) as BrandKitRow | null;
}

export async function upsertBrandKit(
  input: Partial<BrandKitRow> & { client_id: string; name: string },
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('brand_kits')
    .upsert({ ...input, updated_at: new Date().toISOString() }, {
      onConflict: 'client_id',
    })
    .select('*')
    .single();

  if (error) throw error;

  return data as BrandKitRow;
}

/* ────────────────────────────────────────────────────────────────────────
 * Mappers — DB rows → UI view models (the shapes the feature pages consume)
 * ──────────────────────────────────────────────────────────────────────── */

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export function toClientView(
  row: ClientRow,
  campaigns: CampaignRow[],
  assets: AssetRow[],
): Client {
  const clientCampaigns = campaigns.filter((c) => c.client_id === row.id);
  const clientAssets = assets.filter((a) => a.client_id === row.id);

  const approved = clientAssets.filter(
    (a) => a.status === 'approved' || a.status === 'published',
  ).length;
  const approvalRate = clientAssets.length
    ? Math.round((approved / clientAssets.length) * 100)
    : 0;

  const avgRevisions = clientAssets.length
    ? Math.round(
        (clientAssets.reduce((sum, a) => sum + (a.revision_count ?? 0), 0) /
          clientAssets.length) *
          10,
      ) / 10
    : 0;

  return {
    id: row.id,
    name: row.name,
    initials: initialsFromName(row.name),
    color: row.brand_color ?? '#6B21E8',
    industry: row.industry ?? '',
    contacts: row.contacts ?? [],
    activeCampaigns: clientCampaigns.filter((c) => c.status === 'active').length,
    activeAssets: clientAssets.filter((a) => a.status !== 'published').length,
    approvalRate,
    avgRevisions,
  };
}

export function toCampaignView(row: CampaignRow, assets: AssetRow[]): Campaign {
  const campaignAssets = assets.filter((a) => a.campaign_id === row.id);
  const completed = campaignAssets.filter(
    (a) => a.status === 'approved' || a.status === 'published',
  ).length;

  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    status: row.status,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    totalAssets: campaignAssets.length,
    completedAssets: completed,
    description: row.description ?? '',
  };
}

export function toAssetView(row: AssetRow): Asset {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    clientId: row.client_id,
    campaignId: row.campaign_id,
    designerId: row.designer_id ?? '',
    status: row.status,
    priority: (row.priority as Asset['priority']) ?? 'medium',
    currentVersion: row.current_version,
    dueDate: row.due_date ?? '',
    createdAt: row.created_at,
    revisionCount: row.revision_count,
    previewUrl: row.preview_url ?? '',
    description: row.description ?? '',
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Page data aggregates — fetch + map in one call for server components
 * ──────────────────────────────────────────────────────────────────────── */

export async function getClientsPageData(): Promise<{
  clients: Client[];
  campaigns: Campaign[];
  assets: Asset[];
}> {
  const supabase = await createSupabaseServerClient();

  const [clientsRes, campaignsRes, assetsRes] = await Promise.all([
    supabase.from('clients').select('*').order('name'),
    supabase.from('campaigns').select('*'),
    supabase.from('assets').select('*'),
  ]);

  if (clientsRes.error) throw clientsRes.error;
  if (campaignsRes.error) throw campaignsRes.error;
  if (assetsRes.error) throw assetsRes.error;

  const clientRows = (clientsRes.data ?? []) as ClientRow[];
  const campaignRows = (campaignsRes.data ?? []) as CampaignRow[];
  const assetRows = (assetsRes.data ?? []) as AssetRow[];

  return {
    clients: clientRows.map((c) => toClientView(c, campaignRows, assetRows)),
    campaigns: campaignRows.map((c) => toCampaignView(c, assetRows)),
    assets: assetRows.map(toAssetView),
  };
}

export async function getBrandKitsPageData(): Promise<{
  clients: Client[];
  brandKits: Record<string, BrandKitRow>;
}> {
  const supabase = await createSupabaseServerClient();

  const [clientsRes, kitsRes] = await Promise.all([
    supabase.from('clients').select('*').order('name'),
    supabase.from('brand_kits').select('*'),
  ]);

  if (clientsRes.error) throw clientsRes.error;
  if (kitsRes.error) throw kitsRes.error;

  const clientRows = (clientsRes.data ?? []) as ClientRow[];
  const kitRows = (kitsRes.data ?? []) as BrandKitRow[];

  const brandKits: Record<string, BrandKitRow> = {};
  for (const kit of kitRows) {
    brandKits[kit.client_id] = kit;
  }

  return {
    clients: clientRows.map((c) => toClientView(c, [], [])),
    brandKits,
  };
}
