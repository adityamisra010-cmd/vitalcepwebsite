import { NextResponse } from 'next/server';

import { getCurrentProfile } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const BUCKET = 'assets';

/**
 * Issue a short-lived signed upload URL so the browser can upload a file
 * directly to Supabase Storage without the bytes passing through this server.
 * The client then confirms the returned `path` back to the app, which records
 * it on an asset_version row.
 *
 * Body: { assetId: string, fileName: string }
 */
export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { assetId, fileName } = (await request.json()) as {
      assetId?: string;
      fileName?: string;
    };

    if (!assetId || !fileName) {
      return NextResponse.json(
        { error: 'assetId and fileName are required' },
        { status: 400 },
      );
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `assets/${assetId}/versions/${Date.now()}_${safeName}`;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      bucket: BUCKET,
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create upload URL' },
      { status: 500 },
    );
  }
}
