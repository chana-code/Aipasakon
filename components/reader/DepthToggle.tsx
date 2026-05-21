'use client';
import { useState } from 'react';

type Depth = 'surface' | 'deeper' | 'formal';

const TABS: { id: Depth; en: string; th: string; label: string; desc: string }[] = [
  { id: 'surface', en: 'SURFACE', th: 'ภาพรวม', label: 'Surface', desc: 'เวอร์ชันที่ไม่มีพื้นฐานก็อ่านได้' },
  { id: 'deeper',  en: 'DEEPER',  th: 'เทคนิค', label: 'Deeper',  desc: 'เวอร์ชันที่แม่นยำขึ้น มีศัพท์เทคนิค แต่ยังเล่าเป็นเรื่องราว' },
  { id: 'formal',  en: 'FORMAL',  th: 'วิชาการ', label: 'Formal',  desc: 'เวอร์ชันที่ลงสูตร · architecture · code · paper' },
];

export function DepthToggle({ targetId }: { targetId: string }) {
  const [active, setActive] = useState<Depth>('surface');

  const onSelect = (id: Depth) => {
    setActive(id);
    const el = document.getElementById(targetId);
    if (el) el.dataset.depth = id;
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="ระดับเนื้อหา"
        style={{ display: "inline-flex", borderBottom: "1px solid var(--line)" }}
      >
        {TABS.map(t => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              aria-label={t.label}
              onClick={() => onSelect(t.id)}
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: "10px 18px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                borderBottom: on ? "2px solid var(--teal-500)" : "2px solid transparent",
                marginBottom: -1,
                transition: "color 140ms",
                color: on ? "var(--fg-1)" : "var(--fg-3)",
                fontFamily: "var(--font-thai)",
                fontSize: 14.5,
                fontWeight: 500,
              }}
            >
              <span style={{
                fontFamily: "var(--font-latin)",
                fontSize: 11.5,
                letterSpacing: "0.04em",
                color: on ? "var(--teal-600)" : "inherit",
                opacity: on ? 1 : 0.7,
              }}>{t.en}</span>
              <span>{t.th}</span>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 8,
        fontFamily: "var(--font-thai)",
        fontSize: 12.5,
        color: "var(--fg-3)",
      }}>
        {TABS.find(t => t.id === active)?.desc}
      </div>
    </div>
  );
}
