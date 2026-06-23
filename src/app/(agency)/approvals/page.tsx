import ApprovalsPage from '@/features/agency/pages/ApprovalsPage';
import { getApprovalsPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { assets, clients, campaigns, latestVersionByAsset } =
      await getApprovalsPageData();
    return (
      <ApprovalsPage
        assets={assets}
        clients={clients}
        campaigns={campaigns}
        latestVersionByAsset={latestVersionByAsset}
      />
    );
  } catch {
    return <ApprovalsPage />;
  }
}
