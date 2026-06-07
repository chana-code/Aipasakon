'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Doodle } from './Doodle';
import { AvatarMedia } from './AvatarMedia';
import { PlaneFlyby } from './PlaneFlyby';
import { NowPlaying } from './NowPlaying';

/* ---- Editable copy (Ong: tweak freely) ---------------------------------- */
const COPY = {
  greeting: 'สวัสดีครับ ผมอ๋อง',
  headline: 'ผมทำให้ AI เข้าใจง่าย เป็นภาษาคน',
  sub: 'เรียนรู้ AI ตั้งแต่ศูนย์ จนใช้งานได้จริง — เล่าโดยคนทำธุรกิจ ไม่ใช่โปรแกรมเมอร์',
  ctaPrimary: 'เริ่มอ่าน',
  ctaPrimaryHref: '/what-is-ai',
  ctaSecondary: 'ดูหลักสูตรทั้งหมด',
  ctaSecondaryHref: '/curriculum',
  stickyLabel: 'กำลังเขียนบท',
  stickyValue: 'Pro Usage',
  nowPlaying: 'Lo-Fi เพื่อสมาธิ',
};
/* ------------------------------------------------------------------------- */


const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.6, 0.2, 1] } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? 'show' : 'hidden';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FBF9F4 0%, #EAF8F6 48%, #FDF6E0 100%)',
      }}
    >
      {/* soft glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#14B5AB]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#E8C547]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* ---- Left: copy ---- */}
        <motion.div variants={container} initial={initial} animate="show">
          <motion.p
            variants={item}
            className={`mb-3 text-[20px] font-medium text-[#14B5AB] md:text-[22px]`}
          >
            {COPY.greeting}
          </motion.p>

          <motion.h1
            variants={item}
            className={`mb-6 text-[40px] font-bold leading-[1.18] text-[#00143C] md:text-[54px]`}
          >
            {COPY.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mb-9 max-w-[480px] text-[17px] leading-[1.85] text-[#00143C]/75"
          >
            {COPY.sub}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Link
              href={COPY.ctaPrimaryHref}
              className="group flex items-center gap-2 rounded-full bg-[#00143C] px-7 py-3.5 text-[15px] font-medium text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-[#14B5AB] hover:shadow-lg"
            >
              {COPY.ctaPrimary}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <Link
              href={COPY.ctaSecondaryHref}
              className="rounded-full border border-[#00143C]/20 px-7 py-3.5 text-[15px] font-medium text-[#00143C] no-underline transition-all hover:border-[#00143C]/40 hover:bg-white/50"
            >
              {COPY.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>

        {/* ---- Right: avatar + decorations ---- */}
        <div className="relative mx-auto w-full max-w-[420px]">
          {/* avatar card */}
          {/* plain wrapper — no opacity/transform/z so it does NOT create a stacking
              context, letting the avatar's mix-blend-mode:multiply key its white background
              against the page gradient */}
          <div className="relative">
            <AvatarMedia
              video="/landing/video/ong-hero.mp4"
              poster="/landing/avatar/ong-hero.png"
              className="mx-auto w-full"
            />
          </div>

          {/* floating doodles — balanced ring around the figure.
              left column = star (TL) · squares (ML) · rainbow (BL); top = flower;
              right column is held by the sticky note (TR) + now-playing (BR) widgets. */}
          <Doodle name="star" idle="float" size={42} className="-top-3 left-1" />
          <Doodle name="flower" idle="bob" size={48} className="-top-7 left-[42%]" />
          <Doodle name="squares" idle="spin" size={34} className="top-[42%] -left-6" />
          <Doodle name="rainbow" idle="bob" size={50} className="bottom-6 -left-3" />

          {/* paper plane orbits the avatar */}
          <PlaneFlyby />

          {/* CURRENTLY sticky note */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute right-0 -top-6 z-20 w-[140px] md:-right-10 md:-top-10 md:w-[150px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/widgets/sticky.png" alt="" className="h-auto w-full" />
            <div className="absolute inset-x-0 top-[45%] px-5 text-center">
              <p className="text-[8.5px] font-semibold uppercase tracking-wide text-[#00143C]/50">
                {COPY.stickyLabel}
              </p>
              <p className="text-[12px] font-semibold leading-snug text-[#00143C]">
                {COPY.stickyValue}
              </p>
            </div>
          </motion.div>

          {/* now playing widget — click-to-play lo-fi mini player */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="absolute -bottom-2 -right-3 z-20 w-[140px]"
          >
            <NowPlaying />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
