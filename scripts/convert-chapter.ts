/**
 * convert-chapter.ts
 *
 * Converts KB markdown files (Obsidian format) to website MDX format.
 *
 * Exported functions are used by tests and can be imported individually.
 * When executed directly (CLI), converts all chapters from the KB source.
 */

import matter from 'gray-matter';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KBFrontmatter {
  title: string;
  level: number;
  chapter?: string;
  status: 'stub' | 'drafting' | 'reviewed' | 'stable';
  prerequisites?: string[];
  'learning-objectives'?: string[];
  tags?: string[];
  related?: string[];
  sources?: string[];
  'last-updated'?: string | Date;
  [key: string]: unknown;
}

export interface WebFrontmatter {
  slug: string;
  level: 'foundations' | 'using-ai' | 'building-with-ai' | 'advanced';
  title: string;
  status: 'stub' | 'drafting' | 'reviewed' | 'stable';
  prerequisites: string[];
  last_reviewed?: string;
  tldr?: string;
}

// ---------------------------------------------------------------------------
// Level mapping
// ---------------------------------------------------------------------------

const LEVEL_MAP: Record<number, WebFrontmatter['level']> = {
  1: 'foundations',
  2: 'using-ai',
  3: 'building-with-ai',
  4: 'advanced',
};

const LEVEL_DIR_MAP: Record<string, WebFrontmatter['level']> = {
  '01': 'foundations',
  '02': 'using-ai',
  '03': 'building-with-ai',
  '04': 'advanced',
};

// ---------------------------------------------------------------------------
// resolveWikilink
// ---------------------------------------------------------------------------

/**
 * Converts a `[[wikilink]]` string to a Markdown link or empty string.
 *
 * Rules:
 * - `[[06-references/...]]` → "" (stripped)
 * - `[[NN-level-name/topic]]` → `[topic](/level-name/topic)` (cross-level)
 * - `[[topic]]` → `[topic](/currentLevel/topic)` (same-level)
 */
export function resolveWikilink(wikilink: string, currentLevel: string): string {
  // Strip outer [[ ]]
  const inner = wikilink.replace(/^\[\[/, '').replace(/\]\]$/, '');

  // Strip reference links entirely
  if (inner.startsWith('06-references')) {
    return '';
  }

  // Cross-level link: e.g. "01-foundations/what-is-an-llm" or "03-building-with-ai/topic"
  const crossLevelMatch = inner.match(/^(\d{2})-([^/]+)\/(.+)$/);
  if (crossLevelMatch) {
    const prefix = crossLevelMatch[1]!;
    const topic = crossLevelMatch[3]!;
    const levelName = LEVEL_DIR_MAP[prefix];
    if (levelName) {
      return `[${topic}](/${levelName}/${topic})`;
    }
  }

  // Same-level link (no slash, no reference)
  if (!inner.includes('/')) {
    return `[${inner}](/${currentLevel}/${inner})`;
  }

  // Fallback: strip brackets as plain text
  return inner;
}

/**
 * Extracts the plain slug from a wikilink prerequisite string.
 * `[[01-foundations/what-is-an-llm]]` → `what-is-an-llm`
 * `[[how-llms-respond]]` → `how-llms-respond`
 */
function extractPrereqSlug(prereq: string): string {
  const inner = prereq.replace(/^\[\[/, '').replace(/\]\]$/, '');

  // Cross-level: take only the topic part
  const crossLevelMatch = inner.match(/^\d{2}-[^/]+\/(.+)$/);
  if (crossLevelMatch) {
    return crossLevelMatch[1]!;
  }

  return inner;
}

// ---------------------------------------------------------------------------
// convertFrontmatter
// ---------------------------------------------------------------------------

/**
 * Maps KB frontmatter to web frontmatter.
 * - Maps level number → string enum
 * - Strips wikilinks from prerequisites (keeps slug only)
 * - Renames last-updated → last_reviewed
 * - Drops KB-only fields
 * - Includes tldr if provided
 */
