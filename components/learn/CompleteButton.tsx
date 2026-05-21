'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CompleteButtonProps {
  chapterSlug: string;
}

export function CompleteButton({ chapterSlug }: CompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsAuthenticated(true);

      const res = await fetch('/api/completions');
      if (res.ok) {
        const json = await res.json() as { completions: { chapter_slug: string }[] };
        setIsCompleted(json.completions.some(c => c.chapter_slug === chapterSlug));
      }
    }

    void init();
  }, [chapterSlug]);

  if (!isAuthenticated) return null;

  async function handleComplete() {
    if (isCompleted) return;
    setLoading(true);
    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_slug: chapterSlug }),
      });
      if (res.ok) {
        setIsCompleted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (isCompleted) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 14px',
        background: '#F0FDF4',
        border: '1px solid #86EFAC',
        borderRadius: 6,
        fontFamily: 'var(--font-thai)',
        fontSize: 13.5,
        color: '#16A34A',
        fontWeight: 500,
      }}>
        ✓ อ่านจบแล้ว
      </span>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      style={{
        padding: '5px 14px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 6,
        fontFamily: 'var(--font-thai)',
        fontSize: 13.5,
        color: 'var(--fg-2)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        fontWeight: 500,
        transition: 'border-color 0.15s, color 0.15s',
      }}
    >
      {loading ? 'กำลังบันทึก…' : 'อ่านจบแล้ว'}
    </button>
  );
}
