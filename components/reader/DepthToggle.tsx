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
    <div style={{ textAlign: "center" }}>
      <div
        role="tablist"
        aria-label="ระดับเนื้อหา"
        style={{
          display: "inline-flex",
          padding: 4,
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: 999,
        }}
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
                background: on ? "var(--teal-500)" : "transparent",
                border: 0,
                cursor: "pointer",
                padding: "8px 22px",
                borderRadius: 999,
                boxShadow: on ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "background 140ms, color 140ms",
                color: on ? "#fff" : "var(--fg-3)",
                fontFamily: "var(--font-thai)",
                fontSize: 14,
                fontWeight: on ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {t.th}
              <span style={{
                marginLeft: 6,
                fontFamily: "var(--font-latin)",
                fontSize: 11,
                letterSpacing: "0.02em",
                opacity: on ? 0.85 : 0.6,
              }}>({t.label})</span>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: "var(--font-thai)",
        fontSize: 13,
        fontStyle: "italic",
        color: "var(--fg-3)",
      }}>
        {TABS.find(t => t.id === active)?.desc}
      </div>
    </div>
  );
}
