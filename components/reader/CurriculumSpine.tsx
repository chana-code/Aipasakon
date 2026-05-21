import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';

export async function CurriculumSpine({ currentSlug }: { currentSlug?: string }) {
  const chapters = await loadAllChapters();
  return (
    <nav aria-label="หลักสูตร" className="text-sm">
      {LEVELS.map(level => {
        const items = chapters.filter(c => c.level === level);
        return (
          <div key={level} className="mb-6">
            <h3 className="font-thai font-medium mb-2" style={{ color: LEVEL_META[level].color }}>
              {LEVEL_META[level].label}
            </h3>
            <ul className="space-y-1">
              {items.map(c => (
                <li key={c.slug}>
                  <Link
                    href={`/${level}/${c.slug}`}
                    className={`block hover:text-teal-600 ${currentSlug === c.slug ? 'font-medium text-navy-900' : 'text-fg-2'}`}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
