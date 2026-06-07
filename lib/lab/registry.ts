import { z } from 'zod';

/** Section keys mirror the core levels in lib/content/levels.ts. */
export const LAB_SECTIONS = ['what-is-ai', 'products', 'pro-usage', 'in-practice'] as const;
export type LabSection = (typeof LAB_SECTIONS)[number];

/** Thai labels for each section, in display order (matches LEVEL_META.label_th). */
export const LAB_SECTION_META: Record<LabSection, { label_th: string }> = {
  'what-is-ai':  { label_th: 'AI คืออะไร'    },
  products:      { label_th: 'รู้จัก Product' },
  'pro-usage':   { label_th: 'ใช้ขั้นโปร'    },
  'in-practice': { label_th: 'ลงมือใช้จริง'  },
};

export const Lab = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title_th: z.string().min(1),
  blurb: z.string().min(1),
  section: z.enum(LAB_SECTIONS),
  chapters: z.array(z.string()).default([]),
  kind: z.enum(['react', 'html']),
  source: z.string().min(1), // react → component-map key; html → '/lab/xxx.html'
  thumbnail: z.string().optional(),
  status: z.enum(['live', 'beta', 'soon']),
  height: z.number().int().positive().optional(),
});
export const Labs = z.array(Lab);
export type Lab = z.infer<typeof Lab>;

/** React-backed lab ids. MUST stay in sync with componentMap in components/lab/Lab.tsx. */
export const REACT_LAB_IDS = [] as const;

export const LABS: Lab[] = [
  {
    id: 'dissection-lab',
    title_th: 'ผ่าตัดดูข้างใน LLM',
    blurb: 'เปิดดูข้างในโมเดล AI จริง แล้วดูมันคิดทีละขั้น ตั้งแต่ตัดคำ จนทำนายคำถัดไป',
    section: 'what-is-ai',
    chapters: ['llm-mechanics'],
    kind: 'html',
    source: '/lab/dissection-lab.html',
    status: 'live',
    height: 1000,
  },
  {
    id: 'after-send-walkthrough',
    title_th: 'หลังกดส่ง เกิดอะไรขึ้น',
    blurb: 'เดินดูทีละขั้นว่าข้อความของคุณเดินทางผ่านอะไรบ้างหลังกดส่งถึง AI',
    section: 'products',
    chapters: ['the-harness'],
    kind: 'html',
    source: '/lab/what_happens_after_send_thai_steps.html',
    status: 'live',
    height: 420,
  },
  {
    id: 'prompt-creator',
    title_th: 'เครื่องมือสร้าง Prompt ภาพ/วิดีโอ',
    blurb: 'เลือกองค์ประกอบเป็นภาษาไทย แล้วได้ prompt ภาษาอังกฤษพร้อมใช้ 30 ช่องควบคุม',
    section: 'pro-usage',
    chapters: [],
    kind: 'html',
    source: '/lab/prompt-creator.html',
    status: 'live',
    height: 720,
  },
  {
    id: 'harness-replay',
    title_th: 'ดู AI ทำงานจริง เล่นซ้ำทีละขั้น',
    blurb: 'เล่นซ้ำเซสชันการทำงานของ AI agent จริง ทีละขั้น เพื่อเห็นว่ามันวนคิด-ลงมือยังไง',
    section: 'products',
    chapters: ['the-harness'],
    kind: 'html',
    source: '/lab/harness-replay.html',
    status: 'beta',
    height: 640,
  },
];

export function getLab(id: string): Lab | undefined {
  return LABS.find(l => l.id === id);
}

export function labsForChapter(slug: string): Lab[] {
  return LABS.filter(l => l.chapters.includes(slug));
}

/** Group labs by section in display order, dropping empty sections. */
export function labsBySection(): Array<{ key: LabSection; label_th: string; labs: Lab[] }> {
  return LAB_SECTIONS
    .map(key => ({ key, label_th: LAB_SECTION_META[key].label_th, labs: LABS.filter(l => l.section === key) }))
    .filter(g => g.labs.length > 0);
}
