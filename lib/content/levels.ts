export const LEVELS = [
  // V.3 core taxonomy (primary site IA) — see AI-Pasa-Kon/website-content/v3/
  'what-is-ai',
  'products',
  'pro-usage',
  'in-practice',
  'vibe-coding',
  // Archived legacy curriculum — still routable, hidden from primary nav (see /archive)
  'foundations',
  'using-ai',
  'building-with-ai',
  'advanced',
  'layer-1',
] as const;
export type Level = typeof LEVELS[number];

export type LevelGroup = 'core' | 'archive';

export const LEVEL_META: Record<
  Level,
  { label: string; label_th: string; tagline_th: string; color: string; order: number; group: LevelGroup }
> = {
  // ---- V.3 core taxonomy ----
  'what-is-ai':  { label: 'What is AI',  label_th: 'AI คืออะไร',     tagline_th: 'ทำความเข้าใจ AI ตั้งแต่ประวัติ การเทรน ไปจนถึงกลไกและขีดจำกัดที่แท้จริง', color: '#14B5AB', order: 1, group: 'core' },
  'products':    { label: 'Products',    label_th: 'รู้จัก Product', tagline_th: 'Model, harness และผลิตภัณฑ์ AI ต่าง ๆ ทำงานและต่างกันยังไง',          color: '#2D7CD6', order: 2, group: 'core' },
  'pro-usage':   { label: 'Pro Usage',   label_th: 'ใช้ขั้นโปร',     tagline_th: 'Context, token, skills, connectors และการสั่งงาน AI อย่างมือโปร',       color: '#B45A1A', order: 3, group: 'core' },
  'in-practice': { label: 'In Practice', label_th: 'ลงมือใช้จริง',   tagline_th: 'ติดตั้ง เริ่มใช้ อ่าน docs และสร้างให้ AI ทำงานแทนคุณ',                 color: '#7A3FA0', order: 4, group: 'core' },
  'vibe-coding': { label: 'Vibe Coding', label_th: 'Vibe Coding',    tagline_th: 'สร้างแอปของคุณเองด้วยการสั่ง AI ตั้งแต่เข้าใจเครื่องไปจนถึงดูแลให้รันได้จริงบน production', color: '#2F9E44', order: 5, group: 'core' },

  // ---- Archived legacy curriculum ----
  foundations:        { label: 'Foundations',      label_th: 'พื้นฐาน',      tagline_th: 'AI/ML/LLM คืออะไร ทำงานยังไง',                  color: '#14B5AB', order: 1, group: 'archive' },
  'using-ai':         { label: 'Using AI',         label_th: 'ใช้งาน AI',    tagline_th: 'Prompt, workflow และเครื่องมือที่ใช้จริง',       color: '#2D7CD6', order: 2, group: 'archive' },
  'building-with-ai': { label: 'Building with AI', label_th: 'สร้างด้วย AI', tagline_th: 'API, RAG และ agents',                           color: '#B45A1A', order: 3, group: 'archive' },
  advanced:           { label: 'Advanced',         label_th: 'เชี่ยวชาญ',    tagline_th: 'Transformer, การเทรนโมเดล และกลยุทธ์องค์กร',     color: '#7A3FA0', order: 4, group: 'archive' },
  'layer-1':          { label: 'Layer 1',          label_th: 'Layer 1',      tagline_th: 'ฉบับร่างเก่า (30 บท)',                          color: '#14B5AB', order: 0, group: 'archive' },
};

export const CORE_LEVELS = LEVELS.filter(l => LEVEL_META[l].group === 'core');
export const ARCHIVE_LEVELS = LEVELS.filter(l => LEVEL_META[l].group === 'archive');

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

/** True only for live (core) levels. Archived levels exist on disk but are never served. */
export function isCoreLevel(value: string): value is Level {
  return isLevel(value) && LEVEL_META[value].group === 'core';
}

/** The ordered list of sibling levels in the same group as `level` (for prev/next + spine). */
export function levelsInGroup(level: Level): Level[] {
  const group = LEVEL_META[level].group;
  return LEVELS.filter(l => LEVEL_META[l].group === group)
    .sort((a, b) => LEVEL_META[a].order - LEVEL_META[b].order);
}
