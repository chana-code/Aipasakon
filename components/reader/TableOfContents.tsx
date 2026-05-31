'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

function slugify(text: string, index: number): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
  return base ? `${base}` : `section-${index}`;
}

/**
 * Scroll-spy Table of Contents for the chapter reading page.
 * Scans the rendered MDX article for h2/h3 headings, assigns ids where
 * missing, builds the TOC, and highlights the section currently in view.
 *
 * `articleId` is the id of the container whose headings should be tracked.
 */
export function TableOfContents({ articleId }: { articleId: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const root = document.getElementById(articleId);
    if (!root) return;

    const headings = Array.from(
      root.querySelectorAll<HTMLHeadingElement>('h2, h3'),
    );
    const seen = new Set<string>();
    const next: TocItem[] = headings.map((h, i) => {
      const text = h.textContent?.trim() ?? '';
      let id = h.id;
      if (!id) {
        id = slugify(text, i);
        // Ensure uniqueness
        let candidate = id;
        let n = 1;
        while (seen.has(candidate)) candidate = `${id}-${n++}`;
        id = candidate;
        h.id = id;
      }
      seen.add(id);
      // offset for the fixed nav so anchored headings aren't hidden
      h.style.scrollMarginTop = '88px';
      return { id, text, level: h.tagName === 'H3' ? 3 : 2 };
    });
    setItems(next);

    if (next.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) {
          setActiveId(first.target.id);
        }
      },
      {
        // trigger when heading is in the top portion of the viewport
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      },
    );

    headings.forEach((h) => observer.observe(h));
    setActiveId(next[0]?.id ?? '');

    return () => observer.disconnect();
  }, [articleId]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="สารบัญ"
      className="space-y-1 text-sm"
    >
      {items.map((item) => {
        const on = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveId(item.id);
                history.replaceState(null, '', `#${item.id}`);
              }
            }}
            className="block transition-all"
            style={{
              paddingLeft: item.level === 3 ? 22 : 12,
              borderLeft: `2px solid ${on ? 'var(--teal-500)' : 'transparent'}`,
              color: on ? 'var(--teal-600)' : 'var(--fg-3)',
              fontWeight: on ? 700 : 400,
              fontFamily: 'var(--font-thai)',
              fontSize: item.level === 3 ? 12.5 : 13.5,
              lineHeight: 1.5,
              paddingTop: 4,
              paddingBottom: 4,
              textDecoration: 'none',
            }}
          >
            {item.text}
          </a>
        );
      })}
    </nav>
  );
}
