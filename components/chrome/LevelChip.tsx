import { LEVEL_META, type Level } from '@/lib/content/levels';

/* Numeric level → our string key */
const NUM_TO_LEVEL: Record<number, Level> = {
  1: 'foundations',
  2: 'using-ai',
  3: 'building-with-ai',
  4: 'advanced',
};

type LevelChipProps =
  | { level: Level; num?: never; size?: 'md' | 'sm' }
  | { level?: never; num: 1 | 2 | 3 | 4; size?: 'md' | 'sm' };

export function LevelChip({ level, num, size = 'md' }: LevelChipProps) {
  const key: Level = (level ?? NUM_TO_LEVEL[num!]) as Level;
  const m = LEVEL_META[key];
  const compact = size === 'sm';

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: compact ? "2px 9px 2px 7px" : "3px 11px 3px 8px",
      borderRadius: 999,
      background: "#fff",
      border: "1px solid var(--line-2)",
      fontFamily: "var(--font-thai)",
      fontSize: compact ? 11 : 12,
      fontWeight: 500,
      color: "var(--fg-1)",
      lineHeight: 1.4,
    }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: compact ? 9.5 : 10,
        color: "#fff",
        background: m.color,
        padding: "1px 6px",
        borderRadius: 999,
        lineHeight: 1.3,
        fontWeight: 600,
      }}>L{m.order}</span>
      {m.label}
    </span>
  );
}
