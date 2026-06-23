import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppShell } from '@/features/agency/AppShell';
import { getCurrentProfile, toUiRole } from '@/lib/auth';

export default async function AgencyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  return <AppShell initialRole={toUiRole(profile.role)}>{children}</AppShell>;
}
