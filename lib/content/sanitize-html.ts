import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize an inline-type gated article. Accepts either a full HTML document or a
 * fragment; DOMPurify returns body-level content only (doctype/html/head removed),
 * scripts and event handlers stripped.
 */
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style'],
  });
}
