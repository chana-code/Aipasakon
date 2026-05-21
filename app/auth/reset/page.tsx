'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '40px 36px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{
          margin: '0 0 8px',
          fontFamily: 'var(--font-thai)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--fg-1)',
        }}>รีเซ็ตรหัสผ่าน</h1>

        <p style={{
          margin: '0 0 28px',
          fontFamily: 'var(--font-thai)',
          fontSize: 14.5,
          color: 'var(--fg-3)',
        }}>ระบุอีเมลของคุณแล้วเราจะส่งลิงก์รีเซ็ตให้</p>

        {success ? (
          <div style={{
            padding: '16px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 8,
            fontFamily: 'var(--font-thai)',
            fontSize: 14.5,
            color: '#16A34A',
            marginBottom: 20,
          }}>
            ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontFamily: 'var(--font-thai)',
                fontSize: 13.5,
                fontWeight: 500,
                color: 'var(--fg-2)',
                marginBottom: 6,
              }}>
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-thai)',
                  fontSize: 15,
                  color: 'var(--fg-1)',
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 8,
                fontFamily: 'var(--font-thai)',
                fontSize: 13.5,
                color: '#DC2626',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 0',
                background: 'var(--teal-600)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontFamily: 'var(--font-thai)',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'กำลังส่ง…' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
            </button>
          </form>
        )}

        <div style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          textAlign: 'center',
        }}>
          <Link
            href="/login"
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13.5,
              color: 'var(--fg-3)',
              textDecoration: 'none',
            }}
          >
            ← กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
