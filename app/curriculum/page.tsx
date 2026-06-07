import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { CORE_LEVELS, LEVEL_META } from '@/lib/content/levels';

export default async function CurriculumPage() {
  const chapters = await loadAllChapters();

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 relative">
      {/* Left Column: Sticky Curriculum Spine */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-28 space-y-4">
          <h3 className="text-[14px] font-medium text-[#6c7a78] uppercase tracking-widest mb-6">
            Course Path
          </h3>
          <nav className="flex flex-col gap-3">
            {CORE_LEVELS.map((lvl) => {
              const meta = LEVEL_META[lvl];
              const hex = LEVEL_META[lvl].color;
              const hasChapters = chapters.some(c => c.level === lvl);
              return (
                <a
                  key={lvl}
                  href={`#${lvl}`}
                  className={`flex items-center gap-4 p-3 rounded-xl border border-[#E8E2D4] transition-all group bg-white${!hasChapters ? ' opacity-60' : ''}`}
                  style={
                    {
                      '--hover-border': hex,
                    } as React.CSSProperties
                  }
                  onMouseEnter={undefined}
                >
                  <span
                    className="w-8 h-8 flex items-center justify-center text-white rounded-full font-bold text-sm shrink-0"
                    style={{ background: hex }}
                  >
                    {meta.order}
                  </span>
                  <span
                    className="text-[14px] font-medium text-[#00143C] transition-colors"
                  >
                    {meta.label_th}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Column */}
      <div className="w-full max-w-[720px] mx-auto md:mx-0">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-4">
            หลักสูตร
          </h1>
          <p className="text-[18px] leading-[1.8] text-[#6c7a78]">
            เส้นทางเรียน AI เป็นภาษาคน ตั้งแต่ยังไม่รู้อะไรเลย จนใช้งานได้จริงในงานและธุรกิจ
            ออกแบบมาให้เข้าใจง่ายแต่ลึกซึ้ง พร้อมการประยุกต์ใช้ทันที
          </p>
        </header>

        {/* Level Sections */}
        {CORE_LEVELS.map((lvl) => {
          const meta = LEVEL_META[lvl];
          const hex = LEVEL_META[lvl].color;
          const items = chapters.filter(c => c.level === lvl);
          const isEmpty = items.length === 0;

          return (
            <section
              key={lvl}
              id={lvl}
              className={`mb-16 scroll-mt-24${isEmpty ? ' opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="px-3 py-1 text-white rounded text-sm font-bold uppercase"
                  style={{ background: hex }}
                >
                  Level {meta.order}
                </span>
                <h2 className="text-[28px] leading-[1.3] font-semibold text-[#00143C]">
                  {meta.label_th} ({meta.label})
                </h2>
                {isEmpty && (
                  <span
                    className="text-sm font-medium font-bold"
                    style={{ color: hex }}
                  >
                    เร็วๆ นี้
                  </span>
                )}
              </div>

              {isEmpty ? (
                /* Coming soon placeholder rows */
                <div className="space-y-2">
                  {[1, 2].map(n => (
                    <div
                      key={n}
                      className="flex items-center justify-between p-4 rounded-lg border border-dashed border-[#E8E2D4]"
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className="font-bold w-6 opacity-30"
                          style={{ color: hex }}
                        >
                          {String(n).padStart(2, '0')}
                        </span>
                        <div className="h-4 w-48 bg-[#f0eee9] rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((c, idx) => (
                    <Link
                      key={c.slug}
                      href={`/${c.level}/${c.slug}`}
                      className="group flex items-center justify-between p-4 rounded-lg border border-[#E8E2D4] bg-white hover:bg-[#f0eee9] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className="font-bold w-6"
                          style={{ color: hex }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="text-lg text-[#00143C]">
                            {c.title}
                          </h4>
                          {c.tldr && (
                            <p className="text-sm text-[#6c7a78]">{c.tldr}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Archive pointer */}
        <div className="mt-8 pt-8 border-t border-[#E8E2D4]">
          <p className="text-sm text-[#6c7a78]">
            กำลังมองหาเนื้อหาชุดเดิม (54 บท)?{' '}
            <Link href="/archive" className="text-[#14B5AB] hover:underline underline-offset-4">
              ดูคลังเนื้อหาฉบับก่อนหน้า
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
