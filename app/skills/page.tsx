import Link from 'next/link';
import { loadSkills, groupByCategory } from '@/lib/content/skills';

export const metadata = { title: 'รวม Skill ที่น่าสนใจ — AI ภาษาคน' };

export default async function SkillsPage() {
  const skills = await loadSkills();
  const groups = groupByCategory(skills);

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
            รวม Skill ที่น่าสนใจ
          </h1>
          <p className="text-[18px] leading-[1.8] text-[#00143C]/70 max-w-[640px]">
            เครื่องมือ AI ที่คัดมาแล้ว เลือกตามงานที่คุณอยากทำ แต่ละตัวลากไปวางใน
            Claude Code, Cowork หรือ Codex แล้วสั่งงานได้เลย กดเข้าไปอ่านวิธีใช้แบบละเอียดได้
          </p>
        </div>

        {groups.map(group => (
          <section key={group.key} className="mb-14">
            <h2 className="text-[24px] leading-[1.3] font-bold text-[#00143C] mb-1">
              {group.label}
            </h2>
            <p className="text-[15px] leading-[1.7] text-[#00143C]/60 mb-6">{group.blurb}</p>

            <div className="grid md:grid-cols-2 gap-5">
              {group.skills.map(s => (
                <div
                  key={s.slug}
                  className="flex flex-col bg-white rounded-lg border border-[#E8E2D4] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="text-[20px] leading-[1.3] font-semibold text-[#00143C] mb-2">
                    {s.name}
                  </h3>
                  <p className="text-[15px] leading-[1.7] text-[#00143C]/80 mb-4">{s.tagline}</p>

                  {s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {s.tags.map(t => (
                        <span
                          key={t}
                          className="text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center gap-4">
                    <Link
                      href={`/skills/${s.slug}`}
                      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#14B5AB] hover:text-[#006B7A] no-underline transition-colors"
                    >
                      อ่านวิธีใช้
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <a
                      href={s.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[13px] text-[#00143C]/50 hover:text-[#00143C] no-underline transition-colors"
                    >
                      GitHub
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {skills.length === 0 && <p className="text-[#6c7a78] italic">ยังไม่มี skill</p>}
      </div>
    </div>
  );
}
