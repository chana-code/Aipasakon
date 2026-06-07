import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo/site';

export const runtime = 'nodejs';

/**
 * Dynamic Open Graph / Twitter card image.
 *
 *   /og?title=...&tag=...&kicker=...
 *
 * Renders a branded 1200x630 card. Thai glyphs require a Thai-capable font, so
 * we fetch the brand font (Prompt) from Google Fonts, subsetted to exactly the
 * characters on the card (the documented next/og pattern). If the fetch fails
 * we still return a card using the default font rather than erroring.
 */

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = '#FBF9F4';
const INK = '#00143C';
const TEAL = '#14B5AB';

async function loadFont(text: string, weight: 400 | 600): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Prompt:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    const fontUrl = match?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || SITE.tagline).slice(0, 120);
  const tag = (searchParams.get('tag') || '').slice(0, 40);
  const kicker = (searchParams.get('kicker') || SITE.name).slice(0, 40);

  // Subset the font to every glyph we'll actually draw.
  const glyphs = `${title}${tag}${kicker}${SITE.name}${SITE.url}`;
  const [regular, semibold] = await Promise.all([loadFont(glyphs, 400), loadFont(glyphs, 600)]);

  const fonts = [
    regular && { name: 'Prompt', data: regular, weight: 400 as const, style: 'normal' as const },
    semibold && { name: 'Prompt', data: semibold, weight: 600 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 600; style: 'normal' }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          padding: '72px 80px',
          fontFamily: fonts.length ? 'Prompt' : 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Teal accent rule, like a teacher's underline */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: WIDTH, height: 12, background: TEAL }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: TEAL,
              letterSpacing: '0.02em',
            }}
          >
            {kicker}
          </div>
          {tag ? (
            <div
              style={{
                fontSize: 24,
                color: '#fff',
                background: TEAL,
                padding: '4px 16px',
                borderRadius: 999,
              }}
            >
              {tag}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 600,
            color: INK,
            lineHeight: 1.18,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>{SITE.name}</div>
          <div style={{ fontSize: 26, color: '#5B6577' }}>www.aipasakon.com</div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts: fonts.length ? fonts : undefined },
  );
}
