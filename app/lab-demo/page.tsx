'use client';

import dynamic from 'next/dynamic';

// Client-only: the lab loads transformers.js and reads model files in the
// browser, so it must never be server-rendered.
const DissectionLab = dynamic(
  () => import('@/components/lab/DissectionLab').then((m) => m.DissectionLab),
  { ssr: false, loading: () => <p className="p-6 text-[#7a6f63]">กำลังโหลดแล็บ…</p> },
);

export default function LabDemoPage() {
  return (
    <main className="max-w-[920px] mx-auto px-5 py-8 bg-[#FBF9F4] min-h-screen">
      <DissectionLab defaultText="The cat sat on the mat" />
    </main>
  );
}
