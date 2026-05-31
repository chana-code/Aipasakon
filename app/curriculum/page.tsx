import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';
import { StatusBadge } from '@/components/reader/StatusBadge';

const VTJ = [
  { step: 'See', name: 'Vision', desc: 'มองออกว่าผลลัพธ์ที่ดีหน้าตาเป็นยังไง ก่อนจะสั่ง AI' },
  { step: 'Say', name: 'Translation', desc: 'สั่ง AI ให้ตรงใจ ด้วยภาษาที่มันเข้าใจ' },
  { step: 'Steer', name: 'Judgment', desc: 'ดูออกว่าผลลัพธ์ผิดตรงไหน แล้วค่อยๆ ปรับให้ดีขึ้น' },
];

export default async function CurriculumPage() {
  const chapters = await loadAllChapters();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl font-semibold mb-2">หลักสูตร</h1>
      <p className="text-fg-2 text-lg mb-8">
        เส้นทางเรียน AI เป็นภาษาคน ตั้งแต่ยังไม่รู้อะไรเลย จนใช้งานได้จริงในงานและธุรกิจ
      </p>

      {/* See → Say → Steer — the V-T-J framework */}
      <div className="rounded-lg border border-line bg-card p-6 md:p-7 mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.08em] text-fg-3 mb-5">
          วิธีคิดของเรา · See → Say → Steer
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {VTJ.map(v => (
            <div key={v.step}>
              <div className="font-display text-xl text-fg-1">{v.step}</div>
              <div className="text-xs font-medium text-teal-600 mb-2">{v.name}</div>
              <p className="font-thai text-sm leading-relaxed text-fg-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {LEVELS.map(level => {
        const items = chapters.filter(c => c.level === level);
        const meta = LEVEL_META[level];
        return (
          <section key={level} id={level} className="mb-12 scroll-mt-20">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-3 py-1 text-sm font-medium"
                style={{ fontFamily: 'var(--font-thai)' }}
              >
                <span
                  className="font-mono text-[10px] font-semibold text-white rounded-full px-1.5 py-0.5 leading-none"
                  style={{ background: meta.color }}
                >
                  L{meta.order}
                </span>
                {meta.label_th}
              </span>
              <span className="text-sm text-fg-3">{items.length} บท</span>
            </div>
            <p className="text-sm text-fg-3 mb-4 pl-1">{meta.tagline_th}</p>

            <ul className="space-y-2">
              {items.map((c, idx) => (
                <li
                  key={c.slug}
                  className="flex items-center gap-4 rounded-md border border-line bg-card py-3 pr-4 transition-colors hover:border-line-strong"
                  style={{ borderLeft: `3px solid ${meta.color}` }}
                >
                  <span
                    className="font-mono text-sm font-semibold tabular-nums w-9 text-center shrink-0"
                    style={{ color: meta.color }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Link
                    href={`/${level}/${c.slug}`}
                    className="font-thai flex-1 min-w-0 hover:text-teal-600 transition-colors"
                  >
                    {c.title}
                  </Link>
                  <StatusBadge status={c.status} />
                </li>
              ))}
              {items.length === 0 && (
                <li className="text-fg-3 italic pl-4 py-2">เร็วๆ นี้</li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
