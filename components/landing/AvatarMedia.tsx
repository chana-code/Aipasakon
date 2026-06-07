'use client';

import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';

/**
 * The character. Renders, in priority order:
 *   1. a looping video  (video/ong-hero.mp4 from Higgsfield)  — if `video` set and loads
 *   2. a static image    (avatar/ong-hero.png from ChatGPT)    — reduced-motion or video missing
 *   3. an inline SVG placeholder                               — if no art exists yet
 *
 * The Higgsfield mp4 has an opaque near-white background (mp4 can't hold alpha), and the
 * ChatGPT line art is dark ink on light. `mix-blend-mode: multiply` lets the page gradient show
 * through every white/light pixel while keeping the ink — so both video and poster "float" on the
 * gradient with no white box, no chroma-key fringing. Fixed aspect box prevents layout shift when
 * the (square) video swaps in for the (wider) poster.
 */
export function AvatarMedia({
  video,
  poster,
  className = '',
  cover = false,
}: {
  video?: string;
  poster?: string;
  className?: string;
  /** Fill the box (object-cover) instead of fitting inside it — e.g. a cropped
   *  face inside a circular avatar. Parent must clip (overflow-hidden + rounded). */
  cover?: boolean;
}) {
  const reduce = useReducedMotion();
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const showVideo = !!video && !videoFailed && !reduce;
  const showPoster = !!poster && !posterFailed && !showVideo;
  const showPlaceholder = !showVideo && !showPoster;

  const blend = { mixBlendMode: 'multiply' as const };
  const fit = `absolute inset-0 h-full w-full ${cover ? 'object-cover' : 'object-contain'}`;

  return (
    <div className={`relative aspect-square ${className}`}>
      {showVideo && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={video}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className={fit}
          style={blend}
        />
      )}
      {showPoster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt="อ๋อง"
          onError={() => setPosterFailed(true)}
          className={fit}
          style={blend}
        />
      )}
      {showPlaceholder && <PlaceholderAvatar animate={!reduce} />}
    </div>
  );
}

const NAVY = '#00143C';

function PlaceholderAvatar({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" className="absolute inset-0 h-full w-full" role="img" aria-label="ภาพประกอบอ๋อง (ตัวอย่าง)">
      <path d="M40 250h240" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 250l-8-40h96l-8 40z" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <rect x="118" y="168" width="84" height="46" rx="3" stroke={NAVY} strokeWidth="3" />
      <path d="M150 250c-6-34-2-58 10-58s16 24 10 58" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M172 206c14-4 26-16 30-34" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="120" r="34" stroke={NAVY} strokeWidth="3" />
      <path d="M127 116c2-26 18-40 33-40s31 14 33 40c-8-10-20-12-33-12s-25 2-33 12z" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="149" cy="122" r="9" stroke={NAVY} strokeWidth="3" />
      <circle cx="173" cy="122" r="9" stroke={NAVY} strokeWidth="3" />
      <path d="M158 122h6M182 120l8-3M140 120l-6-2" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <path d="M150 138c4 5 16 5 20 0" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
