'use client';

import type { ReactNode } from 'react';

import { RoleProvider } from './context/RoleContext';
import AppLayout from './layouts/AppLayout';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <AppLayout>{children}</AppLayout>
    </RoleProvider>
  );
}
