/**
 * Schema.org JSON-LD builders. Each returns a plain object that the <JsonLd>
 * component serialises into a <script type="application/ld+json"> tag.
 *
 * These power rich results in Google and give AI answer engines (ChatGPT,
 * Perplexity, Gemini, Google AI Overviews) structured, citable facts about
 * each page — author, type, breadcrumb trail, and how pages relate.
 */
import { SITE, absoluteUrl } from './site';

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

/** Stable Organization node, referenced by @id from every other node. */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.nameLatin,
    url: SITE.url,
    description: SITE.description,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon.png'),
    },
    founder: { '@type': 'Person', name: SITE.author },
    knowsAbout: ['Artificial Intelligence', 'Large Language Models', 'Prompt Engineering', 'ChatGPT', 'Claude'],
  };
}

/** WebSite node with a SearchAction so engines surface the on-site search box. */
export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    alternateName: SITE.nameLatin,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** A learning chapter — modelled as both an Article and a LearningResource. */
export function chapterLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  section: string;
  image: string;
  readMinutes?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LearningResource', 'TechArticle'],
    '@id': `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    image: opts.image,
    inLanguage: SITE.lang,
    isAccessibleForFree: true,
    learningResourceType: 'Lesson',
    educationalLevel: opts.section,
    articleSection: opts.section,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.readMinutes ? { timeRequired: `PT${opts.readMinutes}M` } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: absoluteUrl(opts.path),
  };
}

/** A blog post / article. */
export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    image: opts.image,
    inLanguage: SITE.lang,
    isAccessibleForFree: true,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified ?? opts.datePublished } : {}),
    ...(opts.tags && opts.tags.length ? { keywords: opts.tags.join(', ') } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: absoluteUrl(opts.path),
  };
}

/** The curriculum as a whole, or a single level, as a Course. */
export function courseLd(opts: {
  name: string;
  description: string;
  path: string;
  numberOfLessons?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: SITE.lang,
    provider: { '@id': ORG_ID },
    isAccessibleForFree: true,
    educationalLevel: 'Beginner to Advanced',
    teaches: 'การใช้งาน AI และ Large Language Models',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: opts.numberOfLessons ? `PT${opts.numberOfLessons * 12}M` : undefined,
    },
  };
}

/** A YouTube-backed lesson video. */
export function videoLd(opts: {
  title: string;
  description: string;
  path: string;
  youtubeId: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: opts.title,
    description: opts.description || opts.title,
    url: absoluteUrl(opts.path),
    inLanguage: SITE.lang,
    thumbnailUrl: `https://i.ytimg.com/vi/${opts.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${opts.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${opts.youtubeId}`,
    publisher: { '@id': ORG_ID },
  };
}

export type FaqItem = { question: string; answer: string };

export function faqLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(it => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

/** A list of items (glossary, skills, blog index) as a CollectionPage. */
export function collectionLd(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: SITE.lang,
    isPartOf: { '@id': SITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: absoluteUrl(it.path),
      })),
    },
  };
}
