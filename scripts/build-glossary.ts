/**
 * build-glossary.ts — parse the founder-maintained glossary markdown into the
 * site glossary JSON. Single source: AI-Pasa-Kon/website-content/v3/appendix/A-glossary.md.
 * Re-run after editing that file: npx tsx scripts/build-glossary.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseGlossaryMarkdown } from './lib/parse-glossary';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const SOURCE = path.join(PROJECT_ROOT, 'AI-Pasa-Kon/website-content/v3/appendix/A-glossary.md');
const OUT = path.resolve(process.cwd(), 'content/glossary.json');

if (!existsSync(SOURCE)) {
  throw new Error(`Glossary source not found: ${SOURCE}`);
}
const entries = parseGlossaryMarkdown(readFileSync(SOURCE, 'utf-8'));
if (entries.length === 0) {
  throw new Error(`Parsed 0 glossary entries from ${SOURCE} — check the markdown format.`);
}
writeFileSync(OUT, JSON.stringify(entries, null, 2) + '\n', 'utf-8');
console.log(`Wrote ${entries.length} glossary entries -> ${path.relative(process.cwd(), OUT)}`);
