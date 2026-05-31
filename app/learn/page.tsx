import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';

// Per-level hex literals (from PORT-CONVENTIONS.md)
const LEVEL_HEX: Record<string, string> = {
  foundations:        '#14B5AB',
  'using-ai':         '#2D7CD6',
  'building-with-ai': '#B45A1A',
  advanced:           '#7A3FA0',
};

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/learn');

  const chapters = await loadAllChapters();

  const [bookmarksResult, completionsResult] = await Promise.all([
    supabase.from('user_bookmarks').select('chapter_slug').eq('user_id', user.id),
    supabase.from('user_completions').select('chapter_slug, completed_at').eq('user_id', user.id),
  ]);

  const bookmarkedSlugs = new Set(
    (bookmarksResult.data ?? []).map((b: { chapter_slug: string }) => b.chapter_slug)
  );
  const completedSlugs = new Set(
    (completionsResult.data ?? []).map((c: { chapter_slug: string }) => c.chapter_slug)
  );

  const totalChapters = chapters.length;
  const completedCount = chapters.filter(c => completedSlugs.has(c.slug)).length;
  const progressPct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  // Per-level chapter counts
  const levelStats = LEVELS.map(level => {
    const lvlChapters = chapters.filter(c => c.level === level);
    const lvlDone = lvlChapters.filter(c => completedSlugs.has(c.slug)).length;
    return { level, total: lvlChapters.length, done: lvlDone };
  });

  // Resume: first non-completed chapter (or most recently completed if all done)
  const resumeChapter = chapters.find(c => !completedSlugs.has(c.slug));

  // Bookmarked chapters
  const bookmarkedChapters = chapters.filter(c => bookmarkedSlugs.has(c.slug));

  // Completed chapters (most recent first by position in list, max shown = all)
  const completedChapters = chapters.filter(c => completedSlugs.has(c.slug));

  // Display name: prefer user metadata name, fall back to email prefix
  const displayName = (user.user_metadata?.full_name as string | undefined)
    ?? (user.email?.split('@')[0] ?? 'คุณ');

  return (
    <div className="pt-10 pb-20 px-6 max-w-[720px] mx-auto">

      {/* Greeting Header */}
      <header className="mb-10">
        <h1 className="font-['Noto_Serif_Thai',serif] text-[32px] leading-[1.2] font-bold text-[#00143C] mb-4">
          สวัสดี, {displayName} 👋
        </h1>
        <div className="flex flex-col gap-2">
          <p className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] text-[#00143C]/70">
            อ่านไปแล้ว {completedCount} บท จาก {totalChapters} บท
          </p>
          <div className="w-full h-1.5 bg-[#f0eee9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#14B5AB] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Curriculum Progress Strip */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levelStats.map(({ level, total, done }) => {
            const meta = LEVEL_META[level];
            const hex = LEVEL_HEX[level];
            const inactive = done === 0;
            return (
              <Link
                key={level}
                href={`/${level}`}
                className={`p-4 bg-white border border-[#E8E2D4] rounded-lg flex flex-col gap-1 no-underline transition-opacity hover:opacity-80${inactive ? ' opacity-60' : ''}`}
              >
                <span
                  className="font-['DM_Sans',sans-serif] text-[14px] font-bold uppercase tracking-wider"
                  style={{ color: hex }}
                >
                  {meta.label_th}
                </span>
                <span className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] font-semibold text-[#00143C]">
                  {done}/{total} บท
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* อ่านต่อ (Resume) Section */}
      {resumeChapter && (
        <section className="mb-12">
          <h2 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-6">
            อ่านต่อ
          </h2>
          <div className="bg-white border border-[#E8E2D4] p-8 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex flex-col gap-3">
                <span
                  className="inline-flex items-center px-3 py-1 font-['DM_Sans',sans-serif] text-[14px] font-bold rounded-full w-fit"
                  style={{
                    background: `${LEVEL_HEX[resumeChapter.level]}1a`,
                    color: LEVEL_HEX[resumeChapter.level],
                  }}
                >
                  {LEVEL_META[resumeChapter.level].label_th}
                </span>
                <h3 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C]">
                  {resumeChapter.title}
                </h3>
                {resumeChapter.tldr && (
                  <p className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] text-[#00143C]/70 max-w-md">
                    {resumeChapter.tldr}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href={`/${resumeChapter.level}/${resumeChapter.slug}`}
                className="bg-[#14B5AB] text-white font-['DM_Sans',sans-serif] text-[14px] font-bold px-8 py-3 rounded hover:bg-[#0e9a91] transition-all flex items-center gap-2 no-underline"
              >
                อ่านต่อ <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ที่คั่นไว้ (Bookmarks) Section */}
      {bookmarkedChapters.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C]">
              ที่คั่นไว้
            </h2>
            <Link
              href="/curriculum"
              className="text-[#14B5AB] font-['DM_Sans',sans-serif] text-[14px] font-bold hover:underline no-underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarkedChapters.map(c => {
              const hex = LEVEL_HEX[c.level];
              return (
                <Link
                  key={c.slug}
                  href={`/${c.level}/${c.slug}`}
                  className="group relative bg-white border border-[#E8E2D4] p-6 rounded-lg hover:border-[#14B5AB] transition-colors no-underline block"
                >
                  <div className="flex flex-col gap-3">
                    <span
                      className="inline-flex items-center px-3 py-1 font-['DM_Sans',sans-serif] text-[14px] font-bold rounded-full w-fit"
                      style={{ background: `${hex}1a`, color: hex }}
                    >
                      {LEVEL_META[c.level].label_th}
                    </span>
                    <h3 className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] font-bold text-[#00143C]">
                      {c.title}
                    </h3>
                    {c.tldr && (
                      <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]">
                        {c.tldr}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* อ่านจบแล้ว (Completed) Section */}
      {completedChapters.length > 0 && (
        <section>
          <h2 className="font-['Noto_Serif_Thai',serif] text-[28px] leading-[1.3] font-semibold text-[#00143C] mb-6">
            อ่านจบแล้ว
          </h2>
          <div className="bg-white border border-[#E8E2D4] rounded-lg overflow-hidden divide-y divide-[#E8E2D4]">
            {completedChapters.map(c => (
              <Link
                key={c.slug}
                href={`/${c.level}/${c.slug}`}
                className="p-5 flex justify-between items-center group hover:bg-[#fbf9f4] transition-colors no-underline"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#14B5AB]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <div>
                    <p className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] font-medium text-[#00143C]">
                      {c.title}
                    </p>
                    <p className="font-['DM_Sans',sans-serif] text-[14px] font-medium text-[#6c7a78]">
                      {LEVEL_META[c.level].label_th}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#6c7a78] opacity-0 group-hover:opacity-100 transition-opacity">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no activity yet */}
      {completedChapters.length === 0 && bookmarkedChapters.length === 0 && !resumeChapter && (
        <section className="text-center py-16">
          <p className="font-['DM_Sans',sans-serif] text-[16px] leading-[1.6] text-[#6c7a78]">
            ยังไม่มีกิจกรรม — เริ่มต้นอ่านบทแรกได้เลย
          </p>
          <Link
            href="/curriculum"
            className="inline-block mt-6 bg-[#14B5AB] text-white font-['DM_Sans',sans-serif] text-[14px] font-bold px-8 py-3 rounded hover:bg-[#0e9a91] transition-all no-underline"
          >
            ดูหลักสูตร
          </Link>
        </section>
      )}

    </div>
  );
}
