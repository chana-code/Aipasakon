import { describe, it, expect } from 'vitest';
import { readGatedFile } from '@/lib/content/read-gated-file';

describe('readGatedFile', () => {
  it('reads a registered file by slug', async () => {
    const html = await readGatedFile('sample-locked');
    expect(html).toContain('<html');
  });

  it('returns null for an unregistered slug (no path traversal)', async () => {
    expect(await readGatedFile('../package')).toBeNull();
    expect(await readGatedFile('unknown')).toBeNull();
  });
});
