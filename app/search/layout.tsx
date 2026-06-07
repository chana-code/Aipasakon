import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ค้นหา',
  description: 'ค้นหาบทเรียน คำศัพท์ และเนื้อหาทั้งหมดในคลังความรู้ของ AI ภาษาคน',
  alternates: { canonical: '/search' },
  robots: { index: false },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
