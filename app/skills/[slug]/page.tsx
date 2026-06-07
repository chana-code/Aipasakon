import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { loadSkills, loadSkill, CATEGORIES } from '@/lib/content/skills';

export const dynamicParams = false;

export async function generateStaticParams() {
  const skills = await loadSkills();
  return skills.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = await loadSkill(slug);
  if (!skill) return {};
  return {
    title: `${skill.name} — รวม Skill ที่น่าสนใจ`,
    description: skill.tagline,
    alternates: { canonical: `/skills/${skill.slug}` },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = await loadSkill(slug);
  if (!skill) notFound();

  const category = CATEGORIES[skill.category];

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <article className="mx-auto max-w-[720px] px-6 pt-8 pb-24">
        <nav className="flex gap-2 text-sm text-[#00143C]/60 mb-8">
          <Link href="/skills" className="hover:text-[#14B5AB] transition-colors">
            รวม Skill ที่น่าสนใจ
          </Link>
          <span>/</span>
          <span className="text-[#00143C]">{skill.name}</span>
        </nav>

        <span className="inline-block text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82] mb-3">
          {category.label}
        </span>
        <h1 className="text-[32px] md:text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
          {skill.name}
        </h1>
        <p className="text-[18px] leading-[1.8] text-[#00143C]/70 mb-6">{skill.tagline}</p>

        <a
          href={skill.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#14B5AB] px-5 py-2.5 text-[15px] font-semibold text-white no-underline hover:bg-[#0f8a82] transition-colors mb-10"
        >
          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
          ดูบน GitHub
        </a>

        <div
          className="prose-chapter font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[#00143C]"
          style={{ fontSize: 16.5, lineHeight: 1.85 }}
        >
          <MDXRemote source={skill.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </article>
    </div>
  );
}
