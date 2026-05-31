'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/curriculum', label: 'บทเรียน', match: ['/curriculum', '/foundations', '/using-ai', '/building-with-ai', '/advanced'] },
  { href: '/glossary', label: 'สารานุกรม', match: ['/glossary'] },
  { href: '/about', label: 'เกี่ยวกับเรา', match: ['/about'] },
];

export function TopNav() {
  const pathname = usePathname() || '/';

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#FAF8F3] border-b border-[#EBE6DD]">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-['Noto_Serif_Thai',serif] text-xl font-bold no-underline">
          <span className="text-[#00143C]">AI</span> <span className="text-[#14B5AB]">ภาษาคน</span>
        </Link>
        <div className="hidden md:flex gap-6">
          {LINKS.map(l => {
            const active = l.match.some(m => pathname === m || pathname.startsWith(m + '/'));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "font-['Noto_Serif_Thai',serif] text-lg font-semibold text-[#B85C38] border-b-2 border-[#B85C38] pb-1 no-underline transition-all"
                    : "font-['Noto_Serif_Thai',serif] text-lg font-semibold text-[#6B6660] hover:text-[#1C1A17] pb-1 no-underline transition-all"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/foundations"
          className="px-5 py-2 bg-[#14B5AB] text-white rounded-lg font-['Noto_Serif_Thai',serif] font-semibold hover:bg-[#12a39a] transition-all no-underline active:scale-95"
        >
          เริ่มตรงนี้
        </Link>
      </div>
    </nav>
  );
}
