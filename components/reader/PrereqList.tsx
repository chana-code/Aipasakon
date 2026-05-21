import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';

export async function PrereqList({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  const all = await loadAllChapters();
  const items = slugs.map(s => all.find(c => c.slug === s)).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <aside className="my-6 rounded-md border border-line bg-white p-4 text-sm">
      <p className="text-fg-3 mb-2">ก่อนอ่านบทนี้ ควรอ่าน:</p>
      <ul className="space-y-1">
        {items.map(c => (
          <li key={c!.slug}>
            <Link href={`/${c!.level}/${c!.slug}`} className="text-teal-600 hover:text-teal-700">
              {c!.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
