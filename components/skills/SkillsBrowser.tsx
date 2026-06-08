'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SkillType } from '@/lib/content/skills';

export type SkillCard = {
  name: string;
  slug: string;
  repo: string;
  type: SkillType;
  tagline: string;
  tags: string[];
  commandCount: number;
  stars: number | null;
};

export type TypeInfo = { key: SkillType; label: string; blurb: string };

type SortKey = 'stars' | 'name';

function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  const rounded = k >= 100 ? Math.round(k) : Math.round(k * 10) / 10;
  return `${rounded}k`;
}

function StarBadge({ stars }: { stars: number | null }) {
  if (stars == null) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-[#F4F1E9] px-2.5 py-0.5 text-[13px] font-semibold text-[#00143C] tabular-nums"
      title={`${stars.toLocaleString()} stars บน GitHub`}
    >
      <span className="text-[#14B5AB] leading-none">★</span>
      {formatStars(stars)}
    </span>
  );
}

function Card({ s }: { s: SkillCard }) {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-[#E8E2D4] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[20px] leading-[1.3] font-semibold text-[#00143C]">{s.name}</h3>
        <StarBadge stars={s.stars} />
      </div>
      <p className="text-[15px] leading-[1.7] text-[#00143C]/80 mb-4">{s.tagline}</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {s.commandCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[12px] px-2.5 py-0.5 rounded-full bg-[#00143C]/[0.06] text-[#00143C]/70 font-medium">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            {s.commandCount} คำสั่ง
          </span>
        )}
        {s.tags.map(t => (
          <span
            key={t}
            className="text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82]"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-4">
        <Link
          href={`/skills/${s.slug}`}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#14B5AB] hover:text-[#006B7A] no-underline transition-colors"
        >
          อ่านวิธีใช้
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
        <a
          href={s.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] text-[#00143C]/50 hover:text-[#00143C] no-underline transition-colors"
        >
          GitHub
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
}

export default function SkillsBrowser({
  items,
  types,
}: {
  items: SkillCard[];
  types: TypeInfo[];
}) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'all' | SkillType>('all');
  const [sort, setSort] = useState<SortKey>('stars');

  const q = query.trim().toLowerCase();

  const sortItems = useMemo(() => {
    return (arr: SkillCard[]) =>
      [...arr].sort((a, b) =>
        sort === 'stars'
          ? (b.stars ?? -1) - (a.stars ?? -1)
          : a.name.localeCompare(b.name),
      );
  }, [sort]);

  const matches = (s: SkillCard) =>
    (activeType === 'all' || s.type === activeType) &&
    (q === '' ||
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)));

  const filtered = items.filter(matches);
  const flat = q !== '' || activeType !== 'all';

  return (
    <div>
      {/* Control bar */}
      <div className="sticky top-[48px] z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-[#fbf9f4]/90 backdrop-blur border-b border-[#E8E2D4] mb-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#00143C]/40">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ค้นหาเครื่องมือ…"
                aria-label="ค้นหาเครื่องมือ"
                className="w-full rounded-lg border border-[#E8E2D4] bg-white pl-10 pr-3 py-2 text-[15px] text-[#00143C] placeholder:text-[#00143C]/40 outline-none focus:border-[#14B5AB] transition-colors"
              />
            </div>
            <div className="inline-flex rounded-lg border border-[#E8E2D4] bg-white p-0.5 text-[13px]">
              {(['stars', 'name'] as SortKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    sort === k
                      ? 'bg-[#14B5AB] text-white'
                      : 'text-[#00143C]/60 hover:text-[#00143C]'
                  }`}
                >
                  {k === 'stars' ? 'ยอดนิยม' : 'ตามชื่อ'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={activeType === 'all'} onClick={() => setActiveType('all')}>
              ทั้งหมด <span className="opacity-60">{items.length}</span>
            </Chip>
            {types.map(t => {
              const count = items.filter(s => s.type === t.key).length;
              return (
                <Chip
                  key={t.key}
                  active={activeType === t.key}
                  onClick={() => setActiveType(t.key)}
                >
                  {t.label} <span className="opacity-60">{count}</span>
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-[#00143C]/50 italic py-8">ไม่พบเครื่องมือที่ตรงกับการค้นหา</p>
      ) : flat ? (
        <>
          <p className="text-[14px] text-[#00143C]/50 mb-5">พบ {filtered.length} เครื่องมือ</p>
          <div className="grid md:grid-cols-2 gap-5">
            {sortItems(filtered).map(s => (
              <Card key={s.slug} s={s} />
            ))}
          </div>
        </>
      ) : (
        types.map(t => {
          const group = sortItems(items.filter(s => s.type === t.key));
          if (group.length === 0) return null;
          return (
            <section key={t.key} className="mb-14">
              <h2 className="text-[24px] leading-[1.3] font-bold text-[#00143C] mb-1">
                {t.label} <span className="text-[#00143C]/40 font-medium">{group.length}</span>
              </h2>
              <p className="text-[15px] leading-[1.7] text-[#00143C]/60 mb-6">{t.blurb}</p>
              <div className="grid md:grid-cols-2 gap-5">
                {group.map(s => (
                  <Card key={s.slug} s={s} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[14px] px-4 py-1.5 rounded-full border font-medium transition-colors ${
        active
          ? 'bg-[#00143C] text-white border-[#00143C]'
          : 'bg-white text-[#00143C]/70 border-[#E8E2D4] hover:border-[#00143C]/30'
      }`}
    >
      {children}
    </button>
  );
}
