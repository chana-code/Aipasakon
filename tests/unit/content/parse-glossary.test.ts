import { describe, it, expect } from 'vitest';
import { parseGlossaryMarkdown } from '@/scripts/lib/parse-glossary';

const SAMPLE = `# อภิธานศัพท์

intro prose that must be ignored

> 💡 callout that must be ignored

## กลุ่มที่ 1 ตัวเครื่องยนต์

**model (โมเดล)**
ตัว AI จริง ๆ ที่อยู่หลังจอ *(มีบทเต็ม: [model คือเครื่องยนต์](../section-2-products/2.1.1-the-model.md))*

**LLM**
ย่อมาจาก Large Language Model

## กลุ่มที่ 2 หน่วย

**context window (หน้าต่างบริบท)**
พื้นที่ความจำชั่วคราว *(มีบทเต็ม: [Pro usage](../section-3-pro-usage/3.1-context.md))*
`;

describe('parseGlossaryMarkdown', () => {
  const entries = parseGlossaryMarkdown(SAMPLE);

  it('extracts only bold-term blocks, skipping prose/callouts/headings', () => {
    expect(entries.map(e => e.term_en)).toEqual(['model', 'LLM', 'context window']);
  });

  it('splits term_en and term_th from the parenthesized header', () => {
    expect(entries[0]).toMatchObject({ term_en: 'model', term_th: 'โมเดล' });
  });

  it('sets term_th null when no parens', () => {
    expect(entries[1]).toMatchObject({ term_en: 'LLM', term_th: null });
  });

  it('strips the (มีบทเต็ม ...) tail out of the definition', () => {
    expect(entries[0]!.definition_th).toBe('ตัว AI จริง ๆ ที่อยู่หลังจอ');
    expect(entries[0]!.definition_th).not.toContain('มีบทเต็ม');
  });

  it('maps a deployed chapter link to a site route', () => {
    expect(entries[0]!.full_chapter).toBe('/products/the-model');
  });

  it('omits full_chapter for not-yet-deployed chapters (no dead links)', () => {
    expect(entries[2]!.full_chapter).toBeUndefined();
  });

  it('records the section heading as group', () => {
    expect(entries[0]!.group).toBe('กลุ่มที่ 1 ตัวเครื่องยนต์');
    expect(entries[2]!.group).toBe('กลุ่มที่ 2 หน่วย');
  });
});

describe('parseGlossaryMarkdown — marker variants', () => {
  it('handles a two-link มีบทเต็ม marker: strips it fully, takes first deployed link', () => {
    const md = `## g\n\n**hallucination (อาการหลอน)**\nAI มั่ว *(มีบทเต็ม: [สาเหตุ](../section-1-what-is-ai/1.3-what-it-really-is.md) สำหรับสาเหตุ และ [วิธีรับมือ](../section-3-pro-usage/3.1-context.md) สำหรับวิธีรับมือ)*\n`;
    const [e] = parseGlossaryMarkdown(md);
    expect(e!.definition_th).toBe('AI มั่ว');
    expect(e!.definition_th).not.toContain('มีบทเต็ม');
    expect(e!.definition_th).not.toContain('](');
    expect(e!.full_chapter).toBe('/what-is-ai/what-it-really-is');
  });

  it('handles the อยู่ในบท label variant', () => {
    const md = `## g\n\n**hook (ฮุก)**\nโค้ดที่แทรกอัตโนมัติ *(อยู่ในบท: [harness](../section-2-products/2.1.2-the-harness.md))*\n`;
    const [e] = parseGlossaryMarkdown(md);
    expect(e!.definition_th).toBe('โค้ดที่แทรกอัตโนมัติ');
    expect(e!.definition_th).not.toContain('](');
    expect(e!.full_chapter).toBe('/products/the-harness');
  });

  it('leaves a non-reference italic-paren (no link) untouched', () => {
    const md = `## g\n\n**term (คำ)**\nนิยาม *(หมายเหตุสำคัญ)*\n`;
    const [e] = parseGlossaryMarkdown(md);
    expect(e!.definition_th).toBe('นิยาม *(หมายเหตุสำคัญ)*');
    expect(e!.full_chapter).toBeUndefined();
  });
});
