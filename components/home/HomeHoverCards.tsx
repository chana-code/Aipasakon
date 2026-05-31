'use client';
import Link from 'next/link';

const LEVEL_COLOR: Record<number, string> = {
  1: '#14B5AB',
  2: '#2D7CD6',
  3: '#B45A1A',
};

const DOORS = [
  {
    id: 'novice',
    q: 'ไม่เคยรู้จัก AI เลย',
    sub: 'เริ่มจากศูนย์ — รู้ว่า AI / ML / LLM คืออะไร และเลิกกลัวคำเทคนิค',
    to: '/foundations',
    level: 1,
    cta: 'เริ่ม Level 1',
  },
  {
    id: 'user',
    q: 'ใช้ AI อยู่บ้าง อยากใช้ดีขึ้น',
    sub: 'prompt, context, tool fluency — ใช้ ChatGPT/Claude ให้คุ้มกว่าเดิม',
    to: '/using-ai',
    level: 2,
    cta: 'ไป Level 2',
  },
  {
    id: 'builder',
    q: 'อยากสร้างของด้วย AI',
    sub: 'API, RAG, agent, fine-tune — pattern ที่ใช้ในระบบจริง',
    to: '/building-with-ai',
    level: 3,
    cta: 'ไป Level 3',
  },
];

export function HomeHoverCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {DOORS.map(d => (
        <DoorCard key={d.id} door={d} />
      ))}
    </div>
  );
}

function DoorCard({ door: d }: { door: typeof DOORS[number] }) {
  const color = LEVEL_COLOR[d.level] ?? '#14B5AB';
  return (
    <Link
      href={d.to}
      style={{
        display: "block",
        padding: "22px 22px 20px",
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 10,
        textDecoration: "none",
        cursor: "pointer",
        transition: "border-color 140ms, background 140ms",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = color;
        (e.currentTarget as HTMLElement).style.background = '#fff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)';
        (e.currentTarget as HTMLElement).style.background = '#fff';
      }}
    >
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: color,
        letterSpacing: "0.04em",
        marginBottom: 10,
      }}>{d.cta.toUpperCase()} →</div>
      <div style={{
        fontFamily: "var(--font-thai)",
        fontSize: 18,
        fontWeight: 600,
        color: "var(--fg-1)",
        marginBottom: 8,
        lineHeight: 1.4,
      }}>&ldquo;{d.q}&rdquo;</div>
      <div style={{
        fontFamily: "var(--font-thai)",
        fontSize: 13.5,
        lineHeight: 1.65,
        color: "var(--fg-3)",
      }}>{d.sub}</div>
    </Link>
  );
}
