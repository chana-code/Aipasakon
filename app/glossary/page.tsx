import { loadGlossary } from '@/lib/content/glossary';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';

export default async function GlossaryPage() {
  const entries = (await loadGlossary()).slice().sort((a, b) =>
    a.term_en.localeCompare(b.term_en)
  );

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="max-w-[880px] mx-auto px-4 md:px-7 pt-8 md:pt-14 pb-16 md:pb-24">

        {/* Eyebrow */}
        <p className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[#6c7a78] uppercase tracking-widest mb-4">
          Glossary · ภาคผนวกศัพท์
        </p>

        {/* Title */}
        <h1 className="font-['Noto_Serif_Thai',serif] text-[40px] leading-[1.2] font-bold text-[#00143C] mb-4">
          คลังคำศัพท์
        </h1>

        {/* Subtitle */}
        <p className="font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#6c7a78] max-w-[600px] mb-10">
          ศัพท์เทคนิคทุกคำในตำราถูก link มาที่นี่ครั้งแรกที่ปรากฏ.
          ถ้าศัพท์ไหนต้องการอธิบายยาวกว่านี้ มี topic note แยกในหลักสูตร &mdash; ดู &ldquo;บทเต็ม&rdquo; ด้านขวาของแต่ละ entry.
        </p>

        <GlossaryFilter entries={entries} />
      </div>
    </div>
  );
}
