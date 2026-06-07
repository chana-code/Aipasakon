import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { ARCHIVE_LEVELS, LEVEL_META } from '@/lib/content/levels';


export const metadata = {
  title: 'คลังเนื้อหาฉบับก่อนหน้า — AI ภาษาคน',
};

export default async function ArchivePage() {
  const all = await loadAllChapters();
  const count = (lvl: string) => all.filter(c => c.level === lvl).length;
  // Only show archived levels that still have chapters on disk.
  const levels = ARCHIVE_LEVELS.filter(lvl => count(lvl) > 0).sort(
    (a, b) => LEVEL_META[a].order - LEVEL_META[b].order,
  );

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 min-h-screen">
      <header className="mb-12">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-6 bg-[#eae8e3] text-[#6c7a78]`}>
          คลังเนื้อหา (Archive)
        </div>
        <h1 className={`text-[40px] leading-[1.2] font-bold text-[#00143C] mb-4`}>
          เนื้อหาหลักสูตรฉบับก่อนหน้า
        </h1>
        <p className={`text-[17px] leading-[1.8] text-[#6c7a78]`}>
          นี่คือหลักสูตรชุดเดิม 54 บท ที่เก็บไว้เป็นคลังอ้างอิง เนื้อหาหลักของเว็บได้ย้ายไปที่{' '}
          <Link href="/curriculum" className="text-[#14B5AB] hover:underline underline-offset-4">
            หลักสูตรฉบับใหม่
          </Link>{' '}
          แล้ว เนื้อหาในคลังนี้อาจมีบางส่วนที่ล้าสมัย
        </p>
      </header>

      <div className="space-y-4 mb-20">
        {levels.map(lvl => {
          const m = LEVEL_META[lvl];
          return (
            <Link
              key={lvl}
              href={`/${lvl}`}
              className="group bg-white border border-[#E8E2D4] border-l-[3px] p-6 flex justify-between items-center transition-all hover:shadow-[0_4px_20px_rgba(0,20,60,0.03)]"
              style={{ borderLeftColor: m.color }}
            >
              <div>
                <h3 className={`font-semibold text-lg text-[#00143C]`}>{m.label_th}</h3>
                <p className={`text-sm text-[#6c7a78] mt-1`}>{m.tagline_th}</p>
              </div>
              <span className={`text-xs text-[#6c7a78] whitespace-nowrap ml-4`}>
                {count(lvl)} บท
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
