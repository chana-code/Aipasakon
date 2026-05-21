import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-line mt-24 py-10 text-sm text-fg-3">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-3 md:flex-row md:justify-between">
        <p>© AI ภาษาคน — Ong, VP Commercial @ Fairdee.</p>
        <ul className="flex gap-5">
          <li><Link href="/about" className="hover:text-teal-600">เกี่ยวกับ</Link></li>
          <li><Link href="/curriculum" className="hover:text-teal-600">หลักสูตร</Link></li>
        </ul>
      </div>
    </footer>
  );
}
