'use client';

import Link from 'next/link';
import { AvatarMedia } from './AvatarMedia';
import { Doodle } from './Doodle';
import { Reveal } from './Reveal';


/* ---- Editable copy ---- */
const COPY = {
  kicker: 'เกี่ยวกับผม',
  heading: 'ทำไมผมถึงทำเว็บนี้',
  body: 'ผมชื่ออ๋อง ทำงานสายธุรกิจมาตลอด ไม่ใช่โปรแกรมเมอร์ — เลยเข้าใจดีว่าการเริ่มต้นกับ AI จากศูนย์มันงงแค่ไหน เว็บนี้คือสิ่งที่ผมอยากให้มีตอนที่ผมเริ่มเรียนเอง: อธิบายตรง ๆ เป็นภาษาคน ใช้ได้จริง ไม่ขายฝัน',
  ctaPrimary: 'อ่านเพิ่มเกี่ยวกับผม',
  ctaPrimaryHref: '/about',
};

export function AboutScene() {
  return (
    <section className="border-y border-[#E8E2D4] bg-[#F4F1E9]/50">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* media */}
        <Reveal className="relative order-2 md:order-1">
          <div className="relative mx-auto w-full max-w-[440px]">
            <AvatarMedia
              video="/landing/video/ong-couch.mp4"
              poster="/landing/avatar/ong-couch.png"
              className="mx-auto w-full"
            />
            <Doodle name="note" idle="float" size={40} className="right-6 top-2" />
            <Doodle name="squiggle" idle="bob" size={64} className="-bottom-1 left-4" />
          </div>
        </Reveal>

        {/* bio */}
        <Reveal className="order-1 md:order-2" delay={0.1}>
          <span className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#14B5AB]">
            {COPY.kicker}
          </span>
          <h2 className={`mb-5 mt-3 text-[30px] font-bold leading-[1.25] text-[#00143C] md:text-[40px]`}>
            {COPY.heading}
          </h2>
          <p className="mb-8 max-w-[480px] text-[17px] leading-[1.85] text-[#00143C]/75">
            {COPY.body}
          </p>
          <Link
            href={COPY.ctaPrimaryHref}
            className="group inline-flex items-center gap-2 rounded-full bg-[#00143C] px-7 py-3.5 text-[15px] font-medium text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-[#14B5AB] hover:shadow-lg"
          >
            {COPY.ctaPrimary}
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
