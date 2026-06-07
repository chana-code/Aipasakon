// Real, captured config constants — not fetched at runtime.
// Qwen2.5-0.5B values from its config.json; DeepSeek-V3 values verified.
// Rendered by ScalePanel; copy carried verbatim from lab.html.

export interface ScaleRow {
  label: string; // Thai row label
  small: string; // Qwen2.5-0.5B value
  deepseek: string; // DeepSeek-V3 value
}

export const SCALE_ROWS: ScaleRow[] = [
  { label: 'จำนวนตัวเลข (parameters)', small: '0.5 พันล้าน', deepseek: '671 พันล้าน' },
  { label: 'จำนวนชั้น (layers)', small: '24', deepseek: '61' },
  { label: 'ความกว้าง (hidden size)', small: '896', deepseek: '7,168' },
  { label: 'คลังคำ (vocab)', small: '151,936', deepseek: '129,280' },
  { label: 'ขนาดไฟล์จริง', small: '~0.5 GB', deepseek: '689 GB' },
];

// The Part-1 "what's in the file" table.
export interface FileRow {
  file: string;
  what: string; // may contain a <b> emphasis word
}

export const FILE_ROWS: FileRow[] = [
  { file: 'config.json', what: 'พิมพ์เขียว — บอกว่าโมเดลมีกี่ชั้น กว้างเท่าไหร่' },
  { file: 'model.safetensors', what: '__สมอง__ — ตัวเลขทศนิยมหลายร้อยล้านตัว' },
  { file: 'tokenizer.json', what: 'พจนานุกรม แปลง ข้อความ ↔ เลข' },
];
