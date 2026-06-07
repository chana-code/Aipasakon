import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { loadAllPosts, loadPost } from '@/lib/content/blog';
import { SITE, metaDescription, ogImageUrl } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleLd, breadcrumbLd } from '@/lib/seo/jsonld';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await loadAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try { post = await loadPost(slug); } catch { return {}; }

  const description = metaDescription(post.summary || post.body);
  const path = `/blog/${post.slug}`;
  const image = ogImageUrl({ title: post.title, tag: 'บทความ', kicker: SITE.name });

  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title: post.title,
      description,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try { post = await loadPost(slug); } catch { notFound(); }
  if (!post) notFound();

  const description = metaDescription(post.summary || post.body);

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <JsonLd
        data={[
          articleLd({
            title: post.title,
            description,
            path: `/blog/${post.slug}`,
            datePublished: post.date,
            image: ogImageUrl({ title: post.title, tag: 'บทความ', kicker: SITE.name }),
            tags: post.tags,
          }),
          breadcrumbLd([
            { name: 'บทความ', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-[720px] px-6 pt-8 pb-24">
        <nav className="flex gap-2 text-sm text-[#00143C]/60 mb-8">
          <Link href="/blog" className="hover:text-[#14B5AB] transition-colors">บทความ</Link>
          <span>/</span>
          <span className="text-[#00143C]">{post.title}</span>
        </nav>

        <div className="text-[13px] text-[#6c7a78] mb-3 tabular-nums">{post.date}</div>
        <h1 className="text-[32px] md:text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map(t => (
              <span key={t} className="text-[13px] px-3 py-0.5 rounded-full bg-[#14B5AB1a] text-[#0f8a82]">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose-chapter font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[#00143C]"
          style={{ fontSize: 16.5, lineHeight: 1.85 }}
        >
          <MDXRemote source={post.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </article>
    </div>
  );
}
