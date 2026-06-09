import { readFileSync } from 'fs';
import type { ToolCandidate, Ledger } from '../types';
import { anglesForSubject } from '../ledger/ledger';

export function listToolCandidates(skillsJsonPath: string): ToolCandidate[] {
  const raw = JSON.parse(readFileSync(skillsJsonPath, 'utf8'));
  const items: any[] = Array.isArray(raw)
    ? raw
    : (raw.skills ?? raw.tools ?? raw.items ?? Object.values(raw).find(Array.isArray) ?? []);
  return items.map((s: any) => ({
    slug: s.slug, name: s.name, type: s.type ?? '', tagline: s.tagline ?? '',
    repo: s.repo ?? '', commands: s.commands ?? [],
  }));
}

/** Pick the tool with the fewest prior angles so coverage rotates and recurring tools get fresh angles. */
export function pickTool(candidates: ToolCandidate[], ledger: Ledger): { tool: ToolCandidate; usedAngles: string[] } | null {
  if (!candidates.length) return null;
  let best = candidates[0]; let bestN = Infinity;
  for (const c of candidates) {
    const n = anglesForSubject(ledger, c.slug).length;
    if (n < bestN) { bestN = n; best = c; }
  }
  return { tool: best, usedAngles: anglesForSubject(ledger, best.slug) };
}
