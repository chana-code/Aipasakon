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
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 py-12 bg-[#fbf9f4]">
      {/* Card */}
      <div className="w-full max-w-[440px]">
        <div className="bg-white border border-[#E8E2D4] rounded-lg p-8 md:p-10 shadow-[0_4px_20px_rgba(0,20,60,0.03)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]">
              ยินดีต้อนรับกลับมา อ่านต่อจากที่ค้างไว้ได้เลย
            </p>
          </div>

          {/* Auth form (Google + divider + email/password + submit) */}
          <AuthForm mode="login" redirectTo={redirectTo} />

          {/* Footer link */}
          <div className="mt-8 text-center">
            <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]">
              ยังไม่มีบัญชี?{' '}
              <Link
                href="/signup"
                className="text-[#14B5AB] font-bold hover:underline ml-1"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
