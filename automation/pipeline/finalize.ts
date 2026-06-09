/**
 * Ships a prepared run: render card -> (optional) write blog -> publish to FB ->
 * append ledger -> commit. Dry-run by default; pass --live to actually publish.
 *
 * A "run dir" contains the agent's outputs:
 *   card.json     CardConfig for the branded card
 *   caption.txt   the Facebook caption
 *   meta.json     { track, subject, sourceUrl?, angle?, blog?: BlogInput }
 *
 * Usage:
 *   tsx automation/pipeline/finalize.ts <run-dir> [--live]
 */
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import type { CardConfig, Track, LedgerEntry } from '../types';
import { renderCard } from '../cards/render';
import { writeBlog, type BlogInput } from '../blog/writeBlog';
import { publishCardPost } from '../publish/meta';
import { loadMetaEnv, derivePageToken } from '../publish/pageToken';
import { loadLedger, appendRun, saveLedger } from '../ledger/ledger';

const SITE = 'https://aipasakon.com';
const LEDGER_PATH = resolve(process.cwd(), 'automation/ledger.json');
const BLOG_DIR = resolve(process.cwd(), 'content/blog');

interface RunMeta {
  track: Track;
  subject: string;
  sourceUrl?: string;
  angle?: string;
  blog?: BlogInput;
}

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes('--live');
  const runDir = args.find(a => !a.startsWith('--'));
  if (!runDir) {
    console.error('usage: tsx automation/pipeline/finalize.ts <run-dir> [--live]');
    process.exit(1);
  }

  const card = JSON.parse(readFileSync(join(runDir, 'card.json'), 'utf8')) as CardConfig;
  const caption = readFileSync(join(runDir, 'caption.txt'), 'utf8').trim();
  const meta = JSON.parse(readFileSync(join(runDir, 'meta.json'), 'utf8')) as RunMeta;

  // 1. Render the card.
  const cardPng = join(runDir, 'card.png');
  await renderCard(card, cardPng);
  console.log('rendered card ->', cardPng);

  // 2. Optional companion blog.
  let blogUrl: string | undefined;
  let blogPath: string | undefined;
  if (meta.blog) {
    blogPath = writeBlog(BLOG_DIR, meta.blog);
    blogUrl = `${SITE}/blog/${meta.blog.slug}`;
    console.log('wrote blog ->', blogPath, '(', blogUrl, ')');
  }

  // 3. Page token (derived from the system-user token in env / root .env).
  const { systemUserToken, pageId } = loadMetaEnv();
  if (live && !systemUserToken) {
    console.error('META_SYSTEM_USER_TOKEN not found (env or ../.env) — required for --live');
    process.exit(1);
  }
  const pageToken = live ? await derivePageToken(systemUserToken, pageId) : '';

  // 4. Publish (dry-run unless --live).
  const res = await publishCardPost({ pageId, token: pageToken, imagePath: cardPng, caption, dryRun: !live });

  let permalink: string | undefined;
  if (!res.dryRun && res.postId) {
    try {
      const r = await fetch(`https://graph.facebook.com/v21.0/${res.postId}?fields=permalink_url&access_token=${pageToken}`);
      permalink = ((await r.json()) as { permalink_url?: string }).permalink_url;
    } catch { /* non-fatal */ }
  }

  // 5. Ledger.
  const entry: LedgerEntry = {
    date: new Date().toISOString().slice(0, 10),
    track: meta.track,
    subject: meta.subject,
    status: res.dryRun ? 'draft' : 'posted',
    sourceUrl: meta.sourceUrl,
    blogUrl,
    postId: res.postId,
    card: cardPng,
    angle: meta.angle,
  };
  const ledger = appendRun(loadLedger(LEDGER_PATH), entry);
  saveLedger(LEDGER_PATH, ledger);

  // 6. Commit on live (blog + ledger). Push/deploy is handled separately.
  if (live) {
    const files = ['automation/ledger.json'];
    if (blogPath) files.push(`content/blog/${meta.blog!.slug}.mdx`);
    try {
      execSync(`git add ${files.join(' ')}`, { stdio: 'ignore' });
      execSync(`git commit -m "content(${meta.track}): ${meta.subject}"`, { stdio: 'ignore' });
      console.log('committed:', files.join(', '));
    } catch { console.log('(nothing to commit / commit skipped)'); }
  }

  if (res.dryRun) {
    console.log('\nDRY RUN — would post to', res.endpoint);
    if (blogUrl) console.log('blog link:', blogUrl);
    console.log('caption:\n' + caption);
  } else {
    console.log('\nPOSTED. post id:', res.postId);
    if (permalink) console.log('permalink:', permalink);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
