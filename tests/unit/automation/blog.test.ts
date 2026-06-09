import { describe, it, expect } from 'vitest';
import { buildBlogMdx } from '../../../automation/blog/writeBlog';
import matter from 'gray-matter';
import { BlogFrontmatter } from '../../../lib/content/blog';

describe('buildBlogMdx', () => {
  it('produces frontmatter that satisfies the site BlogFrontmatter schema', () => {
    const mdx = buildBlogMdx({ slug:'gemini-3-5-flash', title:'A: B test', date:'2026-06-10', summary:'sum', tags:['ข่าว AI','Google'], body:'เนื้อหา' });
    const { data, content } = matter(mdx);
    if (data.date instanceof Date) data.date = data.date.toISOString().slice(0,10); // same coercion as lib/content/blog.ts
    expect(() => BlogFrontmatter.parse(data)).not.toThrow();
    expect(content.trim()).toBe('เนื้อหา');
    expect(data.tags).toEqual(['ข่าว AI','Google']);
  });
});
