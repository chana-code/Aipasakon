'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { RevealGroup, revealItem } from './Reveal';

const SERIF = "font-['Noto_Serif_Thai',serif]";

type Feature = {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  tint: string;
};

const FEATURES: Feature[] = [
  {
    icon: 'biotech',
    title: 'ผ่าโมเดล AI ดูข้างใน',
    desc: 'เปิดไฟล์โมเดลจริง แล้วดูว่ามันคิดยังไงทีละขั้น แบบกดเล่นได้เอง ไม่ต้องเขียนโค้ด',
    href: '/lab-demo',
    cta: 'ลองเล่น Lab',
    tint: '#14B5AB',
  },
  {
    icon: 'play_circle',
    title: 'ดูแบบวิดีโอ',
    desc: 'อยากเข้าใจไว ๆ แบบเห็นภาพ ดูคลิปสั้นที่อธิบายแนวคิด AI ให้เห็นภาพในไม่กี่นาที',
    href: '/videos',
    cta: 'ดูวิดีโอ',
    tint: '#B45A1A',
  },
];

export function VisualRow() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
      <div className="mb-12 text-center">
        <h2 className={`${SERIF} mb-3 text-[28px] font-bold text-[#00143C] md:text-[34px]`}>
          ดูแบบเห็นภาพ
        </h2>
        <p className="font-['DM_Sans',sans-serif] text-[16px] text-[#00143C]/60">
          บางเรื่องอ่านแล้วงง แต่พอได้เห็น ได้ลองเล่น ก็เข้าใจเลย
        </p>
      </div>

      <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {FEATURES.map(f => (
          <FeatureItem key={f.href} f={f} />
        ))}
      </RevealGroup>
    </section>
  );
}

function FeatureItem({ f }: { f: Feature }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={revealItem}>
      <Link
        href={f.href}
        className="group flex h-full items-start gap-5 rounded-2xl border border-[#E8E2D4] bg-white p-7 no-underline transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(0,20,60,0.18)]"
      >
        <motion.span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${f.tint}1a`, color: f.tint }}
          whileHover={reduce ? undefined : { rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.5 }}
        >
          <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
        </motion.span>
        <div>
          <h3 className={`${SERIF} text-[22px] font-bold text-[#00143C]`}>{f.title}</h3>
          <p className="mt-2 font-['DM_Sans',sans-serif] text-[15px] leading-[1.7] text-[#00143C]/65">
            {f.desc}
          </p>
          <span
            className="mt-4 inline-flex items-center gap-1 font-['DM_Sans',sans-serif] text-[14px] font-medium transition-all group-hover:gap-2"
            style={{ color: f.tint }}
          >
            {f.cta}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
