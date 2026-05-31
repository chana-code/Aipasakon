import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: 'เข้าสู่ระบบ — AI ภาษาคน' };

export default async function LoginPage({
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
      padding: '40px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '32px 24px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{
          margin: '0 0 8px',
          fontFamily: 'var(--font-thai)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--fg-1)',
        }}>เข้าสู่ระบบ</h1>

        <p style={{
          margin: '0 0 28px',
          fontFamily: 'var(--font-thai)',
          fontSize: 14.5,
          color: 'var(--fg-3)',
        }}>ยินดีต้อนรับกลับมา</p>

        <AuthForm mode="login" redirectTo={redirectTo} />

        <div style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-thai)',
            fontSize: 13.5,
            color: 'var(--fg-3)',
          }}>
            ยังไม่มีบัญชี?{' '}
            <Link href="/signup" style={{ color: 'var(--teal-600)', textDecoration: 'none', fontWeight: 500 }}>
              สมัครสมาชิก
            </Link>
          </p>
          <Link
            href="/auth/reset"
            style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13.5,
              color: 'var(--fg-3)',
              textDecoration: 'none',
            }}
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
      </div>
    </div>
  );
}
