export const LEVELS = ['foundations', 'using-ai', 'building-with-ai', 'advanced'] as const;
export type Level = typeof LEVELS[number];

export const LEVEL_META: Record<Level, { label: string; label_th: string; tagline_th: string; color: string; order: number }> = {
  foundations:        { label: 'Foundations',      label_th: 'พื้นฐาน',      tagline_th: 'AI/ML/LLM คืออะไร ทำงานยังไง',          color: 'var(--teal-500)',   order: 1 },
  'using-ai':         { label: 'Using AI',         label_th: 'ใช้งาน AI',    tagline_th: 'Prompt, workflow และเครื่องมือที่ใช้จริง', color: 'var(--blue-500)',   order: 2 },
  'building-with-ai': { label: 'Building with AI', label_th: 'สร้างด้วย AI', tagline_th: 'API, RAG และ agents',                   color: 'var(--orange-500)', order: 3 },
  advanced:           { label: 'Advanced',         label_th: 'เชี่ยวชาญ',    tagline_th: 'Transformer, การเทรนโมเดล และกลยุทธ์องค์กร', color: 'var(--plum-500)',   order: 4 },
};

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}
