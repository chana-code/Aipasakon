import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

export const BlogFrontmatter = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
});
export type BlogPost = z.infer<typeof BlogFrontmatter> & { slug: string; body: string };

const ROOT = path.resolve(process.cwd(), 'content/blog');

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
  const fm = BlogFrontmatter.parse(data);
  // Strip HTML comments MDX cannot parse (same rule as chapters).
  const body = content.replace(/<!--[\s\S]*?-->/g, '');
  return { ...fm, slug, body };
}

export async function loadAllPosts(): Promise<BlogPost[]> {
  let files: string[] = [];
  try { files = await readdir(ROOT); } catch { return []; }
  const posts = await Promise.all(
    files.filter(f => f.endsWith('.mdx')).map(async f => {
      const slug = f.replace(/\.mdx$/, '');
      return parsePost(slug, await readFile(path.join(ROOT, f), 'utf-8'));
    })
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function loadPost(slug: string): Promise<BlogPost> {
  const raw = await readFile(path.join(ROOT, `${slug}.mdx`), 'utf-8');
  return parsePost(slug, raw);
}
