'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mode: 'login' | 'signup';
  redirectTo?: string;
}

export function AuthForm({ mode, redirectTo = '/learn' }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess('ตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัครสมาชิก');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
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

  const btnPrimaryStyle: React.CSSProperties = {
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
  };

  const btnGoogleStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 0',
    background: '#fff',
    color: 'var(--fg-1)',
    border: '1px solid var(--line)',
    borderRadius: 8,
    fontFamily: 'var(--font-thai)',
    fontSize: 15,
    fontWeight: 500,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    opacity: loading ? 0.7 : 1,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle}>อีเมล</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" style={labelStyle}>รหัสผ่าน</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          style={inputStyle}
          placeholder={mode === 'signup' ? 'อย่างน้อย 6 ตัวอักษร' : '••••••••'}
          minLength={6}
        />
      </div>

      {/* Error / Success */}
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
      {success && (
        <div style={{
          padding: '10px 14px',
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: 8,
          fontFamily: 'var(--font-thai)',
          fontSize: 13.5,
          color: '#16A34A',
        }}>
          {success}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading} style={btnPrimaryStyle}>
        {loading ? 'กำลังโหลด…' : mode === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
      </button>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--fg-3)',
        fontFamily: 'var(--font-thai)',
        fontSize: 13,
      }}>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        หรือ
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      {/* Google OAuth */}
      <button type="button" onClick={handleGoogle} disabled={loading} style={btnGoogleStyle}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.268 17.64 11.94 17.64 9.2z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.705A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        เข้าสู่ระบบด้วย Google
      </button>
    </form>
  );
}
