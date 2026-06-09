import { writeFileSync } from 'fs';
import { join } from 'path';

export interface BlogInput { slug: string; title: string; date: string; summary: string; tags: string[]; body: string; }

function yamlScalar(s: string): string {
  // Quote when the value contains YAML-significant chars so it parses as one string.
  return /[:#]/.test(s) ? JSON.stringify(s) : s;
}

export function buildBlogMdx(input: BlogInput): string {
  const tags = input.tags.map(t => `  - ${yamlScalar(t)}`).join('\n');
  return `---\ntitle: ${yamlScalar(input.title)}\ndate: ${input.date}\nsummary: ${yamlScalar(input.summary)}\ntags:\n${tags}\n---\n\n${input.body.trim()}\n`;
}

export function writeBlog(blogDir: string, input: BlogInput): string {
  const path = join(blogDir, `${input.slug}.mdx`);
  writeFileSync(path, buildBlogMdx(input));
  return path;
}
