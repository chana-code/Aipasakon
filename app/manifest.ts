import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF9F4',
    theme_color: '#14B5AB',
    lang: SITE.lang,
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
