'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';

const LINKS = [
  { href: '/curriculum', label: 'บทเรียน', match: ['/curriculum', '/what-is-ai', '/products', '/pro-usage', '/in-practice'] },
  { href: '/glossary', label: 'สารานุกรม', match: ['/glossary'] },
  { href: '/about', label: 'เกี่ยวกับเรา', match: ['/about'] },
];

export function TopNav() {
  const pathname = usePathname() || '/';

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#FAF8F3] border-b border-[#EBE6DD]">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center no-underline" aria-label="AI ภาษาคน — หน้าแรก">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-circular-full.png" alt="AI ภาษาคน" className="h-12 w-12 shrink-0 object-contain" />
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
        <AuthButton />
      </div>
    </nav>
  );
}
