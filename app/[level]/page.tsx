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

  return (
    <div className="mx-auto max-w-prose px-6 py-12">
      <h1 className="font-thai text-3xl font-semibold mb-3" style={{ color: meta.color }}>
        {meta.label}
      </h1>
      <p className="text-fg-2 mb-8">ระดับที่ {meta.order} — รายการบทในหลักสูตร</p>
      <ul className="space-y-3">
        {chapters.map(c => (
          <li key={c.slug} className="flex items-center justify-between border-b border-line pb-3">
            <Link href={`/${c.level}/${c.slug}`} className="font-thai text-lg hover:text-teal-600">
              {c.title}
            </Link>
            <StatusBadge status={c.status} />
          </li>
        ))}
        {chapters.length === 0 && (
          <p className="text-fg-3 italic">ยังไม่มีบทในระดับนี้</p>
        )}
      </ul>
    </div>
  );
}
