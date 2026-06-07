'use client';

/**
 * Renders a self-contained interactive HTML asset (served from /public/content) as an iframe.
 * Used by chapter MDX for embedded diagrams. A client component so the iframe lives behind a
 * stable hydration boundary — raw <iframe> injected directly into MDX hydrates inconsistently.
 */
export default function Embed({ src, title, height = 520 }: { src: string; title?: string; height?: number }) {
  return (
    <iframe
      src={src}
      title={title ?? 'embedded content'}
      loading="lazy"
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        border: '1px solid #E8E2D4',
        borderRadius: 8,
        margin: '24px 0',
        display: 'block',
      }}
    />
  );
}
