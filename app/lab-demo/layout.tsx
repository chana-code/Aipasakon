import type { Metadata } from 'next';
import { ogImageUrl } from '@/lib/seo/site';

const LAB_DESC =
  'แล็บแกะโมเดล AI ในเบราว์เซอร์ — เปิดดูว่าข้างในไฟล์โมเดลภาษามีอะไร และเห็นมันทำงานจริงทีละขั้น';

export const metadata: Metadata = {
  title: 'แล็บแกะโมเดล AI',
  description: LAB_DESC,
  alternates: { canonical: '/lab-demo' },
  openGraph: {
    type: 'website',
    url: '/lab-demo',
    title: 'แล็บแกะโมเดล AI',
    description: LAB_DESC,
    images: [
      {
        url: ogImageUrl({ title: 'แล็บแกะโมเดล AI', tag: 'แล็บ' }),
        width: 1200,
        height: 630,
        alt: 'แล็บแกะโมเดล AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'แล็บแกะโมเดล AI',
    description: LAB_DESC,
    images: [ogImageUrl({ title: 'แล็บแกะโมเดล AI', tag: 'แล็บ' })],
  },
};

export default function LabDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
