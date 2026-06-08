/**
 * snapshot-stars.ts — refresh content/skills-stars.json from the live GitHub API.
 * The snapshot is a FALLBACK only (the site fetches live stars at render time); this
 * keeps it current so popularity numbers never vanish if the API is rate-limited/down.
 *
 * Repos that fail to fetch (rate limit, network) KEEP their existing snapshot value
 * rather than being overwritten with null. Run: `npm run snapshot:stars`
 * (optionally set GITHUB_TOKEN to avoid the 60/hr unauthenticated limit).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { repoPath } from '@/lib/content/github-stars';
import { loadSkills } from '@/lib/content/skills';

const OUT = path.resolve(process.cwd(), 'content/skills-stars.json');

async function liveStars(slug: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

async function main() {
  const prev: Record<string, number> = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, 'utf-8'))
    : {};
  const skills = await loadSkills();
  const out: Record<string, number> = { ...prev };
  let updated = 0;
  let kept = 0;

  for (const s of skills) {
    const slug = repoPath(s.repo);
    if (!slug) continue;
    const live = await liveStars(slug);
    if (live != null) {
      out[slug] = live;
      updated++;
    } else if (slug in prev) {
      kept++; // rate-limited/failed — keep the previous value
    } else {
      console.warn(`  no live + no prior value for ${slug}`);
    }
  }

  // sort keys for a stable diff
  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  console.log(`snapshot-stars: ${updated} refreshed, ${kept} kept from prior -> ${path.relative(process.cwd(), OUT)}`);
}

main();
