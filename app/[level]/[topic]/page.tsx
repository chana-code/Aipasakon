import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { loadAllChapters, loadChapter } from '@/lib/content/chapters';
import { isLevel, LEVEL_META } from '@/lib/content/levels';
import { CurriculumSpine } from '@/components/reader/CurriculumSpine';
import { MobileCurriculumDrawer } from '@/components/reader/MobileCurriculumDrawer';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { BookmarkButton } from '@/components/learn/BookmarkButton';
import { CompleteButton } from '@/components/learn/CompleteButton';
import DissectionLab from '@/components/lab/DissectionLabClient';
import Embed from '@/components/reader/Embed';

const SERIF = "font-['Noto_Serif_Thai',serif]";
const ARTICLE_ID = 'chapter-article';

export async function generateStaticParams() {
  const all = await loadAllChapters();
  return all.map(c => ({ level: c.level, topic: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ level: string; topic: string }>;
}) {
  const { level, topic } = await params;
  if (!isLevel(level)) notFound();

  let chapter;
  try { chapter = await loadChapter(level, topic); } catch { notFound(); }

  const m = LEVEL_META[chapter.level];
  const readMin = Math.max(1, Math.ceil(chapter.body.length / 900));

  /* Full chapter list — used for prev/next + prerequisite resolution */
  const all = await loadAllChapters();

  /* Prev / next within the same level (reading order = file order) */
  const sameLevel = all.filter(c => c.level === chapter.level);
  const idx = sameLevel.findIndex(c => c.slug === chapter.slug);
  const prev = idx > 0 ? sameLevel[idx - 1] : undefined;
  const next = idx >= 0 && idx < sameLevel.length - 1 ? sameLevel[idx + 1] : undefined;

  /* Resolve prerequisite titles (shown as related links) */
  const prereqItems = chapter.prerequisites
    .map(s => all.find(c => c.slug === s))
    .filter(Boolean)
    .map(c => ({ slug: c!.slug, title: c!.title, level: c!.level }));

  return (
    <div className="max-w-[1440px] mx-auto flex gap-8 px-6 pt-8">
      {/* LEFT: Curriculum spine (desktop only) */}
      <div className="hidden lg:block shrink-0">
        <CurriculumSpine chapters={all} currentSlug={chapter.slug} />
      </div>

      {/* CENTER: Article column (max 720px) */}
      <article id={ARTICLE_ID} className="flex-1 max-w-[720px] mx-auto min-w-0 pb-24">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap gap-2 text-sm text-[#00143C]/60 mb-8 font-['DM_Sans',sans-serif]">
          <Link href="/curriculum" className="hover:text-[#14B5AB] transition-colors">หลักสูตร</Link>
          <span>/</span>
          <Link href={`/${chapter.level}`} className="hover:text-[#14B5AB] transition-colors">{m.label_th}</Link>
          <span>/</span>
          <span className="text-[#00143C]">{chapter.title}</span>
        </nav>

        {/* Mobile curriculum drawer */}
        <MobileCurriculumDrawer>
          <CurriculumSpine chapters={all} currentSlug={chapter.slug} variant="mobile" />
        </MobileCurriculumDrawer>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span
              className="px-3 py-1 rounded text-xs font-bold"
              style={{ background: 'rgba(20,181,171,0.10)', color: 'var(--teal-600)' }}
            >
              Level {m.order} · {m.label_th}
            </span>
            <span className="text-[#00143C]/60 text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-base">schedule</span>
              อ่าน {readMin} นาที
            </span>
            {chapter.last_reviewed && (
              <span className="text-[#00143C]/50 text-xs hidden sm:inline">
                ทบทวนล่าสุด {chapter.last_reviewed}
              </span>
            )}
            {/* Bookmark + Complete actions (auth-gated; render only when signed in) */}
            <span className="flex items-center gap-2 ml-auto">
              <BookmarkButton chapterSlug={chapter.slug} />
              <CompleteButton chapterSlug={chapter.slug} />
            </span>
          </div>
          <h1 className={`${SERIF} text-[32px] md:text-[40px] leading-[1.2] font-bold mb-3 text-[#00143C]`}>
            {chapter.title}
          </h1>
        </div>

        {/* TL;DR box — Teacher's Mark (yellow) */}
        {chapter.tldr && (
          <section
            id="tldr"
            className="p-6 rounded-r-lg mb-10"
            style={{
              background: 'var(--mark-bg)',
              borderLeft: '3px solid var(--mark)',
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 font-bold uppercase tracking-wider text-sm"
              style={{ color: 'var(--mark)' }}
            >
              <span className="material-symbols-outlined">stars</span>
              <span>TL;DR</span>
            </div>
            <div
              className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[#00143C]"
              style={{ fontSize: 16.5, lineHeight: 1.8 }}
            >
              <MDXRemote source={chapter.tldr} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </section>
        )}

        {/* Article body (MDX) */}
        <div
          className="prose-chapter font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[#00143C]"
          style={{ fontSize: 16.5, lineHeight: 1.85 }}
        >
          <MDXRemote source={chapter.body} components={{ DissectionLab, Embed }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        {/* Related links (from prerequisites) */}
        {prereqItems.length > 0 && (
          <section className="mt-12">
            <h4 className="font-bold text-sm text-[#00143C]/60 uppercase mb-4 tracking-widest font-['DM_Sans',sans-serif]">
              ลิงก์ที่เกี่ยวข้อง
            </h4>
            <div className="flex flex-wrap gap-2">
              {prereqItems.map(p => (
                <Link
                  key={p.slug}
                  href={`/${p.level}/${p.slug}`}
                  className="px-4 py-2 bg-[#eae8e3] rounded-full text-sm text-[#00143C] hover:bg-[#14B5AB] hover:text-white transition-all"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / next navigation */}
        {(prev || next) && (
          <nav className="flex justify-between items-center mt-16 pt-8 border-t border-[#E8E2D4] gap-4">
            {prev ? (
              <Link
                href={`/${prev.level}/${prev.slug}`}
                className="flex items-center gap-2 text-[#00143C]/70 hover:text-[#14B5AB] transition-colors group min-w-0"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform shrink-0">arrow_back</span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase opacity-60 font-['DM_Sans',sans-serif]">ก่อนหน้า</span>
                  <span className="block font-bold truncate">{prev.title}</span>
                </span>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                href={`/${next.level}/${next.slug}`}
                className="flex items-center gap-2 text-right text-[#00143C]/70 hover:text-[#14B5AB] transition-colors group min-w-0"
              >
                <span className="min-w-0">
                  <span className="block text-xs uppercase opacity-60 font-['DM_Sans',sans-serif]">ถัดไป</span>
                  <span className="block font-bold truncate">{next.title}</span>
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">arrow_forward</span>
              </Link>
            ) : <span />}
          </nav>
        )}
      </article>

      {/* RIGHT: Table of contents (xl only) */}
      <aside className="sticky top-[5rem] w-[220px] h-fit hidden xl:block shrink-0">
        <h4 className="font-bold text-xs text-[#00143C]/60 uppercase mb-4 tracking-widest border-b border-[#E8E2D4] pb-2 font-['DM_Sans',sans-serif]">
          สารบัญ
        </h4>
        <TableOfContents articleId={ARTICLE_ID} />
      </aside>
    </div>
  );
}
