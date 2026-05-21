import Link from 'next/link';
import { loadAllChapters } from '@/lib/content/chapters';
import { LEVELS, LEVEL_META } from '@/lib/content/levels';

const STATUS_COLOR: Record<string, string> = {
  stub:     '#94896E',
  drafting: '#C18A2E',
  reviewed: '#14B5AB',
  stable:   '#2A7A3F',
};

export async function CurriculumSpine({ currentSlug }: { currentSlug?: string }) {
  const chapters = await loadAllChapters();

  return (
    <aside style={{
      width: 256,
      padding: "24px 14px 64px 18px",
      borderRight: "1px solid var(--line)",
      background: "var(--paper)",
      overflowY: "auto",
      height: "calc(100vh - 56px)",
      position: "sticky",
      top: 56,
    }}>
      {LEVELS.map(level => {
        const m = LEVEL_META[level];
        const items = chapters.filter(c => c.level === level);
        return (
          <div key={level} style={{ marginBottom: 22 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 10px 8px",
            }}>
              <span style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: m.color,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                fontWeight: 600,
              }}>{m.order}</span>
              <span style={{
                fontFamily: "var(--font-latin)",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--fg-2)",
              }}>{m.label}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map(c => {
                const on = currentSlug === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`/${level}/${c.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 10px 5px 12px",
                      borderRadius: 4,
                      borderLeft: on ? `2px solid ${m.color}` : "2px solid transparent",
                      marginLeft: -2,
                      background: on ? "var(--teal-50)" : "transparent",
                      color: on ? "var(--fg-1)" : "var(--fg-2)",
                      fontFamily: "var(--font-thai)",
                      fontSize: 13.5,
                      fontWeight: on ? 500 : 400,
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "background 140ms",
                    }}
                  >
                    <span style={{ flex: 1 }}>{c.title}</span>
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: STATUS_COLOR[c.status] ?? STATUS_COLOR.stub,
                        opacity: 0.7,
                        flexShrink: 0,
                      }}
                      title={c.status}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
