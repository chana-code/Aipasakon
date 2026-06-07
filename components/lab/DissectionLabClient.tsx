'use client';

import dynamic from 'next/dynamic';

// Thin client wrapper so the lab can be embedded in server-rendered MDX.
// next/dynamic with ssr:false is only allowed inside a Client Component, so
// the MDX components map points at this wrapper rather than DissectionLab
// directly. The lab touches transformers.js + browser APIs, so SSR is off.
const DissectionLab = dynamic(
  () => import('./DissectionLab').then((m) => m.DissectionLab),
  { ssr: false, loading: () => <p className="text-[#7a6f63]">กำลังโหลดแล็บ…</p> },
);

export default function DissectionLabClient(props: { defaultText?: string }) {
  return <DissectionLab {...props} />;
}
