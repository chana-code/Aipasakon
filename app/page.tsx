import Image from 'next/image';
import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVEL_META } from '@/lib/content/levels';
import { LevelChip } from '@/components/chrome/LevelChip';
import { StatusBadge } from '@/components/reader/StatusBadge';
import { HomeHoverCards } from '@/components/home/HomeHoverCards';

/** Strip basic markdown bold/italic wrappers for plain-text display */
function stripMd(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/_(.+?)_/g, '$1');
}

export default async function HomePage() {
  const allChapters = await loadAllChapters();

  /* Latest reviewed/stable chapters */
  const latest = allChapters
    .filter(c => c.status === 'reviewed' || c.status === 'stable')
    .sort((a, b) => (b.last_reviewed ?? '').localeCompare(a.last_reviewed ?? ''))
    .slice(0, 3);

  /* Chapter count per level */
  const levelCounts = Object.fromEntries(
    Object.entries(LEVEL_META).map(([key, m]) => [
      key,
      {
        total: allChapters.filter(c => c.level === key).length,
        reviewed: allChapters.filter(c => c.level === key && (c.status === 'reviewed' || c.status === 'stable')).length,
        color: m.color,
        label: m.label,
        order: m.order,
      },
    ])
  );

  return (
    <main style={{ background: "var(--bg-page)" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-4 md:px-7 pt-12 md:pt-[120px] pb-8 md:pb-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-center">
        <div>
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line-2)] bg-white mb-7 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-2)",
              letterSpacing: "0.03em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            ตำราเปิดอ่านฟรี · 24 บท · อัปเดตต่อเนื่อง
          </div>

          <h1
            className="m-0 text-[32px] md:text-[52px] leading-[1.1] font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.015em",
              color: "var(--fg-1)",
            }}
          >
            AI ไม่ยาก<br />
            <span style={{ color: "var(--teal-500)" }}>ถ้าพูดภาษาคน</span>
          </h1>

          <p
            className="mt-6 mb-0 max-w-[580px] text-base md:text-[19px] leading-[1.7]"
            style={{
              fontFamily: "var(--font-thai)",
              color: "var(--fg-2)",
            }}
          >
            ตำราเรียน AI ภาษาไทย สำหรับคนทำงาน — เขียนโดย{' '}
            <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>Ong</strong>
            , VP Commercial ที่ Fairdee. ไม่ใช่บล็อก ไม่ใช่ landing page — เป็น{' '}
            <em style={{ fontFamily: "var(--font-latin)" }}>reading experience</em>{' '}
            ของหลักสูตร 4 ระดับ ตั้งแต่{' '}
            <span style={{ color: "var(--teal-700)" }}>คนที่ไม่เคยรู้จัก AI เลย</span>
            {' '}ไปจนถึง{' '}
            <span style={{ color: "var(--teal-700)" }}>คนที่จะสร้างระบบ AI เองได้</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/foundations/what-is-an-llm" style={{
              fontFamily: "var(--font-thai)",
              fontSize: 15,
              fontWeight: 500,
              padding: "11px 22px",
              background: "var(--teal-500)",
              color: "#fff",
              border: 0,
              borderRadius: 4,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 140ms",
              textAlign: "center",
            }}>
              เริ่มอ่าน · Level 1
            </Link>
            <Link href="#curriculum" style={{
              fontFamily: "var(--font-thai)",
              fontSize: 15,
              fontWeight: 500,
              padding: "11px 22px",
              background: "transparent",
              color: "var(--fg-1)",
              border: "1px solid var(--line-2)",
              borderRadius: 4,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
            }}>
              ดูหลักสูตรทั้งหมด
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="w-[140px] h-[140px] md:w-[220px] md:h-[220px] mx-auto md:mx-0 order-first md:order-last flex-shrink-0 flex items-center justify-center">
          <Image
            src="/assets/logo-circular-full.png"
            alt=""
            width={220}
            height={220}
            priority
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.92 }}
          />
        </div>
      </section>

      {/* ── THREE DOORS ──────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-4 md:px-7 pt-4 pb-16">
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 16,
        }}>
          {/* Keep both texts so e2e test finds "เริ่มจากตรงนี้" */}
          <span>เริ่มจากตรงนี้</span>
          <span style={{ marginLeft: 10, opacity: 0.6 }}>· เลือกประตูที่ใช่</span>
        </div>
        <HomeHoverCards />
      </section>

      {/* ── CURRICULUM SPINE ──────────────────────────────── */}
      <section
        id="curriculum"
        className="px-4 md:px-7 py-12 md:py-[72px]"
        style={{
          background: "var(--paper-2)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-[1180px] mx-auto">
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginBottom: 12,
          }}>Curriculum · the four-level spine</div>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 600,
            color: "var(--fg-1)",
            letterSpacing: "-0.005em",
            maxWidth: 720,
            lineHeight: 1.2,
          }}>หลักสูตรเดียว, 4 ระดับ — เริ่มจากศูนย์ จบที่อ่าน paper ได้</h2>
          <p style={{
            margin: "16px 0 36px",
            fontFamily: "var(--font-thai)",
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--fg-2)",
            maxWidth: 680,
          }}>
            ทุกบทในตำรานี้ใช้โครงเดียวกัน:{' '}
            <strong style={{ color: "var(--fg-1)" }}>TL;DR → Surface → Deeper → Formal</strong>.
            {' '}คนที่ไม่เคยรู้จัก AI อ่าน Surface ก็พอ. คนที่มี background CS อ่าน Formal.{' '}
            <em style={{ fontFamily: "var(--font-latin)" }}>โน้ตเดียวกัน รับใช้คน 3 ระดับได้พร้อมกัน</em>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {Object.entries(LEVEL_META)
              .sort(([, a], [, b]) => a.order - b.order)
              .map(([key, m]) => {
                const counts = levelCounts[key] ?? { total: 0, reviewed: 0, color: m.color, label: m.label, order: m.order };
                const pct = counts.total > 0
                  ? Math.max(4, (counts.reviewed / counts.total) * 100)
                  : 4;
                return (
                  <Link key={key} href={`/${key}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      padding: "20px 20px 22px",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}>
                      <div style={{
                        position: "absolute",
                        left: 0, top: 0, bottom: 0,
                        width: 3,
                        background: m.color,
                      }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <span style={{
                          width: 26, height: 26,
                          borderRadius: 6,
                          background: m.color,
                          color: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}>{m.order}</span>
                        <span style={{
                          fontFamily: "var(--font-latin)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "var(--fg-3)",
                        }}>Level {m.order}</span>
                      </div>
                      <div style={{
                        fontFamily: "var(--font-thai)",
                        fontSize: 19,
                        fontWeight: 600,
                        color: "var(--fg-1)",
                        marginBottom: 6,
                      }}>{m.label}</div>
                      <div style={{
                        fontFamily: "var(--font-thai)",
                        fontSize: 13.5,
                        color: "var(--fg-3)",
                        marginBottom: 22,
                        lineHeight: 1.5,
                      }}>
                        {key === 'foundations' ? 'total beginner' :
                         key === 'using-ai' ? 'knowledge worker' :
                         key === 'building-with-ai' ? 'builder · engineer' :
                         'researcher · pro'}
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--fg-3)",
                      }}>
                        <span>{counts.total} notes</span>
                        <span>{counts.reviewed} reviewed</span>
                      </div>
                      <div style={{ marginTop: 6, height: 3, background: "var(--paper-2)", borderRadius: 999 }}>
                        <div style={{
                          height: 3,
                          width: `${pct}%`,
                          background: m.color,
                          borderRadius: 999,
                        }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── LATEST REVIEWED ──────────────────────────────── */}
      {latest.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-4 md:px-7 pt-12 md:pt-[72px] pb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-4 gap-2">
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg-3)",
                marginBottom: 6,
              }}>เพิ่งผ่านการ review</div>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 600,
                color: "var(--fg-1)",
              }}>
                โน้ตที่เพิ่งผ่าน{' '}
                <span style={{ color: "var(--teal-600)" }}>reviewed</span>
                {' '}ล่าสุด
              </h2>
            </div>
            <div style={{ fontFamily: "var(--font-thai)", fontSize: 13.5, color: "var(--fg-3)" }}>
              ไม่ใช่ blog feed — เป็นสัญญาณว่าตำรายังมีคนเขียนต่อ
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {latest.map(c => {
              const readMin = Math.ceil(c.body.length / 250);
              return (
                <Link key={c.slug} href={`/${c.level}/${c.slug}`} style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: "20px 22px",
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "block",
                  transition: "border-color 140ms",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <LevelChip level={c.level} size="sm" />
                    <StatusBadge status={c.status} />
                  </div>
                  <div style={{
                    fontFamily: "var(--font-thai)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    marginBottom: 8,
                    lineHeight: 1.35,
                  }}>{c.title}</div>
                  {c.tldr && (
                    <div style={{
                      fontFamily: "var(--font-thai)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--fg-2)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}>{stripMd(c.tldr)}</div>
                  )}
                  <div style={{
                    marginTop: 14,
                    display: "flex",
                    gap: 14,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-3)",
                  }}>
                    <span>{readMin} min read</span>
                    {c.last_reviewed && <span>updated {c.last_reviewed}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── WHY THIS EXISTS ──────────────────────────────── */}
      <section className="max-w-[760px] mx-auto px-4 md:px-7 pt-16 pb-20">
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}>ทำไมถึงเขียนตำราเล่มนี้</div>
        <p style={{
          fontFamily: "var(--font-thai)",
          fontSize: 18,
          lineHeight: 1.85,
          color: "var(--fg-1)",
          margin: 0,
        }}>
          ผม Ong — VP Commercial ที่ Fairdee ใน insurtech มา 7 ปี. AI กำลังเปลี่ยนวิธีทำงานของทุกคน
          แต่เนื้อหา AI ภาษาไทยที่ดี — เขียนจากคนที่เอาไปใช้จริงในธุรกิจ ไม่ใช่จาก hype account — ยังน้อยมาก.
          ตำราเล่มนี้คือสิ่งที่ผมอยากให้คนทำงานคนหนึ่งอ่านในปี 2026 — ตั้งแต่หน้าแรกจนจบ Level 4 — แล้วเข้าใจ AI
          พอจะคุย พอจะใช้ พอจะสร้าง — โดยไม่ต้องไปทน hype หรือ jargon ที่ไม่มีคนอธิบาย.
        </p>
        <p style={{
          fontFamily: "var(--font-thai)",
          fontSize: 14.5,
          lineHeight: 1.8,
          color: "var(--fg-3)",
          marginTop: 18,
          marginBottom: 0,
        }}>
          ไม่มี popup ขอ email · ไม่มีคอร์สขาย · ไม่ต้อง login.
          การอ่านคือทั้งหมดที่ตำรานี้เสนอ.
        </p>
      </section>

    </main>
  );
}
