import AssetsPage from '@/features/agency/pages/AssetsPage';
import { getClientsPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { assets, clients, campaigns } = await getClientsPageData();
    return <AssetsPage assets={assets} clients={clients} campaigns={campaigns} />;
  } catch {
    return <AssetsPage />;
  }
}
