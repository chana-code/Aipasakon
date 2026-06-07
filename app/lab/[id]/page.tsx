import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Lab from '@/components/lab/Lab';
import { LABS, getLab } from '@/lib/lab/registry';
import { loadAllChapters } from '@/lib/content/chapters';

export const dynamicParams = false;

export function generateStaticParams() {
  return LABS.map(l => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lab = getLab(id);
  if (!lab) return {};
  return { title: `${lab.title_th} — AI Lab — AI ภาษาคน`, description: lab.blurb };
}

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lab = getLab(id);
  if (!lab) notFound();

  const all = await loadAllChapters();
  const related = lab.chapters
    .map(slug => all.find(c => c.slug === slug))
    .filter(Boolean)
    .map(c => ({ slug: c!.slug, title: c!.title, level: c!.level }));

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-[920px] px-4 md:px-8 py-10 md:py-14">
        <nav className="flex flex-wrap gap-2 text-sm text-[#00143C]/60 mb-6">
          <Link href="/lab" className="hover:text-[#14B5AB] transition-colors">AI Lab</Link>
          <span>/</span>
          <span className="text-[#00143C]">{lab.title_th}</span>
        </nav>

        <h1 className="text-[32px] md:text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
          {lab.title_th}
        </h1>
        <p className="text-[17px] leading-[1.8] text-[#00143C]/70 max-w-[640px] mb-8">{lab.blurb}</p>

        <div className="rounded-lg overflow-hidden">
          <Lab id={lab.id} />
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-bold text-sm text-[#00143C]/60 uppercase mb-4 tracking-widest">
              บทเรียนที่เกี่ยวข้อง
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map(c => (
                <Link
                  key={c.slug}
                  href={`/${c.level}/${c.slug}`}
                  className="px-4 py-2 bg-[#eae8e3] rounded-full text-sm text-[#00143C] hover:bg-[#14B5AB] hover:text-white transition-all no-underline"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
