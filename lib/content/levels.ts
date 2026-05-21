export const LEVELS = ['foundations', 'using-ai', 'building-with-ai', 'advanced'] as const;
export type Level = typeof LEVELS[number];

export const LEVEL_META: Record<Level, { label: string; color: string; order: number }> = {
  foundations:        { label: 'Foundations',        color: 'var(--teal-500)',   order: 1 },
  'using-ai':         { label: 'Using AI',           color: 'var(--blue-500)',   order: 2 },
  'building-with-ai': { label: 'Building with AI',   color: 'var(--orange-500)', order: 3 },
  advanced:           { label: 'Advanced',           color: 'var(--plum-500)',   order: 4 },
};

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}
