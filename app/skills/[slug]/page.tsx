import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { loadSkills, loadSkill, TYPE_META } from '@/lib/content/skills';
import { fetchStars, formatStars } from '@/lib/content/github-stars';

export const dynamicParams = false;
export const revalidate = 3600;

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

  const typeMeta = TYPE_META[skill.type];
  const stars = await fetchStars(skill.repo);

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

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-block text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82]">
            {typeMeta.label}
          </span>
          {stars != null && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[#F4F1E9] px-2.5 py-0.5 text-[13px] font-semibold text-[#00143C] tabular-nums"
              title={`${stars.toLocaleString()} stars บน GitHub`}
            >
              <span className="text-[#14B5AB] leading-none">★</span>
              {formatStars(stars)}
            </span>
          )}
        </div>

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

        {skill.commands.length > 0 && (
          <section className="mb-10 rounded-lg border border-[#E8E2D4] bg-white p-6">
            <h2 className="flex items-center gap-2 text-[18px] font-bold text-[#00143C] mb-4">
              <span className="material-symbols-outlined text-[20px] text-[#14B5AB]">terminal</span>
              คำสั่งที่ใช้ได้
            </h2>
            <ul className="flex flex-col gap-3">
              {skill.commands.map(c => (
                <li key={c.cmd} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <code className="shrink-0 rounded bg-[#00143C]/[0.06] px-2 py-0.5 text-[13.5px] font-[var(--font-mono)] text-[#00143C] whitespace-pre-wrap break-words">
                    {c.cmd}
                  </code>
                  <span className="text-[15px] leading-[1.6] text-[#00143C]/75">{c.desc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="prose-chapter text-[#00143C]" style={{ fontSize: 16.5, lineHeight: 1.85 }}>
          <MDXRemote source={skill.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </article>
    </div>
  );
}
