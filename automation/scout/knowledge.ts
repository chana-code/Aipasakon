import { loadAllChapters } from '../../lib/content/chapters';
import type { KnowledgePage, Ledger } from '../types';
import { recentKnowledgePages } from '../ledger/ledger';

const SITE = 'https://aipasakon.com';

export async function listKnowledgePages(): Promise<KnowledgePage[]> {
  const chapters = await loadAllChapters();
  return chapters.map(c => ({ slug: c.slug, level: c.level, title: c.title, url: `${SITE}/${c.level}/${c.slug}` }));
}

export function pickKnowledge(pages: KnowledgePage[], ledger: Ledger, recentN = 8): KnowledgePage | null {
  const recent = new Set(recentKnowledgePages(ledger, recentN));
  const fresh = pages.filter(p => !recent.has(p.slug));
  return fresh[0] ?? pages[0] ?? null;
}
