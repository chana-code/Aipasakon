'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

/** Floating hand-drawn decoration — real art from public/landing/doodles/*.png. */

type DoodleName =
  | 'plane' | 'flower' | 'star' | 'rainbow' | 'note' | 'squares' | 'squiggle';
type Idle = 'drift' | 'bob' | 'spin' | 'float';

const IDLE = {
  drift: { y: [0, -10, 0], x: [0, 6, 0], rotate: [0, 4, 0] },
  bob: { y: [0, -8, 0] },
  spin: { rotate: [0, 360] },
  float: { y: [0, -12, 0], rotate: [-4, 4, -4] },
};
const DUR: Record<Idle, number> = { drift: 7, bob: 4, spin: 22, float: 6 };

export function Doodle({
  name,
  idle = 'bob',
  size = 48,
  className = '',
  style,
}: {
  name: DoodleName;
  idle?: Idle;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
      animate={reduce ? undefined : IDLE[idle]}
      transition={reduce ? undefined : { duration: DUR[idle], repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/landing/doodles/${name}.png`}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </motion.div>
  );
}
