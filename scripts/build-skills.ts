/**
 * build-skills.ts — parse founder-maintained skill source files into JSON.
 * Single source: AI-Pasa-Kon/website-content/skills/<slug>.md (one file per skill).
 * Re-run after editing: npm run build:skills
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseSkillFile } from './lib/parse-skills';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'AI-Pasa-Kon/website-content/skills');
const OUT = path.resolve(process.cwd(), 'content/skills.json');

if (!existsSync(SOURCE_DIR)) {
  throw new Error(`Skills source dir not found: ${SOURCE_DIR}`);
}

// Ignore underscore-prefixed files (e.g. _authoring-brief.md) — docs, not skills.
const files = readdirSync(SOURCE_DIR)
  .filter(f => f.endsWith('.md') && !f.startsWith('_'))
  .sort();
const skills = files.map(f => {
  const slug = f.replace(/\.md$/, '');
  return parseSkillFile(slug, readFileSync(path.join(SOURCE_DIR, f), 'utf-8'));
});

if (skills.length === 0) {
  throw new Error(`Parsed 0 skills from ${SOURCE_DIR} — add <slug>.md files.`);
}

// Fail loudly on duplicate slugs (would collide on the detail route).
const seen = new Set<string>();
for (const s of skills) {
  if (seen.has(s.slug)) throw new Error(`Duplicate skill slug: ${s.slug}`);
  seen.add(s.slug);
}

writeFileSync(OUT, JSON.stringify(skills, null, 2) + '\n', 'utf-8');
console.log(`Wrote ${skills.length} skills -> ${path.relative(process.cwd(), OUT)}`);
