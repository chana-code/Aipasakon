import { loadSkills, groupByType, TYPE_META, TYPE_ORDER } from '@/lib/content/skills';
import { fetchStarsForRepos, repoPath } from '@/lib/content/github-stars';
import SkillsBrowser, { type SkillCard, type TypeInfo } from '@/components/skills/SkillsBrowser';

export const metadata = { title: 'รวม Skill ที่น่าสนใจ — AI ภาษาคน' };

// Live star counts refresh hourly via the fetch ISR cache in github-stars.ts.
export const revalidate = 3600;

export default async function SkillsPage() {
  const skills = await loadSkills();
  const starsByRepo = await fetchStarsForRepos(skills.map(s => s.repo));

  const items: SkillCard[] = skills.map(s => ({
    name: s.name,
    slug: s.slug,
    repo: s.repo,
    type: s.type,
    tagline: s.tagline,
    tags: s.tags,
    commandCount: s.commands.length,
    stars: starsByRepo[repoPath(s.repo) ?? s.repo] ?? null,
  }));

  // Only show type chips/sections that actually have tools, in canonical order.
  const present = new Set(groupByType(skills).map(g => g.key));
  const types: TypeInfo[] = TYPE_ORDER.filter(k => present.has(k)).map(k => ({
    key: k,
    label: TYPE_META[k].label,
    blurb: TYPE_META[k].blurb,
  }));

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
            รวม Skill ที่น่าสนใจ
          </h1>
          <p className="text-[18px] leading-[1.8] text-[#00143C]/70 max-w-[640px]">
            เครื่องมือ AI ที่คัดมาแล้ว แบ่งตามประเภท เลือกได้ตามงานที่อยากทำ ตัวเลขคือจำนวนดาวบน
            GitHub (ยิ่งมากยิ่งคนใช้เยอะ) แต่ละตัวลากไปวางใน Claude Code, Cowork หรือ Codex
            แล้วสั่งงานได้เลย กดเข้าไปอ่านวิธีใช้และคำสั่งแบบละเอียดได้
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-[#6c7a78] italic">ยังไม่มี skill</p>
        ) : (
          <SkillsBrowser items={items} types={types} />
        )}
      </div>
    </div>
  );
}
