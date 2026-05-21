import Link from 'next/link';
import { loadAllVideos } from '@/lib/content/videos';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';
import { LevelChip } from '@/components/chrome/LevelChip';

export default async function VideosIndex() {
  const videos = await loadAllVideos();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-thai text-3xl font-semibold mb-2">วิดีโอ</h1>
      <p className="text-fg-2 mb-10">เนื้อหาเสริมแบบวิดีโอ จัดเรียงตามระดับของหลักสูตร</p>

      {LEVELS.map(level => {
        const items = videos.filter(v => v.level === level);
        if (items.length === 0) return null;
        return (
          <section key={level} className="mb-10">
            <h2 className="font-thai text-xl font-medium mb-4" style={{ color: LEVEL_META[level].color }}>
              {LEVEL_META[level].label}
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {items.map(v => (
                <li key={v.slug}>
                  <Link href={`/videos/${v.slug}`} className="block rounded-lg border border-line bg-white p-5 hover:bg-teal-50 transition-colors duration-150 ease-calm">
                    <div className="flex items-center gap-2 mb-2">
                      <LevelChip level={v.level} />
                    </div>
                    <h3 className="font-thai font-medium text-navy-900">{v.title}</h3>
                    {v.description && <p className="text-sm text-fg-2 mt-2">{v.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {videos.length === 0 && <p className="text-fg-3 italic">ยังไม่มีวิดีโอ</p>}
    </div>
  );
}
