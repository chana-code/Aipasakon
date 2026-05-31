import './globals.css';
import type { Metadata, Viewport } from 'next';
import { TopNav } from '@/components/chrome/TopNav';
import { Footer } from '@/components/chrome/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'AI ภาษาคน — AI ไม่ยาก ถ้าพูดภาษาคน',
  description: 'หลักสูตร AI ภาษาไทย สำหรับมือใหม่ถึงระดับลึก',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
