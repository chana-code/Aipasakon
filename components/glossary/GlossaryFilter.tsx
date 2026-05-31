'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { GlossaryEntry } from '@/lib/content/schemas';

export function GlossaryFilter({ entries }: { entries: GlossaryEntry[] }) {
  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    const filtered = entries.filter(e => {
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        e.term_en.toLowerCase().includes(s) ||
        e.definition_th.toLowerCase().includes(s)
      );
    });
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of filtered) {
      const letter = (e.term_en[0] ?? '#').toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(e);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [q, entries]);

  const total = grouped.reduce((sum, [, items]) => sum + items.length, 0);

  return (
    <>
      {/* Sticky search bar */}
      <div style={{ position: "sticky", top: 72, zIndex: 5, marginBottom: 36 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: "1px solid var(--line-2)",
          borderRadius: 6,
          padding: "11px 14px",
        }}>
          <span style={{ color: "var(--fg-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="กรองคำศัพท์ · transformer, RAG, embedding…"
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              fontFamily: "var(--font-thai)",
              fontSize: 15.5,
              color: "var(--fg-1)",
              background: "transparent",
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)" }}>
            {total} entries
          </span>
        </div>
      </div>

      {/* Grouped entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {grouped.map(([letter, items]) => (
          <section key={letter}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14,
              paddingBottom: 8,
              borderBottom: "1px solid var(--line)",
            }}>
              <span style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--fg-1)",
              }}>{letter}</span>
              <span style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "var(--fg-3)" }}>
                {items.length} {items.length === 1 ? 'term' : 'terms'}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {items.map(e => (
                <div key={e.term_en} className="flex flex-col gap-1 md:grid md:grid-cols-[200px_1fr_auto] md:gap-6 md:items-baseline py-4 border-b" style={{ borderColor: "var(--line-ink)" }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-latin)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--fg-1)",
                    }}>{e.term_en}</div>
                    {e.term_th && (
                      <div style={{
                        fontFamily: "var(--font-thai)",
                        fontSize: 12.5,
                        color: "var(--fg-3)",
                        marginTop: 2,
                      }}><i>{e.term_th}</i></div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-thai)",
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "var(--fg-1)",
                  }}>
                    {e.definition_th}
                    {e.see_also.length > 0 && (
                      <Link
                        href={`/glossary#${e.term_en.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline md:hidden ml-2"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11.5,
                          color: "var(--teal-600)",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        บทเต็ม →
                      </Link>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {e.see_also.length > 0 && (
                      <Link
                        href={`/glossary#${e.term_en.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11.5,
                          color: "var(--teal-600)",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        บทเต็ม →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
