import DashboardPage from '@/features/agency/pages/DashboardPage';
import { getClientsPageData, getActivityPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const [{ assets, clients }, { activityItems }] = await Promise.all([
      getClientsPageData(),
      getActivityPageData(),
    ]);
    return (
      <DashboardPage assets={assets} clients={clients} activityItems={activityItems} />
    );
  } catch {
    return <DashboardPage />;
  }
}
