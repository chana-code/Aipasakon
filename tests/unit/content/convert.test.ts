import { describe, it, expect } from 'vitest';
import {
  resolveWikilink,
  convertFrontmatter,
  convertBody,
  convertChapterFile,
} from '@/scripts/convert-chapter';

// ---------------------------------------------------------------------------
// resolveWikilink
// ---------------------------------------------------------------------------
describe('resolveWikilink', () => {
  it('converts a same-level wikilink to a relative URL', () => {
    expect(resolveWikilink('[[hallucination]]', 'using-ai')).toBe(
      '[hallucination](/using-ai/hallucination)',
    );
  });

  it('converts a same-level wikilink without brackets for display label', () => {
    expect(resolveWikilink('[[prompt-engineering-basics]]', 'foundations')).toBe(
      '[prompt-engineering-basics](/foundations/prompt-engineering-basics)',
    );
  });

  it('resolves a cross-level link (01-foundations/topic)', () => {
    expect(resolveWikilink('[[01-foundations/what-is-an-llm]]', 'using-ai')).toBe(
      '[what-is-an-llm](/foundations/what-is-an-llm)',
    );
  });

  it('resolves a cross-level link (02-using-ai/topic)', () => {
    expect(resolveWikilink('[[02-using-ai/hallucination]]', 'foundations')).toBe(
      '[hallucination](/using-ai/hallucination)',
    );
  });

  it('resolves cross-level links for building-with-ai (03-)', () => {
    expect(resolveWikilink('[[03-building-with-ai/rag-retrieval-augmented-generation]]', 'using-ai')).toBe(
      '[rag-retrieval-augmented-generation](/building-with-ai/rag-retrieval-augmented-generation)',
    );
  });

  it('strips reference links (06-references/...)', () => {
    expect(resolveWikilink('[[06-references/papers#brown-2020-gpt3]]', 'using-ai')).toBe('');
  });

  it('strips reference links for any 06- path', () => {
    expect(resolveWikilink('[[06-references/videos-courses#karpathy]]', 'foundations')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// convertFrontmatter
// ---------------------------------------------------------------------------
describe('convertFrontmatter', () => {
  const baseKb = {
    title: 'Hallucination — เมื่อ AI มั่นใจแต่ผิด',
    level: 2,
    chapter: 'Level 2 — Using AI',
    status: 'reviewed' as const,
    prerequisites: ['[[01-foundations/what-is-an-llm]]', '[[how-llms-respond]]'],
    'learning-objectives': ['อธิบายได้'],
    tags: ['using-ai', 'llm'],
    related: ['[[hallucination]]'],
    sources: ['[[06-references/papers#brown-2020]]'],
    'last-updated': '2026-05-18',
  };

  it('maps level 2 to "using-ai"', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.level).toBe('using-ai');
  });

  it('maps level 1 to "foundations"', () => {
    const kb = { ...baseKb, level: 1 };
    const fm = convertFrontmatter(kb, 'what-is-an-llm');
    expect(fm.level).toBe('foundations');
  });

  it('maps level 3 to "building-with-ai"', () => {
    const kb = { ...baseKb, level: 3 };
    const fm = convertFrontmatter(kb, 'some-chapter');
    expect(fm.level).toBe('building-with-ai');
  });

  it('maps level 4 to "advanced"', () => {
    const kb = { ...baseKb, level: 4 };
    const fm = convertFrontmatter(kb, 'some-chapter');
    expect(fm.level).toBe('advanced');
  });

  it('sets slug from the passed slug argument', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.slug).toBe('hallucination');
  });

  it('preserves title', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.title).toBe('Hallucination — เมื่อ AI มั่นใจแต่ผิด');
  });

  it('preserves status', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.status).toBe('reviewed');
  });

  it('strips wikilinks from prerequisites — cross-level', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.prerequisites).toContain('what-is-an-llm');
    expect(fm.prerequisites).toContain('how-llms-respond');
    // no brackets
    expect(fm.prerequisites.some(p => p.includes('[['))).toBe(false);
  });

  it('strips level prefix from cross-level prereq (01-foundations/topic → topic)', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.prerequisites).toContain('what-is-an-llm');
    expect(fm.prerequisites.some(p => p.includes('01-foundations'))).toBe(false);
  });

  it('maps last-updated to last_reviewed', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.last_reviewed).toBe('2026-05-18');
    expect((fm as Record<string, unknown>)['last-updated']).toBeUndefined();
  });

  it('drops KB-only fields: chapter, learning-objectives, tags, related, sources', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination') as Record<string, unknown>;
    expect(fm['chapter']).toBeUndefined();
    expect(fm['learning-objectives']).toBeUndefined();
    expect(fm['tags']).toBeUndefined();
    expect(fm['related']).toBeUndefined();
    expect(fm['sources']).toBeUndefined();
  });

  it('includes tldr when provided', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination', 'Short summary text.');
    expect(fm.tldr).toBe('Short summary text.');
  });

  it('omits tldr when not provided', () => {
    const fm = convertFrontmatter(baseKb, 'hallucination');
    expect(fm.tldr).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// convertBody
// ---------------------------------------------------------------------------

const SAMPLE_L2_BODY = `
# Hallucination — เมื่อ AI มั่นใจแต่ผิด

## TL;DR
Hallucination คือพฤติกรรม LLM ที่ผลิตข้อความผิด.

## Prerequisites
- [[01-foundations/what-is-an-llm]] — ต้องรู้ก่อน

## Learning Objectives
หลังอ่านจบ ผู้อ่านจะ:
1. อธิบายได้

---

## 1. Surface — เข้าใจในระดับภาพรวม

Surface content here.

---

## 2. Deeper — เข้าใจในระดับเทคนิค

Deeper technical content here.

### 2.1 Detail section

More deeper content.

---

## Worked Examples

### Example 1

Example content.

---

## Common Misconceptions

Misconception content.

---

## Self-Check

Self-check questions.

---

## Where this fits in the curriculum

Curriculum context. Should be stripped.

---

## Related Topics

Related content. Should be stripped.

## References

References. Should be stripped.

## Open Questions

Open questions. Should be stripped.

## Note Maintenance

Maintenance. Should be stripped.
`.trim();

describe('convertBody', () => {
  it('wraps Surface content in <section data-depth="surface">', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).toContain('<section data-depth="surface">');
    expect(result).toContain('Surface content here.');
  });

  it('wraps Deeper content in <section data-depth="deeper">', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).toContain('<section data-depth="deeper">');
    expect(result).toContain('Deeper technical content here.');
  });

  it('renames TL;DR to "## พูดสั้นๆ" inside surface section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).toContain('## พูดสั้นๆ');
    expect(result).not.toContain('## TL;DR');
  });

  it('includes TL;DR content inside the surface section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const surfaceStart = result.indexOf('<section data-depth="surface">');
    const surfaceEnd = result.indexOf('</section>', surfaceStart);
    const surfaceContent = result.slice(surfaceStart, surfaceEnd);
    expect(surfaceContent).toContain('Hallucination คือพฤติกรรม LLM');
  });

  it('adds "## ลึกขึ้นหน่อย" heading at start of deeper section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const deeperStart = result.indexOf('<section data-depth="deeper">');
    const deeperEnd = result.indexOf('</section>', deeperStart);
    const deeperContent = result.slice(deeperStart, deeperEnd);
    expect(deeperContent).toContain('## ลึกขึ้นหน่อย');
  });

  it('includes Worked Examples inside deeper section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const deeperStart = result.indexOf('<section data-depth="deeper">');
    const deeperEnd = result.indexOf('</section>', deeperStart);
    const deeperContent = result.slice(deeperStart, deeperEnd);
    expect(deeperContent).toContain('Example content.');
  });

  it('includes Common Misconceptions inside deeper section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const deeperStart = result.indexOf('<section data-depth="deeper">');
    const deeperEnd = result.indexOf('</section>', deeperStart);
    const deeperContent = result.slice(deeperStart, deeperEnd);
    expect(deeperContent).toContain('Misconception content.');
  });

  it('includes Self-Check inside deeper section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const deeperStart = result.indexOf('<section data-depth="deeper">');
    const deeperEnd = result.indexOf('</section>', deeperStart);
    const deeperContent = result.slice(deeperStart, deeperEnd);
    expect(deeperContent).toContain('Self-check questions.');
  });

  it('strips H1 title from the output', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('# Hallucination — เมื่อ AI มั่นใจแต่ผิด');
  });

  it('strips Prerequisites section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## Prerequisites');
  });

  it('strips Learning Objectives section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## Learning Objectives');
  });

  it('strips "Where this fits in the curriculum" section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('Where this fits in the curriculum');
    expect(result).not.toContain('Curriculum context.');
  });

  it('strips Related Topics section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## Related Topics');
    expect(result).not.toContain('Related content.');
  });

  it('strips References section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## References');
  });

  it('strips Open Questions section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## Open Questions');
  });

  it('strips Note Maintenance section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    expect(result).not.toContain('## Note Maintenance');
  });

  it('closes surface section before deeper section', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const surfaceClose = result.indexOf('</section>');
    const deeperOpen = result.indexOf('<section data-depth="deeper">');
    expect(surfaceClose).toBeGreaterThan(-1);
    expect(deeperOpen).toBeGreaterThan(surfaceClose);
  });

  it('closes deeper section at end', () => {
    const result = convertBody(SAMPLE_L2_BODY, 'using-ai');
    const lastClose = result.lastIndexOf('</section>');
    const deeperOpen = result.indexOf('<section data-depth="deeper">');
    expect(lastClose).toBeGreaterThan(deeperOpen);
  });

  it('converts wikilinks in body text', () => {
    const body = `
## 1. Surface — เข้าใจในระดับภาพรวม
See [[hallucination]] for more.
## 2. Deeper — เข้าใจในระดับเทคนิค
Also see [[01-foundations/what-is-an-llm]] here.
`.trim();
    const result = convertBody(body, 'using-ai');
    expect(result).toContain('[hallucination](/using-ai/hallucination)');
    expect(result).toContain('[what-is-an-llm](/foundations/what-is-an-llm)');
  });

  it('strips reference wikilinks from body text', () => {
    const body = `
## 1. Surface — เข้าใจในระดับภาพรวม
See [[06-references/papers#brown-2020]] for the paper.
## 2. Deeper — เข้าใจในระดับเทคนิค
Technical details.
`.trim();
    const result = convertBody(body, 'using-ai');
    expect(result).not.toContain('[[06-references');
    expect(result).not.toContain('#brown-2020');
  });
});

