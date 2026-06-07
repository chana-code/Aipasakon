import Link from 'next/link';
import { Lock } from 'lucide-react';
import type { GatedArticle } from '@/lib/content/gated-articles';

export function GatedArticleCard({ article }: { article: GatedArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block rounded-lg border border-[#E8E2D4] bg-white p-5 hover:border-[#14B5AB] transition-colors"
    >
      <div className="flex items-start gap-3">
        <span aria-label="ล็อก" className="mt-0.5 text-[#00143C]/50">
          <Lock size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-[#00143C]">{article.title}</h3>
          {article.summary && (
            <p className="text-sm text-[#00143C]/70 mt-1">{article.summary}</p>
          )}
          <span className="text-xs text-[#14B5AB] mt-2 inline-block">
            เข้าสู่ระบบเพื่ออ่าน
          </span>
        </div>
      </div>
    </Link>
  );
}
