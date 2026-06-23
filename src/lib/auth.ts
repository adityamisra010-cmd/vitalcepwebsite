import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { AgencyRole, ProfileRow } from '@/types/database';
import type { Role } from '@/features/agency/context/RoleContext';

/**
 * Map a database agency_role to the three-way UI role used by the dashboards
 * and navigation (founder / designer / client).
 */
export function toUiRole(role: AgencyRole): Role {
  switch (role) {
    case 'admin':
    case 'account_manager':
      return 'founder';
    case 'creative':
      return 'designer';
    case 'reviewer':
    case 'client':
    default:
      return 'client';
  }
}

/** Return the signed-in user's profile, or null if unauthenticated. */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (data ?? null) as ProfileRow | null;
}
