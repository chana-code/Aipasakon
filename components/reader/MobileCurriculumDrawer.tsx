'use client';

import { useState } from 'react';

export function MobileCurriculumDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden" style={{ marginBottom: open ? 16 : 0 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-curriculum-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          width: "100%",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: "var(--font-thai)",
          fontSize: 14,
          fontWeight: 500,
          color: "var(--fg-2)",
          transition: "background 140ms",
        }}
      >
        <span style={{ fontSize: 16 }}>📖</span>
        <span style={{ flex: 1, textAlign: "left" }}>สารบัญ (Curriculum)</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-curriculum-panel"
          role="navigation"
          aria-label="Curriculum navigation"
          style={{
            marginTop: 8,
            border: "1px solid var(--line)",
            borderRadius: 6,
            background: "var(--paper)",
            maxHeight: "60vh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
