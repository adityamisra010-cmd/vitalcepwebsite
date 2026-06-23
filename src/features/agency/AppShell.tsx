'use client';

import type { ReactNode } from 'react';

import { RoleProvider, type Role } from './context/RoleContext';
import AppLayout from './layouts/AppLayout';

export function AppShell({
  children,
  initialRole = 'founder',
}: {
  children: ReactNode;
  initialRole?: Role;
}) {
  return (
    <RoleProvider initialRole={initialRole}>
      <AppLayout>{children}</AppLayout>
    </RoleProvider>
  );
}
