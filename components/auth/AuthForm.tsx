'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  const isLogin = mode === 'login';

  return (
    <>
      {/* Google OAuth button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#E8E2D4] rounded-lg font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#00143C] bg-white hover:bg-[#f5f3ee] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.268 17.64 11.94 17.64 9.2z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.705A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        <span>{isLogin ? 'เข้าสู่ระบบด้วย Google' : 'สมัครด้วย Google'}</span>
      </button>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-[#E8E2D4]"></div>
        <span className="px-4 font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78] italic">หรือ</span>
        <div className="flex-grow border-t border-[#E8E2D4]"></div>
      </div>

      {/* Email / Password form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="auth-email"
            className="block font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78] mb-1.5"
          >
            อีเมล
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="example@email.com"
            className="w-full px-4 py-2.5 bg-white border border-[#E8E2D4] rounded-lg font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#00143C] focus:border-[#14B5AB] focus:ring-1 focus:ring-[#14B5AB] outline-none transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          {isLogin ? (
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="auth-password"
                className="block font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]"
              >
                รหัสผ่าน
              </label>
              <Link
                href="/auth/reset"
                className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#14B5AB] hover:underline transition-all"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
          ) : (
            <label
              htmlFor="auth-password"
              className="block font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78] mb-1.5"
            >
              รหัสผ่าน
            </label>
          )}
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'signup' ? 'อย่างน้อย 8 ตัวอักษร' : '••••••••'}
            minLength={6}
            className="w-full px-4 py-2.5 bg-white border border-[#E8E2D4] rounded-lg font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#00143C] focus:border-[#14B5AB] focus:ring-1 focus:ring-[#14B5AB] outline-none transition-all duration-200"
          />
          {mode === 'signup' && (
            <p className="text-[11px] text-[#6c7a78] mt-1 ml-1 leading-normal">
              แนะนำ: ผสมตัวเลข ตัวอักษร และสัญลักษณ์เพื่อความปลอดภัย
            </p>
          )}
        </div>

        {/* Legal consent (signup only) */}
        {mode === 'signup' && (
          <div className="pt-2">
            <p className="text-[11px] text-[#00143C]/70 text-center leading-relaxed">
              การคลิกสร้างบัญชี ถือว่าคุณยอมรับ{' '}
              <a href="#" className="text-[#14B5AB] hover:underline underline-offset-2 transition-all">
                เงื่อนไขการใช้งาน
              </a>{' '}
              และ{' '}
              <a href="#" className="text-[#14B5AB] hover:underline underline-offset-2 transition-all">
                นโยบายความเป็นส่วนตัว
              </a>{' '}
              ของเรา
            </p>
          </div>
        )}

        {/* Error / Success messages */}
        {error && (
          <div className="px-4 py-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg font-['DM_Sans',sans-serif] text-[13.5px] text-[#DC2626]">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-2.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg font-['DM_Sans',sans-serif] text-[13.5px] text-[#16A34A]">
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#14B5AB] text-white font-['DM_Sans',sans-serif] text-[14px] font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 shadow-[0_4px_12px_rgba(20,181,171,0.2)] disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
        >
          {loading
            ? 'กำลังโหลด…'
            : isLogin
            ? 'เข้าสู่ระบบ'
            : 'สร้างบัญชี'}
        </button>
      </form>
    </>
  );
}
