import Link from 'next/link';
import { Search } from 'lucide-react';

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-line">
      <nav className="mx-auto max-w-6xl h-full px-6 flex items-center justify-between">
        <Link href="/" className="font-thai font-semibold text-navy-900">
          AI <span className="text-teal-500">ภาษาคน</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li><Link href="/curriculum" className="hover:text-teal-600">หลักสูตร</Link></li>
          <li><Link href="/videos" className="hover:text-teal-600">วิดีโอ</Link></li>
          <li><Link href="/glossary" className="hover:text-teal-600">คำศัพท์</Link></li>
          <li><Link href="/about" className="hover:text-teal-600">เกี่ยวกับ</Link></li>
          <li>
            <Link href="/search" aria-label="ค้นหา" className="text-fg-2 hover:text-teal-600">
              <Search size={20} strokeWidth={1.5} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
