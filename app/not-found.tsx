import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-prose px-6 py-24 text-center">
      <h1 className="font-thai text-3xl font-semibold mb-3">หน้านี้ยังไม่ได้เขียน</h1>
      <p className="text-fg-2 mb-8">บทที่คุณกำลังหา ยังไม่มีในตำรา — อาจจะอยู่ในแผน หรือเพิ่งย้ายที่</p>
      <Link href="/curriculum" className="text-teal-600 hover:text-teal-700">ดูหลักสูตรทั้งหมด →</Link>
    </div>
  );
}
