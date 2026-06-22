import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function listClients() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('clients').select('*').order('name');

  if (error) throw error;

  return data;
}

export async function listCampaigns() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*, clients(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function listAssets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('assets')
    .select('*, clients(*), campaigns(*), asset_versions(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
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
