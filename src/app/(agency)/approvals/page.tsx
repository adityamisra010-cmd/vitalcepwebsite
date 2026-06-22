import ApprovalsPage from '@/features/agency/pages/ApprovalsPage';
import { getClientsPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { assets, clients, campaigns } = await getClientsPageData();
    return <ApprovalsPage assets={assets} clients={clients} campaigns={campaigns} />;
  } catch {
    return <ApprovalsPage />;
  }
}
