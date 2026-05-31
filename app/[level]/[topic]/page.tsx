import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadAllChapters, loadChapter } from '@/lib/content/chapters';
import { isLevel, LEVEL_META } from '@/lib/content/levels';
import { CurriculumSpine } from '@/components/reader/CurriculumSpine';
import { MobileCurriculumDrawer } from '@/components/reader/MobileCurriculumDrawer';
import { DepthToggle } from '@/components/reader/DepthToggle';
import { StatusBadge } from '@/components/reader/StatusBadge';
import { LevelChip } from '@/components/chrome/LevelChip';
import { BookmarkButton } from '@/components/learn/BookmarkButton';
import { CompleteButton } from '@/components/learn/CompleteButton';
import Link from 'next/link';

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
  const readMin = Math.ceil(chapter.body.length / 250);

  /* Resolve prerequisite titles */
  let prereqItems: { slug: string; title: string; level: string }[] = [];
  if (chapter.prerequisites.length > 0) {
    const all = await loadAllChapters();
    prereqItems = chapter.prerequisites
      .map(s => all.find(c => c.slug === s))
      .filter(Boolean)
      .map(c => ({ slug: c!.slug, title: c!.title, level: c!.level }));
  }

  return (
    <div className="grid lg:grid-cols-[256px_minmax(0,1fr)] max-w-[1280px] mx-auto">
      {/* Left rail — curriculum spine (desktop only) */}
      <div className="hidden lg:block">
        <CurriculumSpine currentSlug={chapter.slug} />
      </div>

      {/* Main article */}
      <article
        id="chapter-article"
        data-depth="surface"
        className="px-4 md:px-8 lg:px-14 pt-8 lg:pt-10 pb-16 lg:pb-20 min-w-0"
      >
        {/* Breadcrumb */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          color: "var(--fg-3)",
          marginBottom: 16,
          letterSpacing: "0.02em",
        }}>
          Level {m.order} — {m.label}
          <span style={{ margin: "0 6px", opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--fg-2)" }}>{chapter.title}</span>
        </div>

        {/* Mobile curriculum drawer */}
        <MobileCurriculumDrawer>
          <CurriculumSpine currentSlug={chapter.slug} variant="mobile" />
        </MobileCurriculumDrawer>

        {/* H1 */}
        <h1
          className="text-[28px] md:text-[36px] lg:text-[44px]"
          style={{
            margin: "0 0 14px",
            fontFamily: "var(--font-display)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            fontWeight: 600,
            color: "var(--fg-1)",
          }}
        >{chapter.title}</h1>

        {/* Meta row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 32,
        }}>
          <LevelChip level={chapter.level} />
          <StatusBadge status={chapter.status} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)" }}>
            {readMin} min read
            {chapter.last_reviewed && ` · last reviewed ${chapter.last_reviewed}`}
          </span>
        </div>

        {/* Bookmark + Complete actions */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 32,
        }}>
          <BookmarkButton chapterSlug={chapter.slug} />
          <CompleteButton chapterSlug={chapter.slug} />
        </div>

        {/* TL;DR box */}
        {chapter.tldr && (
          <section id="tldr" style={{
            padding: "20px 22px",
            background: "var(--mark-bg, #FDF6E0)",
            border: "1px solid var(--mark-border, #E8D9A0)",
            borderLeft: "3px solid var(--mark, #E8C547)",
            borderRadius: 6,
            margin: "0 0 36px",
          }}>
            <div style={{
              fontFamily: "var(--font-latin)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--navy-800)",
              marginBottom: 6,
            }}>TL;DR</div>
            <div style={{
              margin: 0,
              fontFamily: "var(--font-thai)",
              fontSize: 16.5,
              lineHeight: 1.8,
              color: "var(--fg-1)",
            }}>
              <MDXRemote source={chapter.tldr} />
            </div>
          </section>
        )}

        {/* Prerequisites */}
        {prereqItems.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h3 style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-thai)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--fg-1)",
            }}>Prerequisites</h3>
            <ul style={{
              paddingLeft: 20,
              margin: 0,
              color: "var(--fg-2)",
              fontFamily: "var(--font-thai)",
              fontSize: 15.5,
              lineHeight: 1.85,
            }}>
              {prereqItems.map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.level}/${p.slug}`}
                    style={{ color: "var(--teal-600)", textDecoration: "none" }}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Depth toggle */}
        <section id="depth" style={{ marginBottom: 32 }}>
          <DepthToggle targetId="chapter-article" />
        </section>

        {/* MDX body */}
        <div className="prose-chapter" style={{
          fontFamily: "var(--font-thai)",
          fontSize: 16.5,
          lineHeight: 1.85,
          color: "var(--fg-1)",
        }}>
          <MDXRemote source={chapter.body} />
        </div>
      </article>
    </div>
  );
}
