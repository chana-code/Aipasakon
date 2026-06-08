import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

/**
 * Tool TYPE — the primary grouping axis for the /skills catalog (v2).
 * Display order: cli, mcp, skill, resource.
 */
export const TYPE_META = {
  cli: {
    label: 'CLI Tools',
    blurb: 'เครื่องมือบรรทัดคำสั่ง ที่คุณหรือ AI สั่งให้ทำงานได้',
  },
  mcp: {
    label: 'MCP Tools',
    blurb: 'ปลั๊กเข้ากับ Claude หรือ AI client เพื่อเพิ่มความสามารถใหม่ให้ AI',
  },
  skill: {
    label: 'Skills',
    blurb: 'ชุดสกิลและคำสั่งสำเร็จรูปที่ทำให้ AI ทำงานเก่งขึ้น',
  },
  resource: {
    label: 'แหล่งรวม',
    blurb: 'คลัง prompt คู่มือ และรายการเครื่องมือไว้ให้เลือกหยิบ',
  },
} as const;

export const TYPE_ORDER = ['cli', 'mcp', 'skill', 'resource'] as const;

export const SkillType = z.enum(['cli', 'mcp', 'skill', 'resource']);
export type SkillType = z.infer<typeof SkillType>;

/**
 * Legacy outcome categories (v1). Kept optional for back-compat with any file that
 * still carries `category`, but no longer the grouping axis — TYPE is.
 */
export const CATEGORIES = {
  build: { label: 'ทำเว็บ/ทำสินค้าให้เสร็จ', blurb: 'อยากมีเว็บหรือสินค้าจริง ๆ โดยไม่ต้องเขียนโค้ดเอง' },
  'automate-web': { label: 'สั่งงานเว็บแบบอัตโนมัติ', blurb: 'อยากให้ AI ไปกดเว็บ กรอกฟอร์ม หรือดึงข้อมูลแทนคุณ' },
  content: { label: 'ทำคอนเทนต์เร็วขึ้น', blurb: 'อยากย่อ สรุป หรือแปลงคอนเทนต์ให้ไวขึ้น' },
  sharper: { label: 'คิดและทำงานให้คมขึ้น', blurb: 'อยากให้ AI คิดเป็นระบบและทำงานได้ดีขึ้น' },
} as const;

export const CATEGORY_ORDER = ['build', 'automate-web', 'content', 'sharper'] as const;
export const SkillCategory = z.enum(['build', 'automate-web', 'content', 'sharper']);
export type SkillCategory = z.infer<typeof SkillCategory>;

/** One entry in a tool's command surface (CLI subcommand / MCP tool / sub-skill). */
export const Command = z.object({
  cmd: z.string().min(1),
  desc: z.string().min(1),
});
export type Command = z.infer<typeof Command>;

export const Skill = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  repo: z.string().url(),
  type: SkillType,
  tagline: z.string().min(1),
  tags: z.array(z.string()).default([]),
  commands: z.array(Command).default([]),
  /** legacy v1 outcome category — optional, not used for grouping. */
  category: SkillCategory.optional(),
  body: z.string().min(1),
});
export const Skills = z.array(Skill);
export type Skill = z.infer<typeof Skill>;

const FILE = path.resolve(process.cwd(), 'content/skills.json');

export async function loadSkills(): Promise<Skill[]> {
  const raw = JSON.parse(await readFile(FILE, 'utf-8'));
  return Skills.parse(raw);
}

export async function loadSkill(slug: string): Promise<Skill | undefined> {
  const all = await loadSkills();
  return all.find(s => s.slug === slug);
}

/** Group skills by TYPE, preserving TYPE_ORDER and dropping empty groups. */
export function groupByType(skills: Skill[]): Array<{
  key: SkillType;
  label: string;
  blurb: string;
  skills: Skill[];
}> {
  return TYPE_ORDER.map(key => ({
    key,
    label: TYPE_META[key].label,
    blurb: TYPE_META[key].blurb,
    skills: skills.filter(s => s.type === key),
  })).filter(g => g.skills.length > 0);
}
