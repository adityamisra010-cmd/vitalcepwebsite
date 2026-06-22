import { AppShell } from '@/features/agency/AppShell';
import type { ReactNode } from 'react';

export default function AgencyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
