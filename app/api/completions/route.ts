import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_completions')
    .select('chapter_slug, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ completions: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { chapter_slug?: string };
  const { chapter_slug } = body;

  if (!chapter_slug) {
    return NextResponse.json({ error: 'chapter_slug required' }, { status: 400 });
  }

  // Upsert (idempotent)
  const { error } = await supabase
    .from('user_completions')
    .upsert(
      { user_id: user.id, chapter_slug, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,chapter_slug' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ completed: true });
}
