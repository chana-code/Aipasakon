import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-auto flex flex-col items-center gap-4 text-center pb-8 bg-[#FAF8F3] border-t border-[#EBE6DD] py-12">
      <div className="font-['Noto_Serif_Thai',serif] text-sm font-bold text-[#1C1A17] mb-4">AI ภาษาคน</div>
      <div className="flex gap-8 mb-6">
        <Link href="/about" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">นโยบายความเป็นส่วนตัว</Link>
        <Link href="/about" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">ติดต่อเรา</Link>
        <Link href="/curriculum" className="text-xs uppercase tracking-wider text-[#6B6660] hover:text-[#1C1A17] transition-all no-underline">บทเรียนทั้งหมด</Link>
      </div>
      <div className="text-xs uppercase tracking-wider text-[#00143C]/40">
        © {new Date().getFullYear()} ภาษาคน — AI ไม่ยาก ถ้าพูดภาษาคน
      </div>
    </footer>
  );
}
