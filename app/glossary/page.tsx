import type { Metadata } from 'next';
import { loadGlossary } from '@/lib/content/glossary';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';
import { ogImageUrl } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { collectionLd } from '@/lib/seo/jsonld';

const GLOSSARY_DESC =
  'รวมคำศัพท์ AI ที่เจอบ่อย อธิบายเป็นภาษาไทยเข้าใจง่าย พร้อมลิงก์ไปบทเรียนเต็ม';

export const metadata: Metadata = {
  title: 'สารานุกรมศัพท์ AI',
  description: GLOSSARY_DESC,
  alternates: { canonical: '/glossary' },
  openGraph: {
    type: 'website',
    url: '/glossary',
    title: 'สารานุกรมศัพท์ AI',
    description: GLOSSARY_DESC,
    images: [
      {
        url: ogImageUrl({ title: 'สารานุกรมศัพท์ AI', tag: 'คำศัพท์' }),
        width: 1200,
        height: 630,
        alt: 'สารานุกรมศัพท์ AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'สารานุกรมศัพท์ AI',
    description: GLOSSARY_DESC,
    images: [ogImageUrl({ title: 'สารานุกรมศัพท์ AI', tag: 'คำศัพท์' })],
  },
};

export default async function GlossaryPage() {
  const entries = (await loadGlossary()).slice().sort((a, b) =>
    a.term_en.localeCompare(b.term_en)
  );

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <JsonLd
        data={collectionLd({
          name: 'สารานุกรมศัพท์ AI',
          description: GLOSSARY_DESC,
          path: '/glossary',
          items: entries.map((e) => ({
            name: e.term_th ? `${e.term_en} (${e.term_th})` : e.term_en,
            path: e.full_chapter ?? '/glossary',
          })),
        })}
      />
      <div className="max-w-[880px] mx-auto px-4 md:px-7 pt-8 md:pt-14 pb-16 md:pb-24">

        {/* Eyebrow */}
        <p className="text-[13px] font-medium text-[#6c7a78] uppercase tracking-widest mb-4">
          Glossary · ภาคผนวกศัพท์
        </p>

        {/* Title */}
        <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-4">
          คลังคำศัพท์
        </h1>

        {/* Subtitle */}
        <p className="text-[18px] leading-[1.8] text-[#6c7a78] max-w-[600px] mb-10">
          ศัพท์เทคนิคทุกคำในตำราถูก link มาที่นี่ครั้งแรกที่ปรากฏ.
          ถ้าศัพท์ไหนต้องการอธิบายยาวกว่านี้ มี topic note แยกในหลักสูตร &mdash; ดู &ldquo;บทเต็ม&rdquo; ด้านขวาของแต่ละ entry.
        </p>

        <GlossaryFilter entries={entries} />
      </div>
    </div>
  );
}
