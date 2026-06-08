import { describe, it, expect } from 'vitest';
import { Skill, TYPE_META, TYPE_ORDER, SkillType } from '@/lib/content/skills';
import { parseSkillFile } from '@/scripts/lib/parse-skills';

const SAMPLE = `---
name: GetShitDone
slug: get-shit-done
repo: https://github.com/gsd-build/get-shit-done
type: cli
tagline: เปลี่ยนไอเดียให้กลายเป็นสินค้าจริงทีละขั้น
tags:
  - build
  - planning
commands:
  - cmd: "/gsd"
    desc: "เริ่มโปรเจกต์ใหม่"
  - cmd: "gsd plan"
    desc: "วางแผนงานก่อนลงมือ"
---

## มันคืออะไร

ชุดคำสั่งที่ช่วยคุณคิดและสร้างเว็บหรือสินค้าให้เสร็จ

## เริ่มใช้ทีละขั้น

ลากโฟลเดอร์ไปวางใน Claude Code แล้วสั่งว่า "เริ่มโปรเจกต์ใหม่"
`;

describe('TYPE_META', () => {
  it('defines exactly the 4 tool types with Thai labels + blurbs', () => {
    expect(Object.keys(TYPE_META)).toEqual(['cli', 'mcp', 'skill', 'resource']);
    expect(TYPE_ORDER).toEqual(['cli', 'mcp', 'skill', 'resource']);
    for (const t of Object.values(TYPE_META)) {
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.blurb.length).toBeGreaterThan(0);
    }
  });
});

describe('parseSkillFile', () => {
  it('parses frontmatter + body into a valid Skill', () => {
    const s = parseSkillFile('get-shit-done', SAMPLE);
    expect(s.name).toBe('GetShitDone');
    expect(s.slug).toBe('get-shit-done');
    expect(s.repo).toBe('https://github.com/gsd-build/get-shit-done');
    expect(s.type).toBe('cli');
    expect(s.tagline.length).toBeGreaterThan(0);
    expect(s.tags).toContain('planning');
    expect(s.body).toContain('## มันคืออะไร');
    expect(() => Skill.parse(s)).not.toThrow();
  });

  it('parses the command surface', () => {
    const s = parseSkillFile('get-shit-done', SAMPLE);
    expect(s.commands).toHaveLength(2);
    expect(s.commands[0]).toEqual({ cmd: '/gsd', desc: 'เริ่มโปรเจกต์ใหม่' });
  });

  it('defaults commands to [] when absent', () => {
    const noCmds = SAMPLE.replace(/commands:[\s\S]*?---/, '---');
    const s = parseSkillFile('x', noCmds);
    expect(s.commands).toEqual([]);
  });

  it('derives slug from the filename argument', () => {
    const s = parseSkillFile('get-shit-done', SAMPLE);
    expect(s.slug).toBe('get-shit-done');
  });

  it('rejects an invalid type', () => {
    const bad = SAMPLE.replace('type: cli', 'type: nonsense');
    expect(() => parseSkillFile('x', bad)).toThrow();
  });

  it('rejects a missing type', () => {
    const bad = SAMPLE.replace(/type: cli\n/, '');
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

describe('SkillType', () => {
  it('accepts a known key and rejects an unknown one', () => {
    expect(() => SkillType.parse('cli')).not.toThrow();
    expect(() => SkillType.parse('mcp')).not.toThrow();
    expect(() => SkillType.parse('nope')).toThrow();
  });
});
