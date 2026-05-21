'use client';
import { useState } from 'react';

const DEPTHS = [
  { id: 'surface', label: 'Surface' },
  { id: 'deeper',  label: 'Deeper'  },
  { id: 'formal',  label: 'Formal'  },
] as const;

type Depth = typeof DEPTHS[number]['id'];

export function DepthToggle({ targetId }: { targetId: string }) {
  const [active, setActive] = useState<Depth>('surface');

  const onSelect = (id: Depth) => {
    setActive(id);
    const el = document.getElementById(targetId);
    if (el) el.dataset.depth = id;
  };

  return (
    <div role="tablist" aria-label="ระดับเนื้อหา" className="inline-flex items-center gap-1 border border-line rounded-md p-1 bg-white">
      {DEPTHS.map(d => (
        <button
          key={d.id}
          role="tab"
          aria-selected={active === d.id}
          onClick={() => onSelect(d.id)}
          className={`px-3 py-1 text-sm rounded-sm transition-colors duration-150 ease-calm ${
            active === d.id ? 'bg-teal-500 text-white' : 'text-fg-2 hover:text-teal-600'
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
