import { LEVEL_META, type Level } from '@/lib/content/levels';

export function LevelChip({ level }: { level: Level }) {
  const m = LEVEL_META[level];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
      style={{ color: m.color, borderColor: m.color }}
    >
      {m.label}
    </span>
  );
}
