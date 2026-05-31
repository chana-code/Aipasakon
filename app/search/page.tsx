'use client';
import { useEffect } from 'react';

export default function SearchPage() {
  useEffect(() => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/pagefind/pagefind-ui.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).PagefindUI({ element: '#search', showImages: false, showSubResults: true });
    };
    document.body.appendChild(script);

    return () => {
      if (css.parentNode) css.parentNode.removeChild(css);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="mx-auto max-w-prose px-4 md:px-6 py-8 md:py-12">
      <h1 className="font-thai text-3xl font-semibold mb-6">ค้นหา</h1>
      <div id="search" />
    </div>
  );
}
