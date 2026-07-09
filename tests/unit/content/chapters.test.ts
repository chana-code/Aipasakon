import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { loadAllChapters, loadChapter } from '@/lib/content/chapters';

// Fixtures live in an ARCHIVED level dir (foundations): loadAllChapters must ignore
// them (archive excluded from every render path), while loadChapter can still read
// an explicit path — that split is the behavior under test.
const FIXTURE_DIR = path.resolve(__dirname, '../../../content/chapters/foundations');
const FIXTURE = path.join(FIXTURE_DIR, 'sample-test.mdx');
const BROKEN = path.join(FIXTURE_DIR, 'broken.mdx');

beforeAll(() => {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  writeFileSync(
    FIXTURE,
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

afterAll(() => {
  rmSync(FIXTURE, { force: true });
  rmSync(BROKEN, { force: true });
});

describe('chapters loader', () => {
  it('loads core-level chapters with parsed frontmatter and excludes archived levels', async () => {
    const chapters = await loadAllChapters();
    // Archived fixture is invisible to the site-wide loader.
    expect(chapters.find(c => c.slug === 'sample-test')).toBeUndefined();
    expect(chapters.some(c => c.level === 'foundations')).toBe(false);
    // Core content is present and parsed.
    const core = chapters.find(c => c.level === 'what-is-ai');
    expect(core).toBeDefined();
    expect(core?.title).toBeTruthy();
    expect(core?.body.length).toBeGreaterThan(0);
  });

  it('loads a single chapter by level and slug, including raw MDX body', async () => {
    const chapter = await loadChapter('foundations', 'sample-test');
    expect(chapter.body).toContain('Hello world.');
    expect(chapter.title).toBe('Sample');
  });

  it('throws on malformed frontmatter', async () => {
    writeFileSync(
      BROKEN,
      `---
slug: broken
level: not-a-real-level
title: ""
status: drafting
---
`,
    );
    await expect(loadChapter('foundations', 'broken')).rejects.toThrow();
    rmSync(BROKEN);
  });
});
