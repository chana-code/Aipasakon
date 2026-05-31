import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { ChapterFrontmatter } from './schemas';
import { LEVELS, type Level } from './levels';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content/chapters');

export type Chapter = ChapterFrontmatter & { body: string };

async function readChapterFile(level: Level, file: string): Promise<Chapter> {
  const raw = await readFile(path.join(CONTENT_ROOT, level, file), 'utf-8');
  const { data, content } = matter(raw);
  // gray-matter auto-parses YAML dates into JS Date objects; coerce back to string
  if (data.last_reviewed instanceof Date) {
    data.last_reviewed = data.last_reviewed.toISOString().slice(0, 10);
  }
  const fm = ChapterFrontmatter.parse(data);
  if (fm.level !== level) {
    throw new Error(`chapter ${fm.slug} has level "${fm.level}" but lives in /${level}/`);
  }
  // Authoring annotations like `<!-- IMAGE: ... -->` are HTML comments, which MDX
  // cannot parse (it expects JSX). Strip them before handing the body to MDXRemote.
  // They remain in the source files as image-generation placeholders.
  const body = content.replace(/<!--[\s\S]*?-->/g, '');
  return { ...fm, body };
}

export async function loadAllChapters(): Promise<Chapter[]> {
  const all: Chapter[] = [];
  for (const level of LEVELS) {
    const dir = path.join(CONTENT_ROOT, level);
    let files: string[] = [];
    try { files = await readdir(dir); } catch { continue; }
    for (const file of files) {
      if (!file.endsWith('.mdx')) continue;
      all.push(await readChapterFile(level, file));
    }
  }
  return all;
}

export async function loadChapter(level: Level, slug: string): Promise<Chapter> {
  return readChapterFile(level, `${slug}.mdx`);
}
