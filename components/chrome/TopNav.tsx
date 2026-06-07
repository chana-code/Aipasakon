'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/AuthButton';

const LINKS = [
  { href: '/curriculum', label: 'บทเรียน', match: ['/curriculum', '/what-is-ai', '/products', '/pro-usage', '/in-practice'] },
  { href: '/videos', label: 'วีดีโอการสอน', match: ['/videos'] },
  { href: '/glossary', label: 'สารานุกรม', match: ['/glossary'] },
  { href: '/skills', label: 'รวม Skill ที่น่าสนใจ', match: ['/skills'] },
  { href: '/lab', label: 'AI Lab', match: ['/lab'] },
  { href: '/blog', label: 'บทความ', match: ['/blog'] },
  { href: '/about', label: 'เกี่ยวกับเรา', match: ['/about'] },
];

export function TopNav() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const isActive = (m: string[]) => m.some(x => pathname === x || pathname.startsWith(x + '/'));

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FAF8F3] border-b border-[#EBE6DD]">
      <div className="flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center no-underline" aria-label="AI ภาษาคน — หน้าแรก">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-circular-full.png" alt="AI ภาษาคน" className="h-12 w-12 shrink-0 object-contain" />
          </Link>
          <div className="hidden md:flex gap-5">
            {LINKS.map(l => {
              const active = isActive(l.match);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    active
                      ? "text-base font-semibold text-[#B85C38] border-b-2 border-[#B85C38] pb-1 no-underline transition-all whitespace-nowrap"
                      : "text-base font-semibold text-[#6B6660] hover:text-[#1C1A17] pb-1 no-underline transition-all whitespace-nowrap"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <AuthButton />
          </div>
          <button
            type="button"
            aria-label="เมนู"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-[#1C1A17] hover:bg-[#EBE6DD] transition-colors"
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#EBE6DD] bg-[#FAF8F3] px-6 py-4 flex flex-col gap-3">
          {LINKS.map(l => {
            const active = isActive(l.match);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  active
                    ? "text-lg font-semibold text-[#B85C38] no-underline"
                    : "text-lg font-semibold text-[#6B6660] hover:text-[#1C1A17] no-underline"
                }
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