export function convertFrontmatter(
  kb: KBFrontmatter,
  slug: string,
  tldrText?: string,
): WebFrontmatter {
  const level = LEVEL_MAP[kb.level];
  if (!level) {
    throw new Error(`Unknown level number: ${kb.level}`);
  }

  const prerequisites = (kb.prerequisites ?? []).map(extractPrereqSlug);

  const fm: WebFrontmatter = {
    slug,
    level,
    title: kb.title,
    status: kb.status,
    prerequisites,
  };

  if (kb['last-updated']) {
    const raw = kb['last-updated'];
    // gray-matter may coerce date strings to JS Date objects
    if (raw instanceof Date) {
      fm.last_reviewed = raw.toISOString().slice(0, 10);
    } else {
      fm.last_reviewed = String(raw);
    }
  }

  if (tldrText !== undefined && tldrText.trim()) {
    fm.tldr = tldrText.trim();
  }

  return fm;
}

// ---------------------------------------------------------------------------
// Wikilink replacement in text
// ---------------------------------------------------------------------------

function replaceWikilinks(text: string, level: string): string {
  return text.replace(/\[\[[^\]]+\]\]/g, (match) => resolveWikilink(match, level));
}

// ---------------------------------------------------------------------------
// Section extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the content of a named section from a markdown body.
 * Returns null if the section is not found.
 *
 * `headingPattern` should match the full heading line (e.g. /^## TL;DR/)
 * Content ends at the next same-or-higher level heading.
 */
function extractSection(
  body: string,
  headingPattern: RegExp,
  stopPatterns?: RegExp[],
): string | null {
  const lines = body.split('\n');
  let inSection = false;
  const collected: string[] = [];

  // Determine heading depth from the pattern (count leading #)
  let headingDepth = 2; // default

  for (const line of lines) {
    if (!inSection) {
      if (headingPattern.test(line)) {
        inSection = true;
        // don't include the heading line itself
      }
      continue;
    }

    // Check if this line is a heading at the same or higher level
    const headingMatch = line.match(/^(#{1,6})\s/);
    if (headingMatch) {
      const depth = headingMatch[1]!.length;
      if (depth <= headingDepth) {
        break; // end of section
      }
    }

    // Check custom stop patterns
    if (stopPatterns?.some((p) => p.test(line))) {
      break;
    }

    collected.push(line);
  }

  if (!inSection) return null;

  return collected.join('\n').trim();
}

/**
 * Extract the heading depth from the first matched heading.
 */
function getHeadingDepth(body: string, headingPattern: RegExp): number {
  const lines = body.split('\n');
  for (const line of lines) {
    if (headingPattern.test(line)) {
      const m = line.match(/^(#{1,6})\s/);
      return m ? m[1]!.length : 2;
    }
  }
  return 2;
}

/**
 * Extracts all content from a heading onwards, until a stop heading
 * at an equal or lower depth is found. Returns null if heading not found.
 */
function extractSectionFrom(body: string, headingPattern: RegExp): string | null {
  const lines = body.split('\n');
  let inSection = false;
  const collected: string[] = [];
  let headingDepth = 2;

  for (const line of lines) {
    if (!inSection) {
      if (headingPattern.test(line)) {
        inSection = true;
        headingDepth = (line.match(/^(#{1,6})\s/)?.[1] ?? '##').length;
        // include the heading line
        collected.push(line);
      }
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s/);
    if (headingMatch && headingMatch[1]!.length <= headingDepth) {
      break;
    }

    collected.push(line);
  }

  if (!inSection) return null;
  return collected.join('\n').trim();
}

// ---------------------------------------------------------------------------
// convertBody
// ---------------------------------------------------------------------------

// Metadata sections to strip (exact heading text patterns)
const METADATA_SECTION_PATTERNS: RegExp[] = [
  /^## Where this fits in the curriculum/,
  /^## Related Topics/,
  /^## References/,
  /^## Open Questions/,
  /^## Note Maintenance/,
];

// Sections to strip entirely (don't appear in output)
const STRIP_SECTION_PATTERNS: RegExp[] = [
  /^## Prerequisites/,
  /^## Learning Objectives/,
  ...METADATA_SECTION_PATTERNS,
];

/**
 * Converts the raw markdown body from KB format to website MDX format.
 *
 * Steps:
 * 1. Strip H1 title
 * 2. Extract TL;DR content (for surface section)
 * 3. Extract Surface section content
 * 4. Extract Deeper section content
 * 5. Extract Worked Examples, Common Misconceptions, Self-Check (added to deeper)
 * 6. Wrap sections in <section data-depth="..."> tags
 * 7. Convert wikilinks
 */
export function convertBody(rawBody: string, level: string): string {
  // 1. Strip H1 title (first # heading)
  let body = rawBody.replace(/^# .+\n?/m, '');

  // 2. Extract TL;DR content
  const tldrContent = extractSection(body, /^## TL;DR/);

  // 3. Extract Surface section content (after "## 1. Surface —...")
  const surfaceContent = extractSection(body, /^## 1\. Surface/);

  // 4. Extract Deeper section content (after "## 2. Deeper —...")
  const deeperContent = extractSection(body, /^## 2\. Deeper/);

  // 5. Extract Worked Examples, Common Misconceptions, Self-Check
  const workedExamples = extractSection(body, /^## Worked Examples/);
  const commonMisconceptions = extractSection(body, /^## Common Misconceptions/);
  const selfCheck = extractSection(body, /^## Self-Check/);

  // Build surface section
  const surfaceParts: string[] = [];
  if (tldrContent) {
    surfaceParts.push(`## พูดสั้นๆ\n\n${tldrContent}`);
  }
  if (surfaceContent) {
    surfaceParts.push(surfaceContent);
  }

  // Build deeper section
  const deeperParts: string[] = [];
  deeperParts.push('## ลึกขึ้นหน่อย');
  if (deeperContent) {
    deeperParts.push(deeperContent);
  }
  if (workedExamples) {
    deeperParts.push(`## Worked Examples\n\n${workedExamples}`);
  }
  if (commonMisconceptions) {
    deeperParts.push(`## Common Misconceptions\n\n${commonMisconceptions}`);
  }
  if (selfCheck) {
    deeperParts.push(`## Self-Check\n\n${selfCheck}`);
  }

  const surfaceSection = `<section data-depth="surface">\n\n${surfaceParts.join('\n\n')}\n\n</section>`;
  const deeperSection = `<section data-depth="deeper">\n\n${deeperParts.join('\n\n')}\n\n</section>`;

  let result = `${surfaceSection}\n\n${deeperSection}`;

  // 7. Convert wikilinks
  result = replaceWikilinks(result, level);

  // 8. Escape bare angle brackets that break MDX parsing
  result = escapeMdxAngleBrackets(result);

  return result;
}

/**
 * Escapes `<` characters in MDX content that are NOT:
 * - Inside fenced code blocks (``` ... ```)
 * - Part of our <section> / </section> tags
 * - Inside inline code spans (` ... `)
 *
 * Replaces bare `<` with `{'<'}` which MDX renders as literal `<`.
 */
function escapeMdxAngleBrackets(mdx: string): string {
  const lines = mdx.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Toggle code block state
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // Don't touch lines inside code blocks
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // For non-code lines, escape < that isn't part of <section or </section
    // First, protect inline code spans by replacing them temporarily
    const inlineCodeSpans: string[] = [];
    let processed = line.replace(/`[^`]+`/g, (match) => {
      inlineCodeSpans.push(match);
      return `__INLINE_CODE_${inlineCodeSpans.length - 1}__`;
    });

    // Escape < that isn't part of section tags — use HTML entity
    processed = processed.replace(/<(?!\/?section[\s>])/g, '&lt;');

    // Escape { and } that aren't part of section tags — MDX treats them as JSX expressions
    // Replace { → &#123; and } → &#125; (HTML entities safe in MDX)
    processed = processed.replace(/\{/g, '&#123;');
    processed = processed.replace(/\}/g, '&#125;');

    // Restore inline code spans
    processed = processed.replace(/__INLINE_CODE_(\d+)__/g, (_, idx) => {
      return inlineCodeSpans[parseInt(idx)]!;
    });

    result.push(processed);
  }

  return result.join('\n');
}

// ---------------------------------------------------------------------------
// convertChapterFile — full file conversion
// ---------------------------------------------------------------------------

/**
 * Converts a complete KB markdown file (frontmatter + body) to website MDX.
 */
export function convertChapterFile(rawMarkdown: string, slug: string): string {
  const parsed = matter(rawMarkdown);
  const kb = parsed.data as KBFrontmatter;

  // Extract TL;DR from body to put in frontmatter
  const tldrContent = extractSection(parsed.content, /^## TL;DR/);

  // Map level for body conversion
  const level = LEVEL_MAP[kb.level];
  if (!level) {
    throw new Error(`Unknown level number: ${kb.level} in file with slug ${slug}`);
  }

  const webFm = convertFrontmatter(kb, slug, tldrContent ?? undefined);
  const webBody = convertBody(parsed.content, level);

  // Serialize frontmatter to YAML manually (gray-matter stringify has quirks with special chars)
  const yamlLines: string[] = [];
  yamlLines.push(`slug: ${webFm.slug}`);
  yamlLines.push(`level: ${webFm.level}`);
  yamlLines.push(`title: ${JSON.stringify(webFm.title)}`);
  yamlLines.push(`status: ${webFm.status}`);

  if (webFm.prerequisites.length === 0) {
    yamlLines.push('prerequisites: []');
  } else {
    yamlLines.push('prerequisites:');
    for (const p of webFm.prerequisites) {
      yamlLines.push(`  - ${p}`);
    }
  }

  if (webFm.last_reviewed) {
    yamlLines.push(`last_reviewed: ${webFm.last_reviewed}`);
  }

  if (webFm.tldr) {
    yamlLines.push(`tldr: ${JSON.stringify(webFm.tldr)}`);
  }

  const frontmatterStr = `---\n${yamlLines.join('\n')}\n---`;

  return `${frontmatterStr}\n\n${webBody}\n`;
}

// ---------------------------------------------------------------------------
// CLI runner
// ---------------------------------------------------------------------------

const SKIP_FILES = new Set(['what-is-an-llm.md', '00-overview.md']);

const KB_LEVELS: Array<{ kbDir: string; webLevel: string }> = [
  { kbDir: '01-foundations', webLevel: 'foundations' },
  { kbDir: '02-using-ai', webLevel: 'using-ai' },
];

async function main() {
  const kbBase = path.resolve(__dirname, '../../AI-Pasa-Kon/00-knowledge-base');
  const webBase = path.resolve(__dirname, '../content/chapters');

  let converted = 0;
  let skipped = 0;

  for (const { kbDir, webLevel } of KB_LEVELS) {
    const kbPath = path.join(kbBase, kbDir);
    const webPath = path.join(webBase, webLevel);

    if (!existsSync(kbPath)) {
      console.warn(`KB directory not found: ${kbPath}`);
      continue;
    }

    mkdirSync(webPath, { recursive: true });

    const files = readdirSync(kbPath).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      if (SKIP_FILES.has(file)) {
        console.log(`  SKIP  ${kbDir}/${file}`);
        skipped++;
        continue;
      }

      const slug = file.replace(/\.md$/, '');
      const outFile = path.join(webPath, `${slug}.mdx`);

      if (existsSync(outFile)) {
        console.log(`  SKIP  ${webLevel}/${slug}.mdx (already exists)`);
        skipped++;
        continue;
      }

      try {
        const raw = readFileSync(path.join(kbPath, file), 'utf-8');
        const converted_content = convertChapterFile(raw, slug);
        writeFileSync(outFile, converted_content, 'utf-8');
        console.log(`  OK    ${webLevel}/${slug}.mdx`);
        converted++;
      } catch (err) {
        console.error(`  ERROR ${kbDir}/${file}: ${(err as Error).message}`);
      }
    }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped.`);
}

// Only run CLI when executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
