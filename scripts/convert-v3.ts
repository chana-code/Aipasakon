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

// file (relative to V3) -> { level, slug, order }
const MAP: { file: string; level: string; slug: string; order: number }[] = [
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
];

// Map any cross-link target basename (with or without leading agenda digits) -> site route.
// Only deployed chapters (sections 1–2) get a route; everything else (3.x/4.x/appendix)
// is dropped to plain text so we never emit a 404 link.
const ROUTE: Record<string, string> = {};
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
      last_reviewed: '2026-06-07',
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
