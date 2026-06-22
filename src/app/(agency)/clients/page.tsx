import ClientsPage from '@/features/agency/pages/ClientsPage';
import { getClientsPageData } from '@/lib/db/agency';

// Server component: fetch real data from Supabase and hand it to the client
// page. If Supabase is unconfigured or the tables are empty, the page falls
// back to its built-in mock data so the UI always renders.
export default async function Page() {
  try {
    const { clients, campaigns, assets } = await getClientsPageData();
    return <ClientsPage clients={clients} campaigns={campaigns} assets={assets} />;
  } catch {
    return <ClientsPage />;
  }
}
