import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { isLevel, LEVEL_META, LEVELS } from '@/lib/content/levels';
import { StatusBadge } from '@/components/reader/StatusBadge';

export function generateStaticParams() {
  return LEVELS.map(level => ({ level }));
}

export default async function LevelIndex({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!isLevel(level)) notFound();
  const meta = LEVEL_META[level];
  const chapters = (await loadAllChapters()).filter(c => c.level === level);

  const idx = LEVELS.indexOf(level);
  const prev = idx > 0 ? LEVELS[idx - 1] : null;
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="font-thai text-sm text-fg-3 mb-6">
        <Link href="/curriculum" className="hover:text-teal-600">หลักสูตร</Link>
        <span className="mx-2">/</span>
        <span className="text-fg-2">{meta.label_th}</span>
      </nav>

      {/* Level hero */}
      <span
        className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-3 py-1 text-sm font-medium mb-4"
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
      <h1 className="font-display text-4xl font-semibold mb-3">{meta.label_th}</h1>
      <p className="text-fg-2 text-lg mb-4">{meta.tagline_th}</p>
      <div className="h-px w-full mb-8" style={{ background: meta.color, opacity: 0.5 }} />

      {/* Prerequisite note */}
      <div className="rounded-md border border-line px-4 py-3 mb-8 text-sm font-thai text-fg-2" style={{ background: 'var(--paper-2)' }}>
        <span className="text-fg-3">ก่อนเริ่มระดับนี้ · </span>
        {prev
          ? <>ควรอ่าน <Link href={`/${prev}`} className="text-teal-600 hover:underline">{LEVEL_META[prev].label_th}</Link> มาก่อน</>
          : 'ไม่ต้องมีพื้นฐานมาก่อน — เริ่มที่นี่ได้เลย'}
      </div>

      <ul className="space-y-2">
        {chapters.map((c, i) => (
          <li
            key={c.slug}
            className="flex items-center gap-4 rounded-md border border-line bg-card py-3 pr-4 transition-colors hover:border-line-strong"
            style={{ borderLeft: `3px solid ${meta.color}` }}
          >
            <span
              className="font-mono text-sm font-semibold tabular-nums w-9 text-center shrink-0"
              style={{ color: meta.color }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <Link
              href={`/${c.level}/${c.slug}`}
              className="font-thai flex-1 min-w-0 hover:text-teal-600 transition-colors"
            >
              {c.title}
            </Link>
            <StatusBadge status={c.status} />
          </li>
        ))}
        {chapters.length === 0 && (
          <li className="text-fg-3 italic pl-4 py-2">เร็วๆ นี้</li>
        )}
      </ul>

      {/* Prev / next level */}
      <div className="flex justify-between gap-4 mt-12 pt-6 border-t border-line">
        {prev ? (
          <Link href={`/${prev}`} className="font-thai text-sm group">
            <span className="block text-xs text-fg-3">ระดับก่อนหน้า</span>
            <span className="text-fg-1 group-hover:text-teal-600 transition-colors">← {LEVEL_META[prev].label_th}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/${next}`} className="font-thai text-sm text-right group">
            <span className="block text-xs text-fg-3">ระดับถัดไป</span>
            <span className="text-fg-1 group-hover:text-teal-600 transition-colors">{LEVEL_META[next].label_th} →</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
