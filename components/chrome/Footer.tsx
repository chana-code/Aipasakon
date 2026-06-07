import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-auto flex flex-col items-center gap-4 text-center pb-8 bg-[#FAF8F3] border-t border-[#EBE6DD] py-12">
      <div className="text-sm font-bold text-[#1C1A17] mb-4">AI ภาษาคน</div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-6">
        <Link href="/curriculum" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">บทเรียน</Link>
        <Link href="/videos" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">วีดีโอการสอน</Link>
        <Link href="/glossary" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">สารานุกรม</Link>
        <Link href="/skills" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">รวม Skill</Link>
        <Link href="/lab" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">AI Lab</Link>
        <Link href="/blog" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">บทความ</Link>
        <Link href="/about" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">เกี่ยวกับเรา</Link>
      </div>
      <div className="text-xs uppercase tracking-wider text-[#00143C]/40">
        © {new Date().getFullYear()} ภาษาคน — AI ไม่ยาก ถ้าพูดภาษาคน
      </div>
    </footer>
  );
}
