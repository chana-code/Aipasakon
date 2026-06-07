'use client';

import type { ComponentType } from 'react';
import Embed from '@/components/reader/Embed';
import { getLab } from '@/lib/lab/registry';

// React-backed labs. Keys MUST match REACT_LAB_IDS in lib/lab/registry.ts.
// (dissection-lab is now a self-contained html lab served via <Embed>; no react labs currently.)
const componentMap: Record<string, ComponentType<object>> = {};

export default function Lab({ id }: { id: string }) {
  const lab = getLab(id);

  if (!lab) {
    return (
      <div className="my-6 rounded-lg border border-[#E8E2D4] bg-[#FBF9F4] p-4 text-sm text-[#7a6f63]">
        ไม่พบแล็บ: <code>{id}</code>
      </div>
    );
  }

  if (lab.kind === 'react') {
    const Comp = componentMap[lab.source];
    if (!Comp) {
      console.error(`Lab "${id}": no component mapped for source "${lab.source}". Add it to componentMap in components/lab/Lab.tsx.`);
      return (
        <div className="my-6 rounded-lg border border-[#E8E2D4] bg-[#FBF9F4] p-4 text-sm text-[#7a6f63]">
          ไม่พบ component สำหรับแล็บ: <code>{id}</code>
        </div>
      );
    }
    return <Comp />;
  }

  return <Embed src={lab.source} title={lab.title_th} height={lab.height} />;
}
