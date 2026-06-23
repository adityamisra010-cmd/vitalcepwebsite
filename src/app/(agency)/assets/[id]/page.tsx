import AssetDetailPage from '@/features/agency/pages/AssetDetailPage';
import { getAssetWithReviewContext, toAssetView } from '@/lib/db/agency';
import type { AssetRow } from '@/types/database';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const row = (await getAssetWithReviewContext(id)) as AssetRow;
    return <AssetDetailPage asset={toAssetView(row)} />;
  } catch {
    return <AssetDetailPage />;
  }
}
