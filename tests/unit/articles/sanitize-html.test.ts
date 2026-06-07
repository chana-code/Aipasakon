// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { sanitizeArticleHtml } from '@/lib/content/sanitize-html';

describe('sanitizeArticleHtml', () => {
  it('keeps safe markup', () => {
    const out = sanitizeArticleHtml('<h1>หัวข้อ</h1><p>ย่อหน้า</p>');
    expect(out).toContain('<h1>');
    expect(out).toContain('ย่อหน้า');
  });

  it('strips <script> tags', () => {
    const out = sanitizeArticleHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toMatch(/<script/i);
    expect(out).toContain('ok');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeArticleHtml('<img src="x" onerror="alert(1)">');
    expect(out).not.toMatch(/onerror/i);
  });

  it('drops the doctype/html/head wrapper, keeping body content', () => {
    const out = sanitizeArticleHtml(
      '<!doctype html><html><head><title>t</title></head><body><p>เนื้อหา</p></body></html>',
    );
    expect(out).toContain('เนื้อหา');
    expect(out).not.toMatch(/<!doctype/i);
    expect(out).not.toMatch(/<title>/i);
  });
});
