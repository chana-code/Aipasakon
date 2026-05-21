import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LevelChip } from '@/components/chrome/LevelChip';

export async function LatestReviewed() {
  const all = await loadAllChapters();
  const recent = all
    .filter(c => c.status === 'reviewed' || c.status === 'stable')
    .sort((a, b) => (b.last_reviewed ?? '').localeCompare(a.last_reviewed ?? ''))
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-prose px-6 pb-24">
      <h2 className="font-thai text-xl mb-4 text-fg-2">บทล่าสุดที่ผ่านการทบทวนแล้ว</h2>
      <ul className="space-y-3">
        {recent.map(c => (
          <li key={c.slug}>
            <Link href={`/${c.level}/${c.slug}`} className="flex items-center justify-between border-b border-line pb-2 hover:text-teal-600">
              <span className="font-thai">{c.title}</span>
              <LevelChip level={c.level} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
