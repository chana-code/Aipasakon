import { Lock } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';

export function ArticleGate({
  title,
  summary,
  slug,
}: {
  title: string;
  summary?: string;
  slug: string;
}) {
  return (
    <div className="max-w-[560px] mx-auto py-12">
      <div className="flex items-center gap-2 text-[#00143C]/60 mb-3">
        <Lock size={18} />
        <span className="text-sm">เนื้อหาสำหรับสมาชิก</span>
      </div>
      <h1 className="text-2xl font-bold text-[#00143C] mb-2">{title}</h1>
      {summary && <p className="text-[#00143C]/70 mb-6">{summary}</p>}
      <div className="rounded-lg border border-[#E8E2D4] bg-[#F4F1E9] p-6">
        <p className="font-semibold text-[#00143C] mb-4">เข้าสู่ระบบเพื่ออ่านบทความนี้</p>
        <AuthForm mode="login" redirectTo={`/articles/${slug}`} />
      </div>
    </div>
  );
}
