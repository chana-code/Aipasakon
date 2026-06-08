import { describe, it, expect, vi, afterEach } from 'vitest';
import { repoPath, formatStars, fetchStars } from '@/lib/content/github-stars';

describe('repoPath', () => {
  it('extracts owner/repo from a github url', () => {
    expect(repoPath('https://github.com/danielmiessler/fabric')).toBe('danielmiessler/fabric');
  });
  it('strips a trailing .git', () => {
    expect(repoPath('https://github.com/foo/bar.git')).toBe('foo/bar');
  });
  it('ignores query/hash suffixes', () => {
    expect(repoPath('https://github.com/foo/bar#readme')).toBe('foo/bar');
  });
  it('returns null for a non-github url', () => {
    expect(repoPath('https://example.com/foo/bar')).toBeNull();
  });
});

describe('formatStars', () => {
  it('keeps counts under 1k as-is', () => {
    expect(formatStars(0)).toBe('0');
    expect(formatStars(980)).toBe('980');
  });
  it('uses one decimal between 1k and 100k', () => {
    expect(formatStars(1948)).toBe('1.9k');
    expect(formatStars(42154)).toBe('42.2k');
  });
  it('drops the decimal at or above 100k', () => {
    expect(formatStars(148232)).toBe('148k');
    expect(formatStars(221270)).toBe('221k');
  });
});

describe('fetchStars', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the star count on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ stargazers_count: 1234 }) })),
    );
    expect(await fetchStars('https://github.com/foo/bar')).toBe(1234);
  });

  it('returns null on a non-ok response (e.g. rate limit)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    expect(await fetchStars('https://github.com/foo/bar')).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network'); }));
    expect(await fetchStars('https://github.com/foo/bar')).toBeNull();
  });

  it('returns null for a non-github url without fetching', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await fetchStars('https://example.com/x')).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});
