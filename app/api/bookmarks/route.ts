import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('chapter_slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarks: data });
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

  // Check if bookmark already exists
  const { data: existing } = await supabase
    .from('user_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('chapter_slug', chapter_slug)
    .maybeSingle();

  if (existing) {
    // Delete (toggle off)
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('chapter_slug', chapter_slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookmarked: false });
  } else {
    // Insert (toggle on)
    const { error } = await supabase
      .from('user_bookmarks')
      .insert({ user_id: user.id, chapter_slug });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookmarked: true });
  }
}
