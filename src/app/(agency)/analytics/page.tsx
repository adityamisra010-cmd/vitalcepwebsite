import AnalyticsPage from '@/features/agency/pages/AnalyticsPage';
import { getClientsPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { clients } = await getClientsPageData();
    return <AnalyticsPage clients={clients} />;
  } catch {
    return <AnalyticsPage />;
  }
}
