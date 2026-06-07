import { describe, it, expect } from 'vitest';
import {
  getGatedArticle,
  listGatedArticles,
  isGatedSlug,
  type GatedArticle,
} from '@/lib/content/gated-articles';

describe('gated-articles registry', () => {
  it('returns a known article by slug', () => {
    const a = getGatedArticle('sample-locked');
    expect(a).toBeDefined();
    expect(a?.title).toBeTruthy();
    expect(['iframe', 'inline']).toContain(a!.type);
    expect(a!.file).toMatch(/\.html$/);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getGatedArticle('does-not-exist')).toBeUndefined();
  });

  it('isGatedSlug reflects registry membership', () => {
    expect(isGatedSlug('sample-locked')).toBe(true);
    expect(isGatedSlug('does-not-exist')).toBe(false);
  });

  it('lists all articles, and filters by section', () => {
    const all = listGatedArticles();
    expect(all.length).toBeGreaterThan(0);
    const inSection = listGatedArticles('what-is-ai');
    inSection.forEach((a: GatedArticle) => expect(a.section).toBe('what-is-ai'));
  });

  it('sorts a section by order ascending', () => {
    const ordered = listGatedArticles('what-is-ai');
    const orders = ordered.map(a => a.order ?? 0);
    expect(orders).toEqual([...orders].sort((x, y) => x - y));
  });
});
