import Image from 'next/image';
import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { CORE_LEVELS, LEVEL_META, type Level } from '@/lib/content/levels';

const SERIF = "font-['Noto_Serif_Thai',serif]";

const hexOf = (lvl: Level) => LEVEL_META[lvl].color;

const SPINE_DESC: Partial<Record<Level, string>> = {
  'what-is-ai': 'รู้จัก AI ตั้งแต่ประวัติ การเทรน กลไกข้างใน ไปจนถึงสิ่งที่มันทำไม่ได้',
  'products': 'แยกให้ออกว่า model, harness และผลิตภัณฑ์ AI ต่าง ๆ ต่างกันยังไง',
  'pro-usage': 'Context, token, skills และการสั่งงาน AI อย่างมืออาชีพ',
  'in-practice': 'ติดตั้ง เริ่มใช้ อ่าน docs และให้ AI ลงมือทำงานแทนคุณ',
};

const DOORS: { level: Level; title: string; desc: string }[] = [
  { level: 'what-is-ai', title: 'เพิ่งเริ่ม อยากเข้าใจ AI', desc: 'ปูพื้นเรื่อง AI ตั้งแต่ศูนย์ ว่ามันคืออะไร ทำงานยังไง ไม่ต้องมีพื้นฐานคอมพิวเตอร์' },
  { level: 'products', title: 'อยากรู้จักเครื่องมือ AI', desc: 'แยกให้ออกว่า ChatGPT, Claude และ product อื่น ๆ ต่างกันยังไง และเลือกใช้ตัวไหน' },
  { level: 'pro-usage', title: 'อยากใช้ให้เป็นมือโปร', desc: 'เจาะลึกเทคนิคการสั่งงาน จัดการ context และรีดประสิทธิภาพ AI ในงานจริง' },
];

function stripMd(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1');
}

