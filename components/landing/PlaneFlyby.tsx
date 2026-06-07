'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Paper plane that slowly orbits the avatar. Place INSIDE the avatar's relative container so the
 * orbit is centred on the figure. Elliptical path via x/y keyframes; the plane rotates once per
 * loop so it banks along its travel. Hidden for reduced motion.
 */
const RX = 220; // horizontal orbit radius (px)
const RY = 200; // vertical orbit radius (px)
const STEPS = 24;

const xs: number[] = [];
const ys: number[] = [];
for (let i = 0; i <= STEPS; i++) {
  const a = (i / STEPS) * Math.PI * 2;
  xs.push(Math.round(RX * Math.cos(a)));
  ys.push(Math.round(RY * Math.sin(a)));
}

export function PlaneFlyby() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.img
      src="/landing/doodles/plane.png"
      alt=""
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 -ml-7 -mt-7 w-12 md:w-14"
      animate={{ x: xs, y: ys, rotate: [10, -350] }}
      transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
    />
  );
}
