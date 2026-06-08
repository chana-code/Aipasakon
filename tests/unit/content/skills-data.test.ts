import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Skills, TYPE_ORDER, groupByType } from '@/lib/content/skills';

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

  it('every skill has a non-empty body and a known type', () => {
    for (const s of json) {
      expect(s.body.trim().length).toBeGreaterThan(0);
      expect(TYPE_ORDER).toContain(s.type);
    }
  });

  it('covers at least 3 of the 4 tool types', () => {
    const used = new Set(json.map((s: { type: string }) => s.type));
    expect(used.size).toBeGreaterThanOrEqual(3);
  });
});

describe('groupByType', () => {
  it('groups in canonical order and drops empty groups', () => {
    const skills = Skills.parse(json);
    const groups = groupByType(skills);
    const keys = groups.map(g => g.key);
    // keys appear in TYPE_ORDER order
    const orderIndex = keys.map(k => TYPE_ORDER.indexOf(k));
    expect(orderIndex).toEqual([...orderIndex].sort((a, b) => a - b));
    // no empty group
    for (const g of groups) expect(g.skills.length).toBeGreaterThan(0);
    // every skill lands in exactly one group
    const total = groups.reduce((n, g) => n + g.skills.length, 0);
    expect(total).toBe(skills.length);
  });
});
