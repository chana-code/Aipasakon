import { describe, it, expect } from 'vitest';
import { Skill, CATEGORIES, SkillCategory } from '@/lib/content/skills';
import { parseSkillFile } from '@/scripts/lib/parse-skills';

const SAMPLE = `---
name: GetShitDone
slug: get-shit-done
repo: https://github.com/gsd-build/get-shit-done
category: build
tagline: เปลี่ยนไอเดียให้กลายเป็นสินค้าจริงทีละขั้น
tags:
  - build
  - planning
---

## มันคืออะไร

ชุดคำสั่งที่ช่วยคุณคิดและสร้างเว็บหรือสินค้าให้เสร็จ

## เริ่มใช้ทีละขั้น

ลากโฟลเดอร์ไปวางใน Claude Code แล้วสั่งว่า "เริ่มโปรเจกต์ใหม่"
`;

describe('CATEGORIES', () => {
  it('defines exactly the 4 outcome categories with Thai labels', () => {
    expect(Object.keys(CATEGORIES)).toEqual(['build', 'automate-web', 'content', 'sharper']);
    for (const c of Object.values(CATEGORIES)) {
      expect(c.label.length).toBeGreaterThan(0);
      expect(c.blurb.length).toBeGreaterThan(0);
    }
  });
});

describe('parseSkillFile', () => {
  it('parses frontmatter + body into a valid Skill', () => {
    const s = parseSkillFile('get-shit-done', SAMPLE);
    expect(s.name).toBe('GetShitDone');
    expect(s.slug).toBe('get-shit-done');
    expect(s.repo).toBe('https://github.com/gsd-build/get-shit-done');
    expect(s.category).toBe('build');
    expect(s.tagline.length).toBeGreaterThan(0);
    expect(s.tags).toContain('planning');
    expect(s.body).toContain('## มันคืออะไร');
    expect(() => Skill.parse(s)).not.toThrow();
  });

  it('derives slug from the filename argument', () => {
    const s = parseSkillFile('get-shit-done', SAMPLE);
    expect(s.slug).toBe('get-shit-done');
  });

  it('rejects an invalid category', () => {
    const bad = SAMPLE.replace('category: build', 'category: nonsense');
    expect(() => parseSkillFile('x', bad)).toThrow();
  });

  it('rejects a body that is empty', () => {
    const noBody = SAMPLE.split('---').slice(0, 2).join('---') + '---\n';
    expect(() => parseSkillFile('x', noBody)).toThrow(/body/i);
  });

  it('rejects missing required frontmatter (repo)', () => {
    const bad = SAMPLE.replace(/repo: .*\n/, '');
    expect(() => parseSkillFile('x', bad)).toThrow();
  });
});

describe('SkillCategory', () => {
  it('accepts a known key and rejects an unknown one', () => {
    expect(() => SkillCategory.parse('build')).not.toThrow();
    expect(() => SkillCategory.parse('nope')).toThrow();
  });
});
