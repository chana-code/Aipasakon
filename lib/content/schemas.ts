import { z } from 'zod';
import { LEVELS } from './levels';

export const StatusEnum = z.enum(['stub', 'drafting', 'reviewed', 'stable']);
export const LevelEnum = z.enum(LEVELS);

export const ChapterFrontmatter = z.object({
  slug: z.string().min(1),
  level: LevelEnum,
  order: z.coerce.number().default(999),
  act: z.coerce.number().optional(),
  title: z.string().min(1),
  status: StatusEnum,
  prerequisites: z.array(z.string()).default([]),
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** First-published date. When absent, falls back to last_reviewed for schema dates. */
  published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tldr: z.string().optional(),
  /** Optional hand-written meta description. When absent, derived from tldr. */
  description: z.string().optional(),
  /** Optional FAQ — rendered as a visible section AND emitted as FAQPage JSON-LD. */
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
});
export type ChapterFrontmatter = z.infer<typeof ChapterFrontmatter>;

export const Video = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  youtube_id: z.string().min(1),
  level: LevelEnum,
  linked_chapter_slugs: z.array(z.string()).default([]),
  description: z.string().default(''),
});
export type Video = z.infer<typeof Video>;

export const GlossaryEntry = z.object({
  term_en: z.string().min(1),
  term_th: z.string().nullable().default(null),
  definition_th: z.string().min(1),
  see_also: z.array(z.string()).default([]),
  group: z.string().optional(),
  full_chapter: z.string().optional(), // site route, e.g. "/products/the-model"
});
export const Glossary = z.array(GlossaryEntry);
export type GlossaryEntry = z.infer<typeof GlossaryEntry>;
