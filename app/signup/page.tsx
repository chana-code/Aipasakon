import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: 'สมัครสมาชิก — AI ภาษาคน' };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = next ?? '/learn';

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
        }}>สมัครสมาชิก</h1>

        <p style={{
          margin: '0 0 28px',
          fontFamily: 'var(--font-thai)',
          fontSize: 14.5,
          color: 'var(--fg-3)',
        }}>เริ่มต้นเรียนรู้ AI ภาษาคน</p>

        <AuthForm mode="signup" redirectTo={redirectTo} />

        <div style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-thai)',
            fontSize: 13.5,
            color: 'var(--fg-3)',
          }}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" style={{ color: 'var(--teal-600)', textDecoration: 'none', fontWeight: 500 }}>
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
