'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LABEL = 'ผมถนัด';
const PHRASES = [
  'อธิบาย AI เป็นภาษาคน',
  'ทำเรื่องยาก ให้เข้าใจง่าย',
  'ใช้ AI ได้จริงในงาน',
  'เล่าจากมุมคนทำธุรกิจ',
];

export function SpecialtyBand() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI(n => (n + 1) % PHRASES.length), 2600);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);
  // Only resume when focus actually leaves the band, not when it moves between children.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
  };

  return (
    <section className="border-y border-[#E8E2D4] bg-[#FBF9F4]">
      <div
        data-rotating-band
        data-paused={paused ? 'true' : 'false'}
        role="group"
        aria-label="ความถนัดของผม (วางเมาส์หรือโฟกัสเพื่อหยุด)"
        tabIndex={0}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={handleBlur}
        className="mx-auto flex max-w-[1200px] flex-col items-start gap-2 px-6 py-12 outline-none focus-visible:ring-2 focus-visible:ring-[#14B5AB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF9F4] md:flex-row md:items-baseline md:gap-6 md:py-16"
      >
        <span className="text-[15px] font-medium uppercase tracking-[0.2em] text-[#00143C]/45">
          {LABEL}
        </span>
        <div className="relative h-[44px] overflow-hidden md:h-[60px]">
          {reduce ? (
            <span data-phrase className="block text-[30px] font-bold text-[#14B5AB] md:text-[44px]">
              {PHRASES[0]}
            </span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={i}
                data-phrase
                className="block text-[30px] font-bold text-[#14B5AB] md:text-[44px]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
              >
                {PHRASES[i]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
