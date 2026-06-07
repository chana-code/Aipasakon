/**
 * Single source of truth for site-wide SEO constants and helpers.
 *
 * The canonical origin is read from NEXT_PUBLIC_SITE_URL so it can differ per
 * environment (preview vs production) but falls back to the production domain.
 */

export const SITE = {
  /** Canonical origin, no trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aipasakon.com').replace(/\/$/, ''),
  /** Brand name, used in titles and Organization schema. */
  name: 'AI ภาษาคน',
  /** Latin/ASCII brand name for schema fields that prefer it. */
  nameLatin: 'AI Pasa Kon',
  /** Short tagline shown after the brand in the home title. */
  tagline: 'AI ไม่ยาก ถ้าพูดภาษาคน',
  /** Default meta description (home + fallback). */
  description:
    'หลักสูตร AI ภาษาไทยที่อธิบายตั้งแต่ AI คืออะไร ทำงานยังไง ไปจนถึงการใช้งานจริง ' +
    'เขียนให้คนทั่วไปเข้าใจได้โดยไม่ต้องมีพื้นฐานเทคนิค',
  /** BCP-47 language + OG locale. */
  lang: 'th',
  locale: 'th_TH',
  /** Publisher / author shown in Article + Organization schema. */
  author: 'Ong (อ๋อง)',
  /** Topical keywords — used sparingly; modern engines ignore the meta keywords
   *  tag, but a few are kept for legacy crawlers and internal reference. */
  keywords: [
    'AI ภาษาไทย',
    'เรียน AI',
    'AI สำหรับมือใหม่',
    'ChatGPT ภาษาไทย',
    'LLM คืออะไร',
    'prompt engineering ภาษาไทย',
    'หลักสูตร AI',
    'Claude',
    'AI ภาษาคน',
  ],
} as const;

/** Resolve a path to an absolute canonical URL. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Turn light Markdown (as found in `tldr`/`summary`) into clean plain text
 * suitable for a meta description or schema field. Strips images, links,
 * emphasis, code fences, headings, list/quote markers and stray HTML, then
 * collapses whitespace.
 */
export function stripMarkdown(input: string): string {
  return input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')      // links -> text
    .replace(/`{1,3}[^`]*`{1,3}/g, '')            // inline/code spans
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')           // headings
    .replace(/^\s{0,3}>\s?/gm, '')                // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, '')            // bullet markers
    .replace(/^\s{0,3}\d+\.\s+/gm, '')            // ordered markers
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1') // emphasis
    .replace(/<[^>]+>/g, '')                       // stray HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

/** Truncate to `max` chars at a word boundary, appending an ellipsis. */
export function truncate(text: string, max = 158): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** Build a clean meta description from a Markdown-ish source string. */
export function metaDescription(source: string | undefined, fallback = SITE.description): string {
  const text = source ? stripMarkdown(source) : '';
  return text ? truncate(text) : fallback;
}

/** Build the absolute URL to the dynamic OG image for a given page. */
export function ogImageUrl(opts: { title: string; tag?: string; kicker?: string }): string {
  const params = new URLSearchParams({ title: opts.title });
  if (opts.tag) params.set('tag', opts.tag);
  if (opts.kicker) params.set('kicker', opts.kicker);
  return absoluteUrl(`/og?${params.toString()}`);
}
