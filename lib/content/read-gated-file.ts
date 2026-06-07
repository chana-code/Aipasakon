import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getGatedArticle } from '@/lib/content/gated-articles';

const GATED_DIR = path.join(process.cwd(), 'gated-content');

/**
 * Read a gated article's raw HTML. Only files named in the registry are reachable —
 * the slug is resolved to a registry entry first, so arbitrary paths cannot be requested.
 * Returns null if the slug is unknown or the file is missing.
 */
export async function readGatedFile(slug: string): Promise<string | null> {
  const article = getGatedArticle(slug);
  if (!article) return null;
  try {
    return await readFile(path.join(GATED_DIR, article.file), 'utf8');
  } catch {
    return null;
  }
}
