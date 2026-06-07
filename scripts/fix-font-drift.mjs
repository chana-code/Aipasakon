#!/usr/bin/env node
// One-shot codemod: make every element use Prompt by removing the off-system
// Tailwind font classes (Noto Serif Thai, DM Sans) so text inherits Prompt from <body>.
// Also removes the now-dead ${SERIF}/${SANS} interpolations and their empty consts.
// Formatting-preserving: only removes the exact tokens + one adjacent space. Idempotent.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['app', 'components'];
const CLASS_LITERALS = [
  "font-['Noto_Serif_Thai',serif]",
  "font-['DM_Sans',sans-serif]",
];
const INTERP = ['${SERIF}', '${SANS}'];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith('.tsx')) acc.push(full);
  }
  return acc;
}

// Remove `token` plus exactly one adjacent space (prefer trailing, then leading, then bare).
function removeToken(src, token) {
  let removed = 0;
  for (const variant of [token + ' ', ' ' + token, token]) {
    const parts = src.split(variant);
    if (parts.length > 1) {
      removed += parts.length - 1;
      src = parts.join('');
    }
  }
  return { src, removed };
}

let filesChanged = 0;
let totalRemoved = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    let src = fs.readFileSync(file, 'utf8');
    const before = src;
    let removedHere = 0;

    for (const lit of CLASS_LITERALS) {
      const r = removeToken(src, lit);
      src = r.src;
      removedHere += r.removed;
    }
    // After class removal, font consts hold "" — drop their dead interpolations...
    for (const tok of INTERP) {
      src = removeToken(src, tok).src;
    }
    // ...and the now-empty declarations (handles variable spacing like `SANS  = ""`).
    src = src.replace(/^[ \t]*const (?:SERIF|SANS)\s*=\s*(?:""|'');[ \t]*\r?\n/gm, '');

    if (src !== before) {
      fs.writeFileSync(file, src, 'utf8');
      filesChanged++;
      totalRemoved += removedHere;
      console.log(`  ${file}: removed ${removedHere}`);
    }
  }
}

console.log(`\nfix-font-drift: ${totalRemoved} class instances removed across ${filesChanged} files`);
