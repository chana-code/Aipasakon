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
        (e.term_th ?? '').toLowerCase().includes(s) ||
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
      <div className="sticky top-[72px] z-10 mb-9">
        <div className="flex items-center gap-3 bg-white border border-[#E8E2D4] rounded-full px-5 py-3 shadow-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c7a78"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="กรองคำศัพท์ · transformer, RAG, embedding…"
            className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[#00143C] placeholder:text-[#6c7a78]"
          />
          <span className="text-[13px] text-[#6c7a78] tabular-nums whitespace-nowrap">
            {total} entries
          </span>
        </div>
      </div>

      {/* Grouped entries */}
      <div className="flex flex-col gap-10">
        {grouped.map(([letter, items]) => (
          <section key={letter}>

            {/* Letter heading */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2D4]">
              <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#f5f3ee] border border-[#E8E2D4] text-[14px] font-semibold text-[#00143C]">
                {letter}
              </span>
              <span className="text-[13px] text-[#6c7a78]">
                {items.length} {items.length === 1 ? 'term' : 'terms'}
              </span>
            </div>

            {/* Term rows */}
            <div className="flex flex-col rounded-xl border border-[#E8E2D4] bg-white overflow-hidden">
              {items.map((e, idx) => (
                <div
                  key={e.term_en}
                  className={`flex flex-col gap-1 md:grid md:grid-cols-[200px_1fr_auto] md:gap-6 md:items-baseline px-5 py-4${idx < items.length - 1 ? ' border-b border-[#E8E2D4]' : ''}`}
                >
                  {/* Term name */}
                  <div>
                    <div className="text-[15px] font-semibold text-[#00143C] leading-snug">
                      {e.term_en}
                    </div>
                    {e.term_th && (
                      <div className="text-[13px] text-[#6c7a78] mt-0.5">
                        {e.term_th}
                      </div>
                    )}
                  </div>

                  {/* Definition */}
                  <div className="text-[15px] leading-[1.75] text-[#00143C]">
                    {e.definition_th}
                    {e.full_chapter && (
                      <Link
                        href={e.full_chapter}
                        className="inline md:hidden ml-2 text-[13px] text-[#14B5AB] hover:text-[#006B7A] transition-colors whitespace-nowrap no-underline"
                      >
                        บทเต็ม →
                      </Link>
                    )}
                  </div>

                  {/* บทเต็ม link (desktop) */}
                  <div className="hidden md:flex items-center">
                    {e.full_chapter && (
                      <Link
                        href={e.full_chapter}
                        className="text-[13px] font-medium text-[#14B5AB] hover:text-[#006B7A] transition-colors whitespace-nowrap no-underline"
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

        {grouped.length === 0 && (
          <div className="text-center py-16 text-[15px] text-[#6c7a78]">
            ไม่พบคำที่ค้นหา
          </div>
        )}
      </div>
    </>
  );
}
