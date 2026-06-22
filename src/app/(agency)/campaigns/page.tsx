import CampaignsPage from '@/features/agency/pages/CampaignsPage';
import { getClientsPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { campaigns, clients } = await getClientsPageData();
    return <CampaignsPage campaigns={campaigns} clients={clients} />;
  } catch {
    return <CampaignsPage />;
  }
}
