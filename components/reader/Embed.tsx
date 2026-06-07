'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renders a self-contained interactive HTML asset (served from /public/content) as an iframe.
 * Used by chapter MDX for embedded diagrams. A client component so the iframe lives behind a
 * stable hydration boundary — raw <iframe> injected directly into MDX hydrates inconsistently.
 *
 * Auto-resize: if the embedded page posts `{ type: 'lab-height', height }`, the iframe grows to
 * fit (no inner scroll). Labs that don't post keep the fixed `height` prop. Backward compatible.
 */
export default function Embed({ src, title, height = 520 }: { src: string; title?: string; height?: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [autoHeight, setAutoHeight] = useState<number | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; height?: number } | undefined;
      if (!data || data.type !== 'lab-height' || typeof data.height !== 'number') return;
      if (ref.current && e.source !== ref.current.contentWindow) return; // only this iframe
      setAutoHeight(Math.ceil(data.height));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title ?? 'embedded content'}
      loading="lazy"
      style={{
        width: '100%',
        height: `${autoHeight ?? height}px`,
        border: '1px solid #E8E2D4',
        borderRadius: 8,
        margin: '24px 0',
        display: 'block',
      }}
    />
  );
}
