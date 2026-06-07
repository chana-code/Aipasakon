'use client';

import type { ReactNode } from 'react';

// A numbered stage card matching lab.html: a teal circle with the step number,
// a bold title, and an inline muted description. Warm cream surface.

export function StageCard({
  no,
  title,
  desc,
  children,
}: {
  no: number;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#fffdf9] border border-[#e7ddcf] rounded-[14px] p-5 my-4">
      <div className="leading-relaxed">
        <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#14B5AB] text-white text-[14px] font-semibold mr-2 align-middle">
          {no}
        </span>
        <strong className="text-[#2c2722]">{title}</strong>{' '}
        <span className="text-[#7a6f63] text-[14px]">— {desc}</span>
      </div>
      {children}
    </div>
  );
}
