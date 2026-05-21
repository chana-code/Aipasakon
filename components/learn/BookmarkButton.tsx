'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BookmarkButtonProps {
  chapterSlug: string;
}

export function BookmarkButton({ chapterSlug }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsAuthenticated(true);

      const res = await fetch('/api/bookmarks');
      if (res.ok) {
        const json = await res.json() as { bookmarks: { chapter_slug: string }[] };
        setIsBookmarked(json.bookmarks.some(b => b.chapter_slug === chapterSlug));
      }
    }

    void init();
  }, [chapterSlug]);

  if (!isAuthenticated) return null;

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_slug: chapterSlug }),
      });
      if (res.ok) {
        const json = await res.json() as { bookmarked: boolean };
        setIsBookmarked(json.bookmarked);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บุ๊กมาร์ก'}
      style={{
        background: 'transparent',
        border: '1px solid var(--line)',
        borderRadius: 6,
        padding: '5px 10px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: 18,
        lineHeight: 1,
        color: isBookmarked ? 'var(--teal-600)' : 'var(--fg-3)',
        opacity: loading ? 0.6 : 1,
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {isBookmarked ? '★' : '☆'}
    </button>
  );
}
