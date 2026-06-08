/**
 * Live GitHub star counts for the /skills catalog.
 *
 * Fetched server-side with Next.js ISR caching (revalidate hourly), so numbers stay
 * current without a rebuild and without hammering the API per visit. An optional
 * GITHUB_TOKEN raises the unauthenticated 60/hr limit to 5,000/hr. Any failure
 * (rate limit, network, 404) returns null — the UI then hides the badge rather than break.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

const REVALIDATE_SECONDS = 3600;

/**
 * Committed fallback snapshot (content/skills-stars.json: { "owner/repo": stars }).
 * Used only when the live API is unavailable (rate limit / network / down) so the
 * popularity numbers never silently vanish. Refresh with `npm run snapshot:stars`.
 */
let SNAPSHOT: Record<string, number> = {};
try {
  SNAPSHOT = JSON.parse(
    readFileSync(path.resolve(process.cwd(), 'content/skills-stars.json'), 'utf-8'),
  );
} catch {
  SNAPSHOT = {};
}

function snapshotStars(slug: string): number | null {
  if (slug in SNAPSHOT) return SNAPSHOT[slug] ?? null;
  const lower = slug.toLowerCase();
  for (const k of Object.keys(SNAPSHOT)) {
    if (k.toLowerCase() === lower) return SNAPSHOT[k] ?? null;
  }
  return null;
}

/** "https://github.com/owner/repo(.git)" -> "owner/repo" (null if not a github repo url). */
export function repoPath(repoUrl: string): string | null {
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  const owner = m?.[1];
  const repo = m?.[2];
  if (!owner || !repo) return null;
  return `${owner}/${repo.replace(/\.git$/, '')}`;
}

/** Live star count from the GitHub API, or null on any failure. Cached per-repo for an hour. */
async function fetchLiveStars(slug: string): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

/** Current star count: live when available, else the committed snapshot, else null. */
export async function fetchStars(repoUrl: string): Promise<number | null> {
  const slug = repoPath(repoUrl);
  if (!slug) return null;
  const live = await fetchLiveStars(slug);
  return live ?? snapshotStars(slug);
}

/** Fetch stars for many repos in parallel. Returns a slug-keyed map (repoPath -> stars|null). */
export async function fetchStarsForRepos(
  repoUrls: string[],
): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    repoUrls.map(async url => {
      const key = repoPath(url) ?? url;
      return [key, await fetchStars(url)] as const;
    }),
  );
  return Object.fromEntries(entries);
}

/** 42154 -> "42.2k", 148232 -> "148k", 980 -> "980". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  const rounded = k >= 100 ? Math.round(k) : Math.round(k * 10) / 10;
  return `${rounded}k`;
}
