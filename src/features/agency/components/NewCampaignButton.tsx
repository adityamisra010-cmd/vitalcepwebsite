'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { createCampaignAction } from '@/app/(agency)/actions';
import type { Client } from '../data/mockData';

export function NewCampaignButton({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createCampaignAction(formData);
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(res.error ?? 'Failed to create campaign');
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus size={15} /> New Campaign
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl p-4 shadow-xl z-20">
          <form action={onSubmit} className="space-y-2">
            <input
              name="name"
              required
              placeholder="Campaign name"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              name="client_id"
              required
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={2}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? 'Creating…' : 'Create campaign'}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
