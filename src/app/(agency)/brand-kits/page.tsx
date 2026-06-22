import BrandKitPage, {
  type BrandKitView,
} from '@/features/agency/pages/BrandKitPage';
import { getBrandKitsPageData } from '@/lib/db/agency';

// Server component: load clients + their brand kits from Supabase, mapping the
// DB rows into the view shape the page renders. Falls back to mock data when
// Supabase is unconfigured or empty.
export default async function Page() {
  try {
    const { clients, brandKits } = await getBrandKitsPageData();

    const mapped: Record<string, BrandKitView> = {};
    for (const [clientId, kit] of Object.entries(brandKits)) {
      mapped[clientId] = {
        colors: kit.primary_colors ?? [],
        fonts: kit.fonts ?? [],
        logos: kit.logos ?? [],
        voice: kit.voice ?? [],
        guidelines: kit.guidelines ?? [],
      };
    }

    return <BrandKitPage clients={clients} brandKits={mapped} />;
  } catch {
    return <BrandKitPage />;
  }
}
