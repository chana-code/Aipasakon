import type { GlossaryEntry } from '@/lib/content/schemas';

// Only these levels have deployed chapters; links elsewhere are dropped to avoid 404s.
const DEPLOYED_LEVELS = new Set(['what-is-ai', 'products']);

/** "../section-2-products/2.1.1-the-model.md" -> "/products/the-model" (or undefined). */
function linkToRoute(linkPath: string): string | undefined {
  const m = linkPath.match(/section-\d+-([a-z-]+)\/([^/]+)\.md$/);
  if (!m || !m[1] || !m[2]) return undefined;
  const level = m[1];
  if (!DEPLOYED_LEVELS.has(level)) return undefined;
  const slug = m[2].replace(/^[\d.]+-/, ''); // "2.1.1-the-model" -> "the-model"
  return `/${level}/${slug}`;
}

// A reference marker is an italic-parenthetical *( ... )* containing >=1 markdown link.
// Strip every such marker; use the first link resolving to a deployed chapter as full_chapter.
const MARKER_RE = /\*\([\s\S]*?\)\*/g;
const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;

function extractMarkers(definition: string): { text: string; full_chapter?: string } {
  let full_chapter: string | undefined;
  const text = definition.replace(MARKER_RE, marker => {
    if (!marker.includes('](')) return marker; // not a reference marker — keep it
    if (!full_chapter) {
      for (const m of marker.matchAll(LINK_RE)) {
        const linkPath = m[1];
        if (!linkPath) continue;
        const route = linkToRoute(linkPath);
        if (route) { full_chapter = route; break; }
      }
    }
    return ''; // strip the reference marker
  });
  return { text: text.replace(/\s+/g, ' ').trim(), full_chapter };
}

export function parseGlossaryMarkdown(md: string): GlossaryEntry[] {
  // Drop HTML comments (e.g. <!-- IMAGE -->) up front.
  const clean = md.replace(/<!--[\s\S]*?-->/g, '');
  const lines = clean.split('\n');

  const entries: GlossaryEntry[] = [];
  let group: string | undefined;
  let i = 0;

  const isBoldHeader = (l: string) => /^\*\*(.+)\*\*$/.test(l.trim());
  const isStop = (l: string) =>
    isBoldHeader(l) || /^#{1,6}\s/.test(l.trim()) || l.trim() === '---';

  while (i < lines.length) {
    const line = lines[i] ?? '';
    const t = line.trim();

    // Section heading (## ...) becomes the current group. Skip the H1 title (# ...).
    const h = t.match(/^##\s+(.+)$/);
    if (h) { group = (h[1] ?? '').trim(); i++; continue; }

    if (isBoldHeader(line)) {
      const header = t.replace(/^\*\*|\*\*$/g, '').trim();
      // Collect the definition body until the next stop line.
      const body: string[] = [];
      i++;
      while (i < lines.length) {
        const cur = lines[i] ?? '';
        if (isStop(cur)) break;
        if (cur.trim()) body.push(cur.trim());
        i++;
      }
      const rawDef = body.join(' ').replace(/\s+/g, ' ').trim();
      const { text: definition, full_chapter } = extractMarkers(rawDef);
      if (!definition) continue; // a bold line with no body is not a term

      // Header -> term_en (term_th)
      const paren = header.match(/^(.+?)\s*\((.+)\)\s*$/);
      const term_en = paren && paren[1] ? paren[1].trim() : header;
      const term_th = paren && paren[2] ? paren[2].trim() : null;

      entries.push({ term_en, term_th, definition_th: definition, see_also: [], group, full_chapter });
      continue;
    }
    i++;
  }
  return entries;
}
