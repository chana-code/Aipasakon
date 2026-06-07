#!/usr/bin/env node
// Project-owned anti-pattern lint. Firm rule: no off-system fonts (must stay Prompt).
// Plus two cross-brand bans that still hold per DESIGN.md anti-references.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const RULES = [
  {
    id: 'off-system-font',
    re: /font-\['Noto_Serif_Thai'|font-\['DM_Sans'/,
    msg: "off-system font class — use Prompt (inherited); see DESIGN.md",
  },
  {
    id: 'gradient-text',
    re: /bg-clip-text|background-clip:\s*text/,
    msg: 'gradient text is banned — solid color, emphasize with weight/size',
  },
  {
    id: 'ai-brain-illustration',
    // Match brain/neural-net only as image filenames, so font names like
    // "JetBrains Mono" don't false-positive on the substring "brain".
    re: /brain\.(svg|png|jpg|jpeg|webp)|neural-net(work)?\.(svg|png|jpg|jpeg|webp)/i,
    msg: 'AI brain / neural-net illustration is an anti-reference (DESIGN.md)',
  },
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

export function scanAntipatterns(roots) {
  const findings = [];
  for (const root of roots) {
    for (const file of walk(root)) {
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, idx) => {
        for (const rule of RULES) {
          if (rule.re.test(line)) {
            findings.push({ rule: rule.id, file: `${file}:${idx + 1}`, msg: rule.msg });
          }
        }
      });
    }
  }
  return findings;
}

// Run as CLI when invoked directly. pathToFileURL handles spaces/encoding in the
// path (e.g. "/Users/admin/AI Page/") that a raw `file://` + argv compare would miss.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const findings = scanAntipatterns(['app', 'components', 'styles']);
  if (findings.length) {
    for (const f of findings) console.error(`✗ [${f.rule}] ${f.file} — ${f.msg}`);
    console.error(`\n${findings.length} anti-pattern(s) found.`);
    process.exit(1);
  }
  console.log('✓ no anti-patterns found');
}
