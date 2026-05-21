import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';
import { DashboardCard } from '@/components/learn/DashboardCard';

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/learn');

  const chapters = await loadAllChapters();

  // Fetch bookmarks + completions in parallel
  const [bookmarksResult, completionsResult] = await Promise.all([
    supabase.from('user_bookmarks').select('chapter_slug').eq('user_id', user.id),
    supabase.from('user_completions').select('chapter_slug').eq('user_id', user.id),
  ]);

  const bookmarkedSlugs = new Set(
    (bookmarksResult.data ?? []).map((b: { chapter_slug: string }) => b.chapter_slug)
  );
  const completedSlugs = new Set(
    (completionsResult.data ?? []).map((c: { chapter_slug: string }) => c.chapter_slug)
  );

  const totalChapters = chapters.length;
  const completedCount = chapters.filter(c => completedSlugs.has(c.slug)).length;
  const bookmarkCount = bookmarkedSlugs.size;
  const progressPct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  const bookmarkedChapters = chapters.filter(c => bookmarkedSlugs.has(c.slug));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          margin: '0 0 6px',
          fontFamily: 'var(--font-thai)',
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--fg-1)',
        }}>
          แดชบอร์ด
        </h1>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-thai)',
          fontSize: 15,
          color: 'var(--fg-3)',
        }}>
          {user.email}
        </p>
      </div>

      {/* Progress stats */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 36,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 24,
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--teal-600)',
              lineHeight: 1,
            }}>
              {completedCount}
            </div>
            <div style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13,
              color: 'var(--fg-3)',
              marginTop: 4,
            }}>
              บทที่อ่านจบแล้ว
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--fg-2)',
              lineHeight: 1,
            }}>
              {totalChapters}
            </div>
            <div style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13,
              color: 'var(--fg-3)',
              marginTop: 4,
            }}>
              บทเรียนทั้งหมด
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--fg-2)',
              lineHeight: 1,
            }}>
              {bookmarkCount}
            </div>
            <div style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13,
              color: 'var(--fg-3)',
              marginTop: 4,
            }}>
              บุ๊กมาร์ก
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--fg-2)',
              lineHeight: 1,
            }}>
              {progressPct}%
            </div>
            <div style={{
              fontFamily: 'var(--font-thai)',
              fontSize: 13,
              color: 'var(--fg-3)',
              marginTop: 4,
            }}>
              ความก้าวหน้า
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 8,
          background: 'var(--line)',
          borderRadius: 999,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'var(--teal-600)',
            borderRadius: 999,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Bookmarked chapters */}
      {bookmarkedChapters.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            margin: '0 0 16px',
            fontFamily: 'var(--font-thai)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--fg-1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>★</span> บุ๊กมาร์กของคุณ
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}>
            {bookmarkedChapters.map(c => (
              <DashboardCard
                key={c.slug}
                slug={c.slug}
                title={c.title}
                level={c.level}
                status={c.status}
                isBookmarked={true}
                isCompleted={completedSlugs.has(c.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All chapters grouped by level */}
      {LEVELS.map(level => {
        const levelChapters = chapters.filter(c => c.level === level);
        if (levelChapters.length === 0) return null;
        const meta = LEVEL_META[level];

        return (
          <section key={level} style={{ marginBottom: 40 }}>
            <h2 style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-thai)',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--fg-1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: meta.color,
              }} />
              Level {meta.order} — {meta.label}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--fg-3)',
                fontWeight: 400,
              }}>
                ({levelChapters.filter(c => completedSlugs.has(c.slug)).length}/{levelChapters.length})
              </span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}>
              {levelChapters.map(c => (
                <DashboardCard
                  key={c.slug}
                  slug={c.slug}
                  title={c.title}
                  level={c.level}
                  status={c.status}
                  isBookmarked={bookmarkedSlugs.has(c.slug)}
                  isCompleted={completedSlugs.has(c.slug)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
