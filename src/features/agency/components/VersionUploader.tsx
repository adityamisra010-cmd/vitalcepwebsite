'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

import { addVersionAction } from '@/app/(agency)/actions';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/**
 * Uploads a new asset version directly to Supabase Storage:
 *   1. ask the server for a signed upload URL
 *   2. upload the file bytes straight to Storage (not through our server)
 *   3. record the resulting storage path on a new asset_version row
 */
export function VersionUploader({ assetId }: { assetId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleFile(file: File) {
    setError(null);
    setStatus('Requesting upload URL…');

    try {
      const res = await fetch('/api/storage/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not get upload URL');

      setStatus('Uploading…');
      const supabase = createSupabaseBrowserClient();
      const { error: uploadError } = await supabase.storage
        .from(data.bucket)
        .uploadToSignedUrl(data.path, data.token, file);
      if (uploadError) throw uploadError;

      setStatus('Saving version…');
      const form = new FormData();
      form.set('asset_id', assetId);
      form.set('storage_path', data.path);
      form.set('file_name', file.name);

      startTransition(async () => {
        const result = await addVersionAction(form);
        if (result.ok) {
          setStatus('Uploaded ✓');
          router.refresh();
        } else {
          setError(result.error ?? 'Failed to save version');
          setStatus(null);
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setStatus(null);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        className="flex items-center gap-1.5 bg-secondary border border-border text-foreground text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-60"
      >
        <Upload size={14} /> Upload version
      </button>
      {status && <span className="text-xs text-muted-foreground">{status}</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
