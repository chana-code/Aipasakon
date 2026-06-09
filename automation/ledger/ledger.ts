import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { Track, Ledger, LedgerEntry } from '../types';

export const ROTATION: Track[] = ['tools', 'news', 'knowledge'];

export function nextTrack(ledger: Ledger): Track {
  return ROTATION[ledger.rotationIndex % ROTATION.length];
}

/** Returns a new ledger with the entry appended and rotation advanced. Pure. */
export function appendRun(ledger: Ledger, entry: LedgerEntry): Ledger {
  return { rotationIndex: ledger.rotationIndex + 1, runs: [...ledger.runs, entry] };
}

export function wasPosted(ledger: Ledger, sourceUrl: string): boolean {
  return ledger.runs.some(r => r.status === 'posted' && r.sourceUrl === sourceUrl);
}

export function recentKnowledgePages(ledger: Ledger, n: number): string[] {
  return ledger.runs
    .filter(r => r.track === 'knowledge')
    .map(r => r.subject)
    .reverse()
    .slice(0, n);
}

export function anglesForSubject(ledger: Ledger, subject: string): string[] {
  return ledger.runs
    .filter(r => r.track === 'tools' && r.subject === subject && r.angle)
    .map(r => r.angle as string);
}

export function loadLedger(path: string): Ledger {
  if (!existsSync(path)) return { rotationIndex: 0, runs: [] };
  return JSON.parse(readFileSync(path, 'utf8')) as Ledger;
}

export function saveLedger(path: string, ledger: Ledger): void {
  writeFileSync(path, JSON.stringify(ledger, null, 2) + '\n');
}
