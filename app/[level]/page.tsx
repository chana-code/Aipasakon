import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { isLevel, LEVEL_META, LEVELS } from '@/lib/content/levels';

export function generateStaticParams() {
  return LEVELS.map(level => ({ level }));
}

// Per-level hex map (PORT-CONVENTIONS)
const LEVEL_HEX: Record<string, string> = {
  foundations:        '#14B5AB',
  'using-ai':         '#2D7CD6',
  'building-with-ai': '#B45A1A',
  advanced:           '#7A3FA0',
};

const SERIF = "font-['Noto_Serif_Thai',serif]";
const SANS  = "font-['DM_Sans',sans-serif]";

export default async function LevelIndex({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!isLevel(level)) notFound();

  const meta    = LEVEL_META[level];
  const hex     = LEVEL_HEX[level];
  const chapters = (await loadAllChapters()).filter(c => c.level === level);

  const idx  = LEVELS.indexOf(level);
  const prev = idx > 0 ? LEVELS[idx - 1] : null;
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;

  const isReady = (status: string) => status === 'reviewed' || status === 'stable';

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 min-h-screen">

      {/* 1. Breadcrumb */}
      <nav className="mb-8">
        <ol className={`flex items-center gap-2 text-xs ${SANS} text-[#6c7a78] uppercase tracking-widest`}>
          <li>
            <Link href="/curriculum" className="hover:text-[#14B5AB] transition-colors">
              หลักสูตร
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="font-bold" style={{ color: hex }}>{meta.label_th}</span>
          </li>
        </ol>
      </nav>

      {/* 2. Level Hero */}
      <section className="mb-12">
        {/* Tinted chip */}
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${SANS} mb-6`}
          style={{ background: `${hex}1a`, color: hex }}
        >
          Level {meta.order} · {meta.label_th}
        </div>

        <h1 className={`text-5xl ${SERIF} font-bold mb-4 text-[#00143C] leading-tight`}>
          {meta.label_th}
        </h1>

        <p className={`text-lg ${SANS} text-[#00143C]/80 leading-relaxed mb-6`}>
          {meta.tagline_th}
        </p>

        <div className={`flex items-center gap-4 text-sm ${SANS} text-[#6c7a78] mb-8`}>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm" style={{ color: hex }}>menu_book</span>
            {chapters.length} บทเรียน
          </span>
        </div>

        {/* Thin level-colored rule */}
        <hr className="border-0 h-px w-full" style={{ background: hex, opacity: 0.3 }} />
      </section>

      {/* 3. Prerequisite note */}
      <div className="bg-white border border-[#E8E2D4] p-6 rounded-lg mb-12 flex gap-4 items-start">
        <span
          className="material-symbols-outlined mt-0.5"
          style={{ color: '#14B5AB', fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <div>
          <h4 className={`${SANS} font-bold text-sm text-[#00143C] mb-1`}>ก่อนเริ่มระดับนี้ ควรรู้</h4>
          {prev ? (
            <p className={`text-sm ${SANS} text-[#6c7a78]`}>
              เนื้อหาในส่วนนี้ต่อเนื่องจากระดับก่อนหน้า แนะนำให้ผ่านเนื้อหา{' '}
              <Link href={`/${prev}`} className="text-[#14B5AB] hover:underline underline-offset-4">
                {LEVEL_META[prev].label_th}
              </Link>{' '}
              มาก่อน
            </p>
          ) : (
            <p className={`text-sm ${SANS} text-[#6c7a78]`}>
              ไม่ต้องมีพื้นฐานมาก่อน — ระดับนี้คือจุดเริ่มต้นสำหรับทุกคนที่สนใจ
            </p>
          )}
        </div>
      </div>

      {/* 4. Chapter list */}
      <div className="space-y-4 mb-20">
        {chapters.length === 0 && (
          <p className={`${SANS} text-sm text-[#6c7a78] italic py-4`}>เร็วๆ นี้</p>
        )}
        {chapters.map((c, i) => {
          const ready = isReady(c.status);
          return ready ? (
            <Link
              key={c.slug}
              href={`/${c.level}/${c.slug}`}
              className={`chapter-row group bg-white border border-[#E8E2D4] border-l-[3px] p-6 flex justify-between items-center transition-all hover:shadow-[0_4px_20px_rgba(0,20,60,0.03)] block`}
              style={{ borderLeftColor: hex }}
            >
              <div className="flex items-center gap-6">
                <div
                  className={`chapter-number w-10 h-10 rounded-full flex items-center justify-center font-bold ${SANS} text-lg transition-transform duration-300 text-white flex-shrink-0`}
                  style={{ background: hex }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3
                    className={`${SERIF} font-semibold text-lg text-[#00143C] transition-colors`}
                    style={{ ['--hover-color' as string]: hex }}
                  >
                    <span className="group-hover:opacity-80 transition-opacity">{c.title}</span>
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs ${SANS} font-bold flex items-center gap-1`} style={{ color: '#14B5AB' }}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      พร้อมอ่าน
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#6c7a78] group-hover:translate-x-1 transition-transform flex-shrink-0">
                arrow_forward
              </span>
            </Link>
          ) : (
            <div
              key={c.slug}
              className={`chapter-row bg-[#F5F3EE]/50 border border-[#E8E2D4] border-l-[3px] p-6 flex justify-between items-center opacity-80`}
              style={{ borderLeftColor: hex }}
            >
              <div className="flex items-center gap-6">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${SANS} text-lg flex-shrink-0`}
                  style={{ borderColor: hex, color: hex }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className={`${SERIF} font-semibold text-lg text-[#00143C]`}>{c.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs ${SANS} text-[#6c7a78] italic flex items-center gap-1`}>
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      เร็วๆ นี้
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Prev / next level navigation */}
      <div
        className={`flex ${prev && next ? 'justify-between' : prev ? 'justify-start' : 'justify-end'} pt-12 border-t border-[#E8E2D4] gap-4`}
      >
        {prev && (
          <Link href={`/${prev}`} className={`group flex items-center gap-3 text-[#00143C] hover:text-[#14B5AB] transition-colors`}>
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <div>
              <span className={`block text-[10px] uppercase tracking-widest font-bold ${SANS} text-[#6c7a78]`}>
                ระดับก่อนหน้า
              </span>
              <span className={`${SERIF} font-semibold text-lg`}>{LEVEL_META[prev].label_th}</span>
            </div>
          </Link>
        )}
        {next && (
          <Link href={`/${next}`} className={`group flex items-center gap-3 text-white px-8 py-4 rounded-lg shadow-sm transition-all hover:-translate-y-0.5`} style={{ background: hex }}>
            <div className="text-right">
              <p className={`text-[12px] opacity-80 uppercase tracking-widest font-bold ${SANS}`}>ระดับถัดไป</p>
              <h4 className={`${SERIF} text-[20px]`}>Level {LEVEL_META[next].order} · {LEVEL_META[next].label_th}</h4>
            </div>
            <span className="material-symbols-outlined text-[32px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        )}
      </div>

    </div>
  );
}
