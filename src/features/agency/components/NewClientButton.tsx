'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { createClientAction } from '@/app/(agency)/actions';

export function NewClientButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createClientAction(formData);
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(res.error ?? 'Failed to create client');
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus size={15} /> New
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl p-4 shadow-xl z-20 space-y-3">
          <form action={onSubmit} className="space-y-2">
            <input
              name="name"
              required
              placeholder="Client name"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="industry"
              placeholder="Industry (optional)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="brand_color"
              placeholder="Brand color hex (optional)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Create client'}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
