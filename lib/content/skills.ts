import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

/** The 4 outcome categories, in display order, with Thai labels + intro blurbs. */
export const CATEGORIES = {
  build: {
    label: 'ทำเว็บ/ทำสินค้าให้เสร็จ',
    blurb: 'อยากมีเว็บหรือสินค้าจริง ๆ โดยไม่ต้องเขียนโค้ดเอง',
  },
  'automate-web': {
    label: 'สั่งงานเว็บแบบอัตโนมัติ',
    blurb: 'อยากให้ AI ไปกดเว็บ กรอกฟอร์ม หรือดึงข้อมูลแทนคุณ',
  },
  content: {
    label: 'ทำคอนเทนต์เร็วขึ้น',
    blurb: 'อยากย่อ สรุป หรือแปลงคอนเทนต์ให้ไวขึ้น',
  },
  sharper: {
    label: 'คิดและทำงานให้คมขึ้น',
    blurb: 'อยากให้ AI คิดเป็นระบบและทำงานได้ดีขึ้น',
  },
} as const;

export const CATEGORY_ORDER = ['build', 'automate-web', 'content', 'sharper'] as const;

export const SkillCategory = z.enum(['build', 'automate-web', 'content', 'sharper']);
export type SkillCategory = z.infer<typeof SkillCategory>;

export const Skill = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  repo: z.string().url(),
  category: SkillCategory,
  tagline: z.string().min(1),
  tags: z.array(z.string()).default([]),
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

/** Group skills by category, preserving CATEGORY_ORDER and dropping empty groups. */
export function groupByCategory(skills: Skill[]): Array<{
  key: SkillCategory;
  label: string;
  blurb: string;
  skills: Skill[];
}> {
  return CATEGORY_ORDER.map(key => ({
    key,
    label: CATEGORIES[key].label,
    blurb: CATEGORIES[key].blurb,
    skills: skills.filter(s => s.category === key),
  })).filter(g => g.skills.length > 0);
}
