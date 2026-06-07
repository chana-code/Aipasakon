import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { readGatedFile } from '@/lib/content/read-gated-file';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Auth check — no bytes leave the server for logged-out users.
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const html = await readGatedFile(slug);
  if (html === null) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Same-origin framing only (the article page iframes this).
      'Content-Security-Policy': "frame-ancestors 'self'",
      'Cache-Control': 'private, no-store',
    },
  });
}
