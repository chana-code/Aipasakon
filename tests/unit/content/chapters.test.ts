import { describe, it, expect, beforeAll } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { loadAllChapters, loadChapter } from '@/lib/content/chapters';

const FIXTURE_DIR = path.resolve(__dirname, '../../../content/chapters/foundations');

beforeAll(() => {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  writeFileSync(
    path.join(FIXTURE_DIR, 'sample-test.mdx'),
    `---
slug: sample-test
level: foundations
title: "Sample"
status: drafting
prerequisites: []
---
Hello world.
`,
  );
});

describe('chapters loader', () => {
  it('loads all chapters with parsed frontmatter', async () => {
    const chapters = await loadAllChapters();
    const sample = chapters.find(c => c.slug === 'sample-test');
    expect(sample).toBeDefined();
    expect(sample?.level).toBe('foundations');
    expect(sample?.title).toBe('Sample');
    expect(sample?.status).toBe('drafting');
  });

  it('loads a single chapter by level and slug, including raw MDX body', async () => {
    const chapter = await loadChapter('foundations', 'sample-test');
    expect(chapter.body).toContain('Hello world.');
  });

  it('throws on malformed frontmatter', async () => {
    writeFileSync(
      path.join(FIXTURE_DIR, 'broken.mdx'),
      `---
slug: broken
level: not-a-real-level
title: ""
status: drafting
---
`,
    );
    await expect(loadAllChapters()).rejects.toThrow();
    rmSync(path.join(FIXTURE_DIR, 'broken.mdx'));
  });
});
