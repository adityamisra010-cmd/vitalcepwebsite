import ActivityPage from '@/features/agency/pages/ActivityPage';
import { getActivityPageData } from '@/lib/db/agency';

export default async function Page() {
  try {
    const { activityItems } = await getActivityPageData();
    return <ActivityPage activityItems={activityItems} />;
  } catch {
    return <ActivityPage />;
  }
}
