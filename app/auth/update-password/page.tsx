'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/learn'), 2000);
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
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
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-thai)',
    fontSize: 13.5,
    fontWeight: 500,
    color: 'var(--fg-2)',
    marginBottom: 6,
  };

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
        }}>ตั้งรหัสผ่านใหม่</h1>

        <p style={{
          margin: '0 0 28px',
          fontFamily: 'var(--font-thai)',
          fontSize: 14.5,
          color: 'var(--fg-3)',
        }}>กรุณาตั้งรหัสผ่านใหม่ของคุณ</p>

        {success ? (
          <div style={{
            padding: '16px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 8,
            fontFamily: 'var(--font-thai)',
            fontSize: 14.5,
            color: '#16A34A',
          }}>
            เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กำลังพาคุณไปแดชบอร์ด…
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="password" style={labelStyle}>รหัสผ่านใหม่</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                style={inputStyle}
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
            </div>

            <div>
              <label htmlFor="confirm" style={labelStyle}>ยืนยันรหัสผ่าน</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                style={inputStyle}
                placeholder="พิมพ์รหัสผ่านอีกครั้ง"
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
              {loading ? 'กำลังบันทึก…' : 'บันทึกรหัสผ่านใหม่'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
