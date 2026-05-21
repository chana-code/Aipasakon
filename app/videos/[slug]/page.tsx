import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadAllVideos, loadVideo } from '@/lib/content/videos';
import { loadAllChapters } from '@/lib/content/chapters';
import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import { LevelChip } from '@/components/chrome/LevelChip';

export async function generateStaticParams() {
  const videos = await loadAllVideos();
  return videos.map(v => ({ slug: v.slug }));
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let video;
  try { video = await loadVideo(slug); } catch { notFound(); }

  const chapters = await loadAllChapters();
  const linked = video.linked_chapter_slugs
    .map(s => chapters.find(c => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <div className="mx-auto max-w-prose px-6 py-12">
      <div className="mb-4"><LevelChip level={video.level} /></div>
      <h1 className="font-thai text-3xl font-semibold mb-6">{video.title}</h1>
      <YouTubeEmbed id={video.youtube_id} title={video.title} />
      {video.description && <p className="mt-6 text-fg-2 leading-relaxed">{video.description}</p>}

      {linked.length > 0 && (
        <aside className="mt-10 border-t border-line pt-6">
          <p className="text-fg-3 mb-3 text-sm">บทที่เกี่ยวข้อง:</p>
          <ul className="space-y-2">
            {linked.map(c => (
              <li key={c.slug}>
                <Link href={`/${c.level}/${c.slug}`} className="text-teal-600 hover:text-teal-700">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
