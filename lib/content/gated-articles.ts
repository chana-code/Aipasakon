/**
 * Registry of members-only .html articles. To add one:
 *   1. drop the file in website/gated-content/<file>.html
 *   2. append an entry here.
 * No other code changes are needed.
 */
export type GatedArticle = {
  slug: string;          // url id, unique
  title: string;         // Thai display title
  summary?: string;      // one-line teaser on the locked card
  type: 'iframe' | 'inline';
  file: string;          // filename inside gated-content/
  section?: string;      // level/section listing it belongs to
  order?: number;        // sort position within that section
};

const ARTICLES: GatedArticle[] = [
  {
    slug: 'sample-locked',
    title: 'ตัวอย่างบทความสำหรับสมาชิก',
    summary: 'ตัวอย่างบทความที่ปลดล็อกหลังเข้าสู่ระบบ',
    type: 'inline',
    file: 'sample-locked.html',
    section: 'what-is-ai',
    order: 100,
  },
];

export function listGatedArticles(section?: string): GatedArticle[] {
  const items = section ? ARTICLES.filter(a => a.section === section) : ARTICLES.slice();
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getGatedArticle(slug: string): GatedArticle | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function isGatedSlug(slug: string): boolean {
  return ARTICLES.some(a => a.slug === slug);
}
