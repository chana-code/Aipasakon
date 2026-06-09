import { describe, it, expect } from 'vitest';
import { buildCardHtml } from '../../../automation/cards/template';
import type { CardConfig } from '../../../automation/types';

const config: CardConfig = {
  track: 'tools',
  kicker: 'เครื่องมือ AI น่าลอง',
  hook: [
    { text: 'Browser-use', style: 'accent', nowrap: true },
    { text: 'Skill ที่สั่ง AI ให้', style: 'lead' },
    { text: 'ทำงานบนเว็บไซต์แทนเรา', style: 'mark' },
    { text: 'super computer', style: 'plain', nowrap: true },
  ],
};
const html = buildCardHtml(config, 'data:image/png;base64,AAAA');

describe('buildCardHtml', () => {
  it('includes the kicker text', () => expect(html).toContain('เครื่องมือ AI น่าลอง'));
  it('includes every hook segment text', () => {
    for (const s of config.hook) expect(html).toContain(s.text);
  });
  it('applies the track background color', () => expect(html).toContain('background:#00143C'));
  it('renders the highlight (mark) class for the mark span', () => {
    expect(html).toMatch(/class="mark"[^>]*>ทำงานบนเว็บไซต์แทนเรา/);
  });
  it('marks nowrap spans so multi-word terms never split', () => {
    expect(html).toMatch(/class="[^"]*nb[^"]*"[^>]*>super computer/);
  });
  it('embeds the logo data URI', () => expect(html).toContain('data:image/png;base64,AAAA'));
  it('loads the Prompt font', () => expect(html).toContain('family=Prompt'));
});

describe('buildCardHtml escaping', () => {
  it('escapes HTML-special chars in hook text', () => {
    const h = buildCardHtml(
      { track: 'news', kicker: 'ข่าว AI', hook: [{ text: 'A < B & C > D', style: 'lead' }] },
      'data:image/png;base64,AAAA'
    );
    expect(h).toContain('A &lt; B &amp; C &gt; D');
    expect(h).not.toContain('A < B & C > D');
  });
  it('escapes HTML-special chars in the kicker', () => {
    const h = buildCardHtml(
      { track: 'news', kicker: 'A & B', hook: [{ text: 'x', style: 'lead' }] },
      'data:image/png;base64,AAAA'
    );
    expect(h).toContain('A &amp; B');
  });
  it('escapes a double-quote in the logo data URI so it cannot break the src attribute', () => {
    const h = buildCardHtml(
      { track: 'news', kicker: 'k', hook: [{ text: 'x', style: 'lead' }] },
      'data:image/png;base64,AA" onerror="x'
    );
    expect(h).not.toContain('" onerror="');
    expect(h).toContain('&quot;');
  });
});
