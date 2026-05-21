import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'แดชบอร์ด — AI ภาษาคน',
  description: 'ติดตามความก้าวหน้าการเรียนรู้ AI ของคุณ',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 960,
      margin: '0 auto',
      padding: '40px 28px 80px',
    }}>
      {children}
    </div>
  );
}
