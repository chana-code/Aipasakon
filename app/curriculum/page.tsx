import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';
import { StatusBadge } from '@/components/reader/StatusBadge';

export default async function CurriculumPage() {
  const chapters = await loadAllChapters();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-thai text-3xl font-semibold mb-2">หลักสูตร</h1>
      <p className="text-fg-2 mb-10">สี่ระดับ — จากยังไม่รู้จัก AI จนถึงเข้าใจกลไกในระดับลึก</p>

      {LEVELS.map(level => {
        const items = chapters.filter(c => c.level === level);
        const meta = LEVEL_META[level];
        return (
          <section key={level} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-thai text-xl font-medium" style={{ color: meta.color }}>
                {meta.order}. {meta.label}
              </h2>
              <span className="text-sm text-fg-3">{items.length} บท</span>
            </div>
            <ul className="space-y-2">
              {items.map(c => (
                <li key={c.slug} className="flex items-center justify-between border-l-2 pl-4 py-1"
                    style={{ borderColor: meta.color }}>
                  <Link href={`/${level}/${c.slug}`} className="font-thai hover:text-teal-600">
                    {c.title}
                  </Link>
                  <StatusBadge status={c.status} />
                </li>
              ))}
              {items.length === 0 && <li className="text-fg-3 italic pl-4">ยังไม่มีบท</li>}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