export default async function ClassicHomePage() {
  const all = await loadAllChapters();
  const latest = all
    .filter(c => c.status === 'reviewed' || c.status === 'stable')
    .sort((a, b) => (b.last_reviewed ?? '').localeCompare(a.last_reviewed ?? ''))
    .slice(0, 3);
  const count = (lvl: Level) => all.filter(c => c.level === lvl).length;

  return (
    <>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-3/5">
          <h1 className={`${SERIF} text-[40px] font-bold leading-tight text-[#00143C] mb-6`}>
            AI ไม่ยาก<br />ถ้าพูดภาษาคน
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#00143C]/80 mb-10 max-w-[540px]">
            เรียน AI เป็นภาษาคน ตั้งแต่พื้นฐานจนใช้งานได้จริง — เขียนโดยคนทำธุรกิจ ไม่ใช่โปรแกรมเมอร์ เพื่อผลลัพธ์ที่จับต้องได้ในโลกการทำงานจริง
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/what-is-ai" className="bg-[#14B5AB] text-white px-8 py-4 rounded-lg font-['DM_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline">
              เริ่มตรงนี้ <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link href="/curriculum" className="border border-[#00143C]/20 text-[#00143C] px-8 py-4 rounded-lg font-['DM_Sans',sans-serif] text-[14px] font-medium hover:bg-[#f0eee9] transition-all no-underline">
              ดูหลักสูตรทั้งหมด
            </Link>
          </div>
        </div>
        <div className="md:w-2/5 relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border-4 border-white relative">
            <Image src="/stitch/hero-home.jpg" alt="AI ภาษาคน" fill className="object-cover" priority sizes="(max-width:768px) 100vw, 40vw" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border border-[#E8E2D4] max-w-[200px]">
            <p className={`${SERIF} text-[18px] text-[#00143C]`}>&ldquo;เนื้อหาที่เปลี่ยนโลกซับซ้อนให้กลายเป็นเรื่องคุยง่าย&rdquo;</p>
          </div>
        </div>
      </section>

      {/* Start Here */}
      <section className="bg-[#f5f3ee] py-20 border-y border-[#E8E2D4]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className={`${SERIF} text-[28px] font-semibold leading-[1.3] text-[#00143C] mb-12 text-center`}>เริ่มตรงไหนดี?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOORS.map(d => {
              const hex = hexOf(d.level);
              return (
                <div key={d.level} className="bg-white p-8 rounded-r-lg hover:shadow-md transition-all group" style={{ borderLeft: `3px solid ${hex}` }}>
                  <h3 className={`${SERIF} text-[22px] mb-4 text-[#00143C]`}>{d.title}</h3>
                  <p className="text-[#00143C]/70 mb-8">{d.desc}</p>
                  <Link href={`/${d.level}`} className="font-['DM_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2 group-hover:gap-4 transition-all no-underline" style={{ color: hex }}>
                    เริ่มอ่าน <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Spine */}
      <section className="max-w-[800px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className={`${SERIF} text-[28px] font-semibold leading-[1.3] text-[#00143C] mb-4`}>เส้นทางการเรียนรู้</h2>
          <p className="text-[#00143C]/60">หลักสูตรแบบเป็นขั้นตอนเพื่อการเป็นผู้เชี่ยวชาญ AI</p>
        </div>
        <div className="relative space-y-12">
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#E8E2D4] z-0" />
          {CORE_LEVELS.map(lvl => {
            const m = LEVEL_META[lvl];
            const hex = hexOf(lvl);
            return (
              <Link key={lvl} href={`/${lvl}`} className="relative z-10 flex gap-8 items-start no-underline group">
                <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg shrink-0" style={{ background: hex }}>{m.order}</div>
                <div className="flex-1 pt-2">
                  <div className="flex justify-between items-baseline border-b border-[#E8E2D4] pb-2 mb-2">
                    <h4 className={`${SERIF} text-xl group-hover:underline`} style={{ color: hex }}>Level {m.order}: {m.label_th}</h4>
                    <span className="text-xs font-['DM_Sans',sans-serif] font-medium uppercase tracking-widest text-[#00143C]/50">{count(lvl)} Chapters</span>
                  </div>
                  <p className="text-[#00143C]/70 italic">{SPINE_DESC[lvl]}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-[#E8E2D4] py-10 bg-[#e4e2dd]/30">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          {[['language', 'ภาษาไทยล้วน'], ['verified', 'อ้างอิงได้จริง'], ['business_center', 'เขียนจากประสบการณ์ทำธุรกิจจริง']].map(([icon, label]) => (
            <div key={icon} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#14B5AB]">{icon}</span>
              <span className={`${SERIF} text-lg text-[#00143C]`}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest */}
      {latest.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className={`${SERIF} text-[28px] font-semibold leading-[1.3] text-[#00143C]`}>บทความล่าสุด</h2>
            <Link href="/curriculum" className="text-[#14B5AB] font-['DM_Sans',sans-serif] text-[14px] font-medium border-b border-[#14B5AB]/20 hover:border-[#14B5AB] transition-all no-underline">ดูบทความทั้งหมด</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map(c => {
              const hex = hexOf(c.level);
              const readMin = Math.max(1, Math.ceil(c.body.length / 900));
              return (
                <Link key={c.slug} href={`/${c.level}/${c.slug}`} className="bg-white p-6 rounded-lg border border-[#E8E2D4] hover:border-t-[#14B5AB] hover:border-t-4 transition-all duration-300 group no-underline block">
                  <span className="inline-block px-3 py-1 rounded text-xs font-bold mb-4" style={{ background: `${hex}1a`, color: hex }}>Level {LEVEL_META[c.level].order}</span>
                  <h3 className={`${SERIF} text-xl mb-4 text-[#00143C] group-hover:text-[#14B5AB] transition-colors`}>{c.title}</h3>
                  {c.tldr && <p className="text-[#00143C]/70 text-sm mb-6 line-clamp-3">{stripMd(c.tldr)}</p>}
                  <div className="text-xs text-[#00143C]/40 font-['DM_Sans',sans-serif]">อ่าน {readMin} นาที{c.last_reviewed ? ` • ${c.last_reviewed}` : ''}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
