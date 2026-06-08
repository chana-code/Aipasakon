import matter from 'gray-matter';
import { Skill } from '@/lib/content/skills';
import type { Skill as SkillType } from '@/lib/content/skills';

/**
 * Parse a single skill source file (frontmatter + markdown body) into a Skill.
 * The slug is taken from the filename, not the frontmatter, so files are the
 * single source of slug truth (no drift).
 */
export function parseSkillFile(slug: string, raw: string): SkillType {
  const { data, content } = matter(raw);
  // Strip HTML comments MDX cannot parse (same rule as chapters/blog).
  const body = content.replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!body) throw new Error(`Skill "${slug}" has an empty body`);
  return Skill.parse({
    name: data.name,
    slug,
    repo: data.repo,
    type: data.type,
    tagline: data.tagline,
    tags: Array.isArray(data.tags) ? data.tags : [],
    commands: Array.isArray(data.commands) ? data.commands : [],
    category: data.category, // legacy, optional
    body,
  });
}
