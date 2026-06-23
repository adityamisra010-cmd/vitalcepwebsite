'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { createAssetAction } from '@/app/(agency)/actions';
import type { Client, Campaign } from '../data/mockData';

export function NewAssetButton({
  clients,
  campaigns,
}: {
  clients: Client[];
  campaigns: Campaign[];
}) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const clientCampaigns = useMemo(
    () => campaigns.filter((c) => c.clientId === clientId),
    [campaigns, clientId],
  );

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createAssetAction(formData);
      if (res.ok) {
        setOpen(false);
        router.push(`/assets/${res.id}`);
        router.refresh();
      } else {
        setError(res.error ?? 'Failed to create asset');
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus size={15} /> New Asset
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl p-4 shadow-xl z-20">
          <form action={onSubmit} className="space-y-2">
            <input
              name="name"
              required
              placeholder="Asset name"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              name="client_id"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="campaign_id"
              required
              disabled={!clientId}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
            >
              <option value="">
                {clientId ? 'Select campaign…' : 'Pick a client first'}
              </option>
              {clientCampaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="type"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="copy">Copy</option>
              <option value="motion">Motion</option>
            </select>
            <textarea
              name="description"
              placeholder="Brief description (optional)"
              rows={2}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? 'Creating…' : 'Create asset'}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
