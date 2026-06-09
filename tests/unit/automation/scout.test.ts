import { describe, it, expect } from 'vitest';
import { pickKnowledge } from '../../../automation/scout/knowledge';
import { listToolCandidates, pickTool } from '../../../automation/scout/tools';
import type { KnowledgePage, Ledger } from '../../../automation/types';
import { join } from 'path';

const pages: KnowledgePage[] = [
  { slug: 'a', level: 'what-is-ai', title: 'A', url: 'u/a' },
  { slug: 'b', level: 'what-is-ai', title: 'B', url: 'u/b' },
];
const ledger: Ledger = { rotationIndex: 0, runs: [
  { date: '1', track: 'knowledge', subject: 'a', status: 'posted' },
]};

describe('pickKnowledge', () => {
  it('skips recently-used pages', () => {
    expect(pickKnowledge(pages, ledger, 8)!.slug).toBe('b');
  });
  it('falls back to first page if all recently used', () => {
    const all: Ledger = { rotationIndex: 0, runs: pages.map(p => ({ date:'1', track:'knowledge' as const, subject:p.slug, status:'posted' as const })) };
    expect(pickKnowledge(pages, all, 8)!.slug).toBe('a');
  });
});

describe('tools', () => {
  it('reads the real skills.json catalog', () => {
    const items = listToolCandidates(join(process.cwd(), 'content/skills.json'));
    expect(items.length).toBeGreaterThan(5);
    expect(items[0]).toHaveProperty('slug');
    expect(items[0]).toHaveProperty('repo');
  });
  it('pickTool prefers the tool with the fewest prior angles', () => {
    const cands = [
      { slug: 'x', name:'X', type:'cli', tagline:'', repo:'', commands:[] },
      { slug: 'y', name:'Y', type:'cli', tagline:'', repo:'', commands:[] },
    ];
    const l: Ledger = { rotationIndex: 0, runs: [
      { date:'1', track:'tools', subject:'x', status:'posted', angle:'a1' },
      { date:'2', track:'tools', subject:'x', status:'posted', angle:'a2' },
    ]};
    expect(pickTool(cands, l)!.tool.slug).toBe('y'); // y has 0 angles, x has 2
  });
});
