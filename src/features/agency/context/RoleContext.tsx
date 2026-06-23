'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'founder' | 'designer' | 'client';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: 'founder',
  setRole: () => {},
});

export function RoleProvider({
  children,
  initialRole = 'founder',
}: {
  children: ReactNode;
  initialRole?: Role;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
