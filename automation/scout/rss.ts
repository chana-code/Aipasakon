import type { NewsCandidate } from '../types';

function decode(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!m) return '';
  let v = (m[1] ?? '').trim();
  const cd = v.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cd) v = (cd[1] ?? '').trim();
  return decode(v);
}
function normDate(d: string): string {
  if (!d) return '';
  const t = Date.parse(d);
  return Number.isNaN(t) ? '' : new Date(t).toISOString();
}

/** Parse an RSS 2.0 or Atom feed string into candidates. Pure. */
export function parseFeed(xml: string, source: string): NewsCandidate[] {
  const out: NewsCandidate[] = [];
  for (const block of xml.match(/<item[\s\S]*?<\/item>/gi) || []) {
    const title = pick(block, 'title');
    const link = pick(block, 'link');
    const date = pick(block, 'pubDate') || pick(block, 'dc:date');
    if (title && link) out.push({ title, url: link, date: normDate(date), source });
  }
  for (const block of xml.match(/<entry[\s\S]*?<\/entry>/gi) || []) {
    const title = pick(block, 'title');
    const lm = block.match(/<link[^>]*href="([^"]+)"/i);
    const link = lm ? lm[1] : '';
    const date = pick(block, 'updated') || pick(block, 'published');
    if (title && link) out.push({ title, url: link, date: normDate(date), source });
  }
  return out;
}

/** Keep items newer than `hours` relative to nowIso. Pure. */
export function freshWithin(items: NewsCandidate[], hours: number, nowIso: string): NewsCandidate[] {
  const cutoff = Date.parse(nowIso) - hours * 3600_000;
  return items.filter(i => {
    const t = Date.parse(i.date);
    return !Number.isNaN(t) && t >= cutoff;
  });
}

export interface FeedSource { url: string; source: string; }

/** Fetch + parse all feeds, keeping fresh items; tolerant of per-feed failure. */
export async function fetchCandidates(feeds: FeedSource[], hours: number, nowIso: string): Promise<NewsCandidate[]> {
  const out: NewsCandidate[] = [];
  for (const f of feeds) {
    try {
      const resp = await fetch(f.url, { headers: { 'user-agent': 'aipasakon-bot/1.0' } });
      if (!resp.ok) continue;
      out.push(...freshWithin(parseFeed(await resp.text(), f.source), hours, nowIso));
    } catch { /* skip dead feed */ }
  }
  return out;
}
