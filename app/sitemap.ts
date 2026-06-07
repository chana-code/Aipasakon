import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { loadAllChapters } from '@/lib/content/chapters';
import { loadAllPosts } from '@/lib/content/blog';
import { loadAllVideos } from '@/lib/content/videos';
import { CORE_LEVELS } from '@/lib/content/levels';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/curriculum', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/glossary', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/skills', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/videos', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map(r => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Level index pages
  for (const level of CORE_LEVELS) {
    entries.push({
      url: absoluteUrl(`/${level}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Chapters
  try {
    const chapters = await loadAllChapters();
    for (const c of chapters) {
      entries.push({
        url: absoluteUrl(`/${c.level}/${c.slug}`),
        lastModified: c.last_reviewed ? new Date(c.last_reviewed) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  } catch { /* content may be absent in some build contexts */ }

  // Blog posts
  try {
    const posts = await loadAllPosts();
    for (const p of posts) {
      entries.push({
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: new Date(p.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch { /* no posts */ }

  // Videos
  try {
    const videos = await loadAllVideos();
    for (const v of videos) {
      entries.push({
        url: absoluteUrl(`/videos/${v.slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  } catch { /* no videos */ }

  return entries;
}
