import { describe, it, expect } from 'vitest';
import { loadGlossary } from '@/lib/content/glossary';

describe('glossary loader', () => {
  it('loads and validates glossary entries', async () => {
    const entries = await loadGlossary();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]!.term_en).toBeTruthy();
    expect(entries[0]!.term_th).toBeTruthy();
  });
});
