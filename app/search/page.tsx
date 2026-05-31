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
    <>
      <style>{`
        :root {
          --pagefind-ui-primary: #14B5AB;
          --pagefind-ui-text: #00143C;
          --pagefind-ui-background: #fbf9f4;
          --pagefind-ui-border: #E8E2D4;
          --pagefind-ui-tag: #f0eee9;
        }
      `}</style>
      <div className="bg-[#fbf9f4] min-h-[60vh]">
        <div className="mx-auto max-w-2xl px-4 md:px-6 py-12 md:py-16">
          <h1
            className="font-['Noto_Serif_Thai',serif] text-[40px] leading-[1.2] font-bold text-[#00143C] mb-3"
          >
            ค้นหา
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-[18px] leading-[1.8] text-[#00143C]/70 mb-8">
            ค้นหาบทเรียน คำศัพท์ และเนื้อหาทั้งหมดในคลังความรู้
          </p>
          <div id="search" />
        </div>
      </div>
    </>
  );
}
