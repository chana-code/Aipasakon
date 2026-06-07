import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getGatedArticle } from '@/lib/content/gated-articles';
import { readGatedFile } from '@/lib/content/read-gated-file';
import { sanitizeArticleHtml } from '@/lib/content/sanitize-html';
import { ArticleGate } from '@/components/articles/ArticleGate';
import Embed from '@/components/reader/Embed';

export default async function GatedArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getGatedArticle(slug);
  if (!article) notFound();

  // Read the session server-side. Bad/placeholder keys → treat as logged-out.
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // Logged out → in-page wall, no body bytes sent.
  if (!user) {
    return (
      <main className="max-w-[1100px] mx-auto px-6 py-8">
        <ArticleGate title={article.title} summary={article.summary} slug={article.slug} />
      </main>
    );
  }

  // Logged in → render the body.
  return (
    <main className="max-w-[720px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#00143C] mb-6">{article.title}</h1>
      {article.type === 'iframe' ? (
        <Embed src={`/api/gated/${article.slug}`} title={article.title} height={640} />
      ) : (
        <InlineBody slug={article.slug} />
      )}
    </main>
  );
}

async function InlineBody({ slug }: { slug: string }) {
  const raw = await readGatedFile(slug);
  if (raw === null) notFound();
  const clean = sanitizeArticleHtml(raw);
  return (
    <div
      className="prose-chapter"
      // Content is sanitized above (script/style/handlers stripped).
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
