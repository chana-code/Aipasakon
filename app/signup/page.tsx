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
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 py-12 bg-[#fbf9f4]">
      {/* Card */}
      <div className="w-full max-w-[480px]">
        <div className="bg-white border border-[#E8E2D4] rounded-lg p-8 md:p-10 shadow-[0_4px_20px_rgba(0,20,60,0.05)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-3">
              สมัครสมาชิก
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#00143C]/70 leading-relaxed px-4">
              ฟรี — เก็บที่คั่น ติดตามความคืบหน้า และอ่านต่อได้ทุกอุปกรณ์
            </p>
          </div>

          {/* Auth form (Google + divider + email/password + submit) */}
          <AuthForm mode="signup" redirectTo={redirectTo} />

          {/* Footer link */}
          <div className="mt-8 text-center">
            <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]">
              มีบัญชีอยู่แล้ว?{' '}
              <Link
                href="/login"
                className="text-[#14B5AB] font-bold hover:underline underline-offset-4 ml-1 transition-all"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
