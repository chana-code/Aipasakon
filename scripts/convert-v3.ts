/**
 * convert-v3.ts — publish V.3 curriculum sections 1–2 into the live site.
 *
 * Reads the hand-authored markdown in AI-Pasa-Kon/website-content/v3/, transforms it into
 * site MDX (new frontmatter, web-safe image embeds, rewritten cross-links), copies referenced
 * assets into website/public/content/, and writes content/chapters/<level>/<slug>.mdx.
 *
 * Run with: npx tsx scripts/convert-v3.ts
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');           // /Users/admin/AI Page
const V3 = path.join(PROJECT_ROOT, 'AI-Pasa-Kon/website-content/v3');
const IMAGES = path.join(PROJECT_ROOT, 'AI-Pasa-Kon/Images');
const SITE = process.cwd();                                        // website/
const PUBLIC_CONTENT = path.join(SITE, 'public/content');
const CHAPTERS = path.join(SITE, 'content/chapters');

// file (relative to V3) -> { level, slug, order, reviewed? (last_reviewed date, defaults to 2026-06-07) }
const MAP: { file: string; level: string; slug: string; order: number; reviewed?: string }[] = [
  { file: 'section-1-what-is-ai/1.1-history.md',          level: 'what-is-ai', slug: 'history',           order: 1 },
  { file: 'section-1-what-is-ai/1.2-how-it-trains.md',    level: 'what-is-ai', slug: 'how-it-trains',     order: 2 },
  { file: 'section-1-what-is-ai/1.3-what-it-really-is.md',level: 'what-is-ai', slug: 'what-it-really-is', order: 3 },
  { file: 'section-1-what-is-ai/1.4-llm-mechanics.md',    level: 'what-is-ai', slug: 'llm-mechanics',     order: 4 },
  { file: 'section-1-what-is-ai/1.5-the-zoo.md',          level: 'what-is-ai', slug: 'the-zoo',           order: 5 },
  { file: 'section-1-what-is-ai/1.6-hard-limits.md',      level: 'what-is-ai', slug: 'hard-limits',       order: 6 },
  { file: 'section-2-products/2.1.1-the-model (revised).md', level: 'products', slug: 'the-model',           order: 1 },
  { file: 'section-2-products/2.1.2-the-harness.md',         level: 'products', slug: 'the-harness',         order: 2 },
  { file: 'section-2-products/2.1.3-press-enter.md',         level: 'products', slug: 'press-enter',         order: 3 },
  { file: 'section-2-products/2.1.4-surfaces.md',            level: 'products', slug: 'surfaces',            order: 4 },
  { file: 'section-2-products/2.1.5-product-comparison.md',  level: 'products', slug: 'product-comparison',  order: 5 },
  { file: 'section-2-products/2.1.6-api-vs-app.md',          level: 'products', slug: 'api-vs-app',          order: 6 },
  // Section 3 — Pro usage (3.1–3.7) — reviewed + published 2026-07-09
  { file: 'section-3-pro-usage/3.1-memory-context.md',    level: 'pro-usage', slug: 'memory-context',        order: 1, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.2-token-optimization.md',level: 'pro-usage', slug: 'token-optimization',    order: 2, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.3-skills.md',            level: 'pro-usage', slug: 'skills-commands-hooks', order: 3, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.4-connectors.md',        level: 'pro-usage', slug: 'connectors',            order: 4, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.5-builder-track.md',     level: 'pro-usage', slug: 'builder-track',         order: 5, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.6-talking-to-ai.md',     level: 'pro-usage', slug: 'talking-to-ai',         order: 6, reviewed: '2026-07-09' },
  { file: 'section-3-pro-usage/3.7-judgment-safety.md',   level: 'pro-usage', slug: 'judgment-safety',       order: 7, reviewed: '2026-07-09' },
  // Section 4 — In practice (4.1–4.3) + Appendix B as the closing "เมื่อมันพัง" chapter
  { file: 'section-4-in-practice/4.1-onramp.md',          level: 'in-practice', slug: 'onramp',          order: 1, reviewed: '2026-07-09' },
  { file: 'section-4-in-practice/4.2-reading-docs.md',    level: 'in-practice', slug: 'reading-docs',    order: 2, reviewed: '2026-07-09' },
  { file: 'section-4-in-practice/4.3-build-once.md',      level: 'in-practice', slug: 'build-once',      order: 3, reviewed: '2026-07-09' },
  { file: 'appendix/B-troubleshooting.md',                level: 'in-practice', slug: 'troubleshooting', order: 4, reviewed: '2026-07-09' },
  // Section 5 — Vibe Coding (Part A foundations 5.1–5.8, Part B sustainability 5.9–5.19)
  { file: 'section-5-vibe-coding/5.1-build-loop.md',                 level: 'vibe-coding', slug: 'build-loop',                 order: 1 },
  { file: 'section-5-vibe-coding/5.2-anatomy.md',                    level: 'vibe-coding', slug: 'anatomy',                    order: 2 },
  { file: 'section-5-vibe-coding/5.3-project-files-repo.md',         level: 'vibe-coding', slug: 'project-files-repo',         order: 3 },
  { file: 'section-5-vibe-coding/5.4-git.md',                        level: 'vibe-coding', slug: 'git',                        order: 4 },
  { file: 'section-5-vibe-coding/5.5-terminal.md',                   level: 'vibe-coding', slug: 'terminal',                   order: 5 },
  { file: 'section-5-vibe-coding/5.6-localhost.md',                  level: 'vibe-coding', slug: 'localhost',                  order: 6 },
  { file: 'section-5-vibe-coding/5.7-deploy.md',                     level: 'vibe-coding', slug: 'deploy',                     order: 7 },
  { file: 'section-5-vibe-coding/5.8-capstone.md',                   level: 'vibe-coding', slug: 'capstone',                   order: 8 },
  { file: 'section-5-vibe-coding/5.9-the-reframe.md',                level: 'vibe-coding', slug: 'the-reframe',                order: 9 },
  { file: 'section-5-vibe-coding/5.10-reversibility.md',             level: 'vibe-coding', slug: 'reversibility',             order: 10 },
  { file: 'section-5-vibe-coding/5.11-the-small-change.md',          level: 'vibe-coding', slug: 'the-small-change',          order: 11 },
  { file: 'section-5-vibe-coding/5.12-preview-before-production.md', level: 'vibe-coding', slug: 'preview-before-production', order: 12 },
  { file: 'section-5-vibe-coding/5.13-external-memory.md',           level: 'vibe-coding', slug: 'external-memory',           order: 13 },
  { file: 'section-5-vibe-coding/5.14-pointing-precisely.md',        level: 'vibe-coding', slug: 'pointing-precisely',        order: 14 },
  { file: 'section-5-vibe-coding/5.15-reading-your-data.md',         level: 'vibe-coding', slug: 'reading-your-data',         order: 15 },
  { file: 'section-5-vibe-coding/5.16-verification.md',              level: 'vibe-coding', slug: 'verification',              order: 16 },
  { file: 'section-5-vibe-coding/5.17-the-danger-map.md',            level: 'vibe-coding', slug: 'the-danger-map',            order: 17 },
  { file: 'section-5-vibe-coding/5.18-when-it-breaks.md',            level: 'vibe-coding', slug: 'when-it-breaks',            order: 18 },
  { file: 'section-5-vibe-coding/5.19-know-your-ceiling.md',         level: 'vibe-coding', slug: 'know-your-ceiling',         order: 19 },
];

// Map any cross-link target basename (with or without leading agenda digits) -> site route.
// Only chapters in MAP get a route; anything undeployed is dropped to plain text so we
// never emit a 404 link. Appendix A is served by the standalone /glossary page.
const ROUTE: Record<string, string> = {
  'A-glossary': '/glossary',
  'glossary': '/glossary',
};
for (const m of MAP) {
  const base = path.basename(m.file).replace(/\.md$/, '').replace(/ \(revised\)$/, '');
  ROUTE[base] = `/${m.level}/${m.slug}`;          // e.g. "1.1-history" / "2.1.1-the-model"
  ROUTE[m.slug] = `/${m.level}/${m.slug}`;        // e.g. "history"
}

// Obsidian embed basename -> source absolute path + sanitized public filename.
const ASSETS: Record<string, { src: string; out: string; kind: 'img' | 'iframe' | 'lab'; labId?: string }> = {
  'ai_system_layers_onion.svg':        { src: path.join(PROJECT_ROOT, 'ai_system_layers_onion.svg'),        out: 'ai_system_layers_onion.svg',        kind: 'img' },
  'weights_as_connection_strength.svg':{ src: path.join(PROJECT_ROOT, 'weights_as_connection_strength.svg'),out: 'weights_as_connection_strength.svg',kind: 'img' },
  // This file now lives in public/lab/ and is served via <Lab id="after-send-walkthrough"/>.
  // Do NOT copy it (it's version-controlled in place) and emit the <Lab> tag instead.
  'what_happens_after_send_thai_steps.html': { src: '', out: '', kind: 'lab', labId: 'after-send-walkthrough' },
  'ChatGPT Image Jun 7, 2026, 01_48_48 AM.png': { src: path.join(PROJECT_ROOT, 'ChatGPT Image Jun 7, 2026, 01_48_48 AM.png'), out: 'chatgpt-20260607-014848.png', kind: 'img' },
  'ChatGPT Image Jun 7, 2026, 01_52_56 AM.png': { src: path.join(PROJECT_ROOT, 'ChatGPT Image Jun 7, 2026, 01_52_56 AM.png'), out: 'chatgpt-20260607-015256.png', kind: 'img' },
};

const copied = new Set<string>();
function copyAsset(srcAbs: string, outName: string) {
  if (copied.has(outName)) return;
  if (!existsSync(srcAbs)) { console.warn('  ! MISSING ASSET:', srcAbs); return; }
  copyFileSync(srcAbs, path.join(PUBLIC_CONTENT, outName));
  copied.add(outName);
  console.log('  copied asset ->', outName);
}

function transformBody(raw: string): string {
  let body = raw;

  // 1. Obsidian embeds:  ![[name|width]]  or  ![[name]]
  // IMPORTANT: emit *markdown* images, not raw JSX <img>. next-mdx-remote/rsc hydrates
  // raw intrinsic JSX inconsistently (recoverable hydration error); markdown images are clean.
  // The single HTML embed renders through the <Embed> client component (mapped in the page).
  body = body.replace(/!\[\[([^\]|]+?)(?:\|(\d+))?\]\]/g, (_m, name: string) => {
    const key = name.trim();
    const a = ASSETS[key];
    if (!a) { console.warn('  ! unknown embed:', key); return ''; }
    if (a.kind === 'lab') {
      // File lives in public/lab/ and is rendered by <Lab>; no copy needed.
      return `\n\n<Lab id="${a.labId}" />\n\n`;
    }
    copyAsset(a.src, a.out);
    const url = `/content/${a.out}`;
    if (a.kind === 'iframe') {
      return `\n\n<Embed src="${url}" title="ภาพประกอบเชิงโต้ตอบ" />\n\n`;
    }
    const alt = key.replace(/\.[a-z0-9]+$/i, '');
    return `\n\n![${alt}](${url})\n\n`;
  });

  // 2. Markdown images with a relative path into the Images dir -> /content/<basename>
  body = body.replace(/!\[([^\]]*)\]\((?:\.\.\/)+Images\/([^)]+)\)/g, (_m, alt: string, file: string) => {
    const base = path.basename(file);
    copyAsset(path.join(IMAGES, base), base);
    return `![${alt}](/content/${base})`;
  });

  // 3. Cross-links to .md files -> site route, or drop to plain text if not deployed.
  body = body.replace(/\[([^\]]+)\]\(([^)]*?\.md)\)/g, (_m, text: string, target: string) => {
    const base = path.basename(target).replace(/\.md$/, '');
    const route = ROUTE[base];
    return route ? `[${text}](${route})` : text;
  });

  return body;
}

function run() {
  mkdirSync(PUBLIC_CONTENT, { recursive: true });
  for (const m of MAP) {
    const srcPath = path.join(V3, m.file);
    const raw = readFileSync(srcPath, 'utf-8');
    const { data, content } = matter(raw);

    let body = transformBody(content);

    // append sources as a references section
    const sources: string[] = Array.isArray(data.sources) ? data.sources : [];
    if (sources.length) {
      body = body.trimEnd() + '\n\n## แหล่งอ้างอิง\n\n' + sources.map(s => `- ${s}`).join('\n') + '\n';
    }

    const fm = {
      slug: m.slug,
      level: m.level,
      order: m.order,
      title: String(data.title ?? '').trim(),
      status: 'reviewed' as const,
      prerequisites: [] as string[],
      last_reviewed: m.reviewed ?? '2026-06-07',
      tldr: String(data.description ?? '').trim() || undefined,
    };

    const outDir = path.join(CHAPTERS, m.level);
    mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${m.slug}.mdx`);
    writeFileSync(outFile, matter.stringify(body.trimStart(), fm), 'utf-8');
    console.log(`wrote ${m.level}/${m.slug}.mdx  (${fm.title})`);
  }
  console.log(`\nDone. ${MAP.length} chapters, ${copied.size} assets.`);
}

run();
