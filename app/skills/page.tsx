import type { Metadata } from 'next';
import { loadSkills } from '@/lib/content/skills';
import { ogImageUrl } from '@/lib/seo/site';

const SKILLS_DESC =
  'GitHub repo ของ skill และเครื่องมือ AI ที่คัดมาแล้ว พร้อมคำอธิบายว่าแต่ละตัวคืออะไรและใช้ยังไง';

export const metadata: Metadata = {
  title: 'รวม Skill ที่น่าสนใจ',
  description: SKILLS_DESC,
  alternates: { canonical: '/skills' },
  openGraph: {
    type: 'website',
    url: '/skills',
    title: 'รวม Skill ที่น่าสนใจ',
    description: SKILLS_DESC,
    images: [
      {
        url: ogImageUrl({ title: 'รวม Skill ที่น่าสนใจ', tag: 'Skills' }),
        width: 1200,
        height: 630,
        alt: 'รวม Skill ที่น่าสนใจ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'รวม Skill ที่น่าสนใจ',
    description: SKILLS_DESC,
    images: [ogImageUrl({ title: 'รวม Skill ที่น่าสนใจ', tag: 'Skills' })],
  },
};

export default async function SkillsPage() {
  const skills = await loadSkills();

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
            รวม Skill ที่น่าสนใจ
          </h1>
          <p className="text-[18px] leading-[1.8] text-[#00143C]/70 max-w-[640px]">
            GitHub repo ของ skill และเครื่องมือ AI ที่คัดมาแล้ว พร้อมคำอธิบายว่าแต่ละตัวคืออะไรและใช้ยังไง
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {skills.map(s => (
            <div
              key={s.repo}
              className="flex flex-col bg-white rounded-lg border border-[#E8E2D4] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-[20px] leading-[1.3] font-semibold text-[#00143C] mb-3">
                {s.name}
              </h3>
              <p className="text-[15px] leading-[1.7] text-[#00143C] mb-4">
                <span className="font-semibold">คืออะไร:</span> {s.what}
              </p>
              <p className="text-[15px] leading-[1.7] text-[#00143C]/80 mb-4">
                <span className="font-semibold">ใช้ยังไง:</span> {s.how}
              </p>

              {s.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <a
                href={s.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 self-start text-[14px] font-medium text-[#14B5AB] hover:text-[#006B7A] no-underline transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                ดูบน GitHub
              </a>
            </div>
          ))}

          {skills.length === 0 && (
            <p className="text-[#6c7a78] italic">ยังไม่มี skill</p>
          )}
        </div>
      </div>
    </div>
  );
}
