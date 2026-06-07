import type { Metadata } from 'next';
import Link from 'next/link';
import { loadAllPosts } from '@/lib/content/blog';
import { ogImageUrl } from '@/lib/seo/site';

const BLOG_DESC =
  'บันทึกระหว่างทางของ AI ภาษาคน บทเรียนใหม่ เครื่องมือ และมุมมองเรื่อง AI';

export const metadata: Metadata = {
  title: 'บทความ',
  description: BLOG_DESC,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'บทความ',
    description: BLOG_DESC,
    images: [
      {
        url: ogImageUrl({ title: 'บทความ', tag: 'บทความ' }),
        width: 1200,
        height: 630,
        alt: 'บทความ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'บทความ',
    description: BLOG_DESC,
    images: [ogImageUrl({ title: 'บทความ', tag: 'บทความ' })],
  },
};

export default async function BlogIndex() {
  const posts = await loadAllPosts();

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">บทความ</h1>
          <p className="text-[18px] leading-[1.8] text-[#00143C]/70">
            บันทึกระหว่างทางของ AI ภาษาคน บทเรียนใหม่ เครื่องมือ และมุมมองเรื่อง AI
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {posts.map(p => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block bg-white rounded-lg border border-[#E8E2D4] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md no-underline"
            >
              <div className="text-[13px] text-[#6c7a78] mb-2 tabular-nums">{p.date}</div>
              <h2 className="text-[22px] leading-[1.3] font-semibold text-[#00143C] mb-2 group-hover:text-[#14B5AB] transition-colors">
                {p.title}
              </h2>
              {p.summary && (
                <p className="text-[15px] leading-[1.7] text-[#00143C]/70">{p.summary}</p>
              )}
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="text-[#6c7a78] italic">ยังไม่มีบทความ</p>
          )}
        </div>
      </div>
    </div>
  );
}
