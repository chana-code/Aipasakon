'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setLoading(false);
      }).catch(() => setLoading(false));

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) {
    return <span style={{ width: 80, height: 32, display: 'inline-block' }} />;
  }

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/learn"
          style={{
            padding: '6px 14px',
            background: 'var(--teal-600)',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
            fontFamily: 'var(--font-thai)',
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          แดชบอร์ด
        </Link>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: 'var(--fg-3)',
            border: '1px solid var(--line)',
            borderRadius: 6,
            fontFamily: 'var(--font-thai)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ออกจากระบบ
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-5 py-2 bg-[#14B5AB] text-white rounded-lg font-semibold hover:bg-[#12a39a] transition-all no-underline active:scale-95"
    >
      เข้าสู่ระบบ
    </Link>
  );
}
