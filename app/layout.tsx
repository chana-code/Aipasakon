import './globals.css';
import type { Metadata, Viewport } from 'next';
import { TopNav } from '@/components/chrome/TopNav';
import { Footer } from '@/components/chrome/Footer';
import { SITE, ogImageUrl } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationLd, webSiteLd } from '@/lib/seo/jsonld';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14B5AB',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  publisher: SITE.name,
  applicationName: SITE.name,
  alternates: {
    canonical: '/',
    languages: { 'th-TH': '/' },
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: ogImageUrl({ title: SITE.tagline }), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [ogImageUrl({ title: SITE.tagline })],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/icon.png', apple: '/icon.png' },
  category: 'education',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.lang}>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[organizationLd(), webSiteLd()]} />
        <TopNav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