// ---------------------------------------------------------------------------
// convertChapterFile — full round-trip
// ---------------------------------------------------------------------------

const FULL_CHAPTER = `---
title: Hallucination — เมื่อ AI มั่นใจแต่ผิด
level: 2
chapter: Level 2 — Using AI
status: reviewed
prerequisites:
  - "[[01-foundations/what-is-an-llm]]"
  - "[[how-llms-respond]]"
learning-objectives:
  - "อธิบายได้"
tags: [using-ai, llm]
related:
  - "[[training-cutoff-and-real-time-info]]"
sources:
  - "[[06-references/papers#brown-2020-gpt3]]"
last-updated: 2026-05-18
---

# Hallucination — เมื่อ AI มั่นใจแต่ผิด

## TL;DR
Hallucination summary text.

## Prerequisites
- [[what-is-an-llm]]

## Learning Objectives
1. Objective one.

---

## 1. Surface — เข้าใจในระดับภาพรวม

Surface explanation.

---

## 2. Deeper — เข้าใจในระดับเทคนิค

Deep explanation.

---

## Worked Examples

Example here.

---

## Common Misconceptions

Misconception here.

---

## Self-Check

Question here.

---

## Where this fits in the curriculum

Context here.

## References

Ref here.
`;

describe('convertChapterFile', () => {
  it('produces valid YAML frontmatter with correct level', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    expect(result).toMatch(/^---\n/);
    expect(result).toContain('level: using-ai');
  });

  it('puts TL;DR text into tldr frontmatter field', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    expect(result).toContain('tldr:');
    expect(result).toContain('Hallucination summary text.');
  });

  it('outputs last_reviewed (underscored)', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    expect(result).toContain('last_reviewed: 2026-05-18');
  });

  it('does not contain last-updated (hyphenated)', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    expect(result).not.toContain('last-updated:');
  });

  it('has plain string prerequisites (no wikilink brackets)', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    const fmEnd = result.indexOf('\n---\n', 4);
    const frontmatter = result.slice(0, fmEnd);
    expect(frontmatter).not.toContain('[[');
    expect(frontmatter).toContain('what-is-an-llm');
    expect(frontmatter).toContain('how-llms-respond');
  });

  it('does not contain KB-only fields in frontmatter', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    const fmEnd = result.indexOf('\n---\n', 4);
    const frontmatter = result.slice(0, fmEnd);
    expect(frontmatter).not.toContain('chapter:');
    expect(frontmatter).not.toContain('learning-objectives:');
    expect(frontmatter).not.toContain('tags:');
    expect(frontmatter).not.toContain('related:');
    expect(frontmatter).not.toContain('sources:');
  });

  it('body contains both surface and deeper sections', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    expect(result).toContain('<section data-depth="surface">');
    expect(result).toContain('<section data-depth="deeper">');
  });

  it('does not contain H1 title in body', () => {
    const result = convertChapterFile(FULL_CHAPTER, 'hallucination');
    const fmEnd = result.indexOf('\n---\n', 4) + 5;
    const body = result.slice(fmEnd);
    expect(body).not.toContain('# Hallucination');
  });
});
