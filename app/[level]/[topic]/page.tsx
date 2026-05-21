import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadAllChapters, loadChapter } from '@/lib/content/chapters';
import { isLevel, LEVEL_META } from '@/lib/content/levels';
import { CurriculumSpine } from '@/components/reader/CurriculumSpine';
import { DepthToggle } from '@/components/reader/DepthToggle';
import { StatusBadge } from '@/components/reader/StatusBadge';
import { PrereqList } from '@/components/reader/PrereqList';
import { LevelChip } from '@/components/chrome/LevelChip';

export async function generateStaticParams() {
  const all = await loadAllChapters();
  return all.map(c => ({ level: c.level, topic: c.slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ level: string; topic: string }> }) {
  const { level, topic } = await params;
  if (!isLevel(level)) notFound();
  let chapter;
  try { chapter = await loadChapter(level, topic); } catch { notFound(); }

  return (
    <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[240px_1fr] gap-10 py-12">
      <aside className="hidden md:block">
        <CurriculumSpine currentSlug={chapter.slug} />
      </aside>
      <article id="chapter-article" data-depth="surface" className="max-w-prose">
        <div className="flex items-center gap-3 mb-3 text-sm">
          <LevelChip level={chapter.level} />
          <StatusBadge status={chapter.status} />
          {chapter.last_reviewed && <span className="text-fg-3">ทบทวนล่าสุด {chapter.last_reviewed}</span>}
        </div>
        <h1 className="font-thai text-3xl md:text-4xl font-semibold leading-tight mb-2" style={{ color: LEVEL_META[chapter.level].color }}>
          {chapter.title}
        </h1>
        {chapter.tldr && <p className="text-fg-2 text-lg mt-3">{chapter.tldr}</p>}
        <PrereqList slugs={chapter.prerequisites} />
        <div className="mt-6 mb-8">
          <DepthToggle targetId="chapter-article" />
        </div>
        <div className="prose prose-thai">
          <MDXRemote source={chapter.body} />
        </div>
      </article>
    </div>
  );
}
