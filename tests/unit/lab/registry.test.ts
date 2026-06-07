import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { LABS, Labs, getLab, labsBySection, labsForChapter, REACT_LAB_IDS, LAB_SECTIONS } from '@/lib/lab/registry';

const CORE_SECTIONS = LAB_SECTIONS;

// Real chapter slugs on disk under content/chapters/<core section>/*.mdx
function chapterSlugs(): Set<string> {
  const base = path.resolve(process.cwd(), 'content/chapters');
  const slugs = new Set<string>();
  for (const section of CORE_SECTIONS) {
    const dir = path.join(base, section);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.mdx')) slugs.add(f.replace(/\.mdx$/, ''));
    }
  }
  return slugs;
}

describe('lib/lab/registry', () => {
  it('matches the Lab schema', () => {
    expect(() => Labs.parse(LABS)).not.toThrow();
  });

  it('has unique ids', () => {
    const ids = LABS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses only valid core section keys', () => {
    for (const l of LABS) expect(CORE_SECTIONS).toContain(l.section);
  });

  it('every react lab has a component-map entry', () => {
    for (const l of LABS.filter(l => l.kind === 'react')) {
      expect(REACT_LAB_IDS).toContain(l.id);
    }
  });

  it('every html lab source file exists under public/', () => {
    for (const l of LABS.filter(l => l.kind === 'html')) {
      const p = path.resolve(process.cwd(), 'public', l.source.replace(/^\//, ''));
      expect(existsSync(p), `missing ${l.source}`).toBe(true);
    }
  });

  it('every referenced chapter slug resolves to a real chapter', () => {
    const valid = chapterSlugs();
    for (const l of LABS) {
      for (const slug of l.chapters) {
        expect(valid.has(slug), `${l.id} → unknown chapter ${slug}`).toBe(true);
      }
    }
  });

  it('getLab returns by id and undefined for misses', () => {
    expect(getLab('dissection-lab')?.id).toBe('dissection-lab');
    expect(getLab('nope')).toBeUndefined();
  });

  it('labsForChapter finds labs by chapter slug', () => {
    expect(labsForChapter('the-harness').length).toBeGreaterThan(0);
  });

  it('labsBySection returns ordered non-empty groups', () => {
    const groups = labsBySection();
    expect(groups.every(g => g.labs.length > 0)).toBe(true);
    const keys = groups.map(g => g.key);
    const expectedOrder = LAB_SECTIONS.filter(s => keys.includes(s));
    expect(keys).toEqual(expectedOrder);
  });
});
