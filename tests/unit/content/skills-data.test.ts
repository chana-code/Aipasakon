import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Skills, CATEGORY_ORDER } from '@/lib/content/skills';

const json = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'content/skills.json'), 'utf-8'),
);

describe('content/skills.json', () => {
  it('matches the Skill schema', () => {
    expect(() => Skills.parse(json)).not.toThrow();
  });

  it('has unique slugs', () => {
    const slugs = json.map((s: { slug: string }) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every skill has a non-empty body and a known category', () => {
    for (const s of json) {
      expect(s.body.trim().length).toBeGreaterThan(0);
      expect(CATEGORY_ORDER).toContain(s.category);
    }
  });

  it('covers at least 3 of the 4 categories', () => {
    const used = new Set(json.map((s: { category: string }) => s.category));
    expect(used.size).toBeGreaterThanOrEqual(3);
  });
});
