'use client';

import { LogOut } from 'lucide-react';

import { signOut } from '@/app/(auth)/actions';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex items-center gap-1.5 bg-secondary border border-border text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        <LogOut size={15} /> Sign out
      </button>
    </form>
  );
}
