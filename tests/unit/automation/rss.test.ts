import { describe, it, expect } from 'vitest';
import { parseFeed, freshWithin } from '../../../automation/scout/rss';

const RSS = `<rss><channel>
<item><title>RSS Title A</title><link>https://a.com/1</link><pubDate>Tue, 09 Jun 2026 10:00:00 GMT</pubDate></item>
<item><title><![CDATA[Title B & more]]></title><link>https://a.com/2</link><pubDate>Mon, 01 Jun 2026 10:00:00 GMT</pubDate></item>
</channel></rss>`;

const ATOM = `<feed><entry><title>Atom Title</title><link href="https://b.com/x"/><updated>2026-06-09T08:00:00Z</updated></entry></feed>`;

describe('parseFeed', () => {
  it('parses RSS items', () => {
    const items = parseFeed(RSS, 'SourceA');
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ title: 'RSS Title A', url: 'https://a.com/1', source: 'SourceA' });
    expect(items[1]!.title).toBe('Title B & more'); // CDATA + entity decode
  });
  it('parses Atom entries (link is an href attribute)', () => {
    const items = parseFeed(ATOM, 'SourceB');
    expect(items[0]).toMatchObject({ title: 'Atom Title', url: 'https://b.com/x', source: 'SourceB' });
  });
});

describe('freshWithin', () => {
  it('keeps only items newer than N hours from the given now', () => {
    const items = parseFeed(RSS, 'SourceA');
    const now = '2026-06-09T12:00:00Z';
    const fresh = freshWithin(items, 48, now); // 48h cutoff -> keeps Jun 9, drops Jun 1
    expect(fresh.map(i => i.url)).toEqual(['https://a.com/1']);
  });
});
