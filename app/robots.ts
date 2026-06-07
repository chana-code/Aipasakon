import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/lib/seo/site';

export const dynamic = 'force-static';

/**
 * robots.txt.
 *
 * AI answer engines are allowed explicitly and generously — getting cited by
 * ChatGPT / Perplexity / Gemini / Google AI Overviews is a primary goal, so we
 * do NOT block GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.
 *
 * Private / functional routes (auth, dashboard, API) are disallowed for every
 * crawler — there is no public content there.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/learn', '/login', '/signup', '/auth/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE.url,
  };
}
