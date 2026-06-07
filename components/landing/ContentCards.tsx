'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { RevealGroup, revealItem } from './Reveal';

const SERIF = "font-['Noto_Serif_Thai',serif]";

type Card = {
  img: string;
  title: string;
  desc: string;
  href: string;
  soon?: boolean;
  tint: string;
};

const CARDS: Card[] = [
  { img: 'what-is-ai', title: 'AI คืออะไร', desc: 'รู้จัก AI ตั้งแต่ศูนย์ ว่ามันคืออะไร ทำงานยังไง ไม่ต้องมีพื้นฐานคอมพิวเตอร์', href: '/what-is-ai', tint: '#14B5AB' },
  { img: 'products', title: 'เครื่องมือ AI', desc: 'แยกให้ออกว่า ChatGPT, Claude และ product อื่น ๆ ต่างกันยังไง เลือกใช้ตัวไหน', href: '/products', tint: '#2D7CD6' },
  { img: 'pro-usage', title: 'ใช้แบบมือโปร', desc: 'Context, token, skills และการสั่งงาน AI อย่างมืออาชีพ', href: '/pro-usage', soon: true, tint: '#B45A1A' },
  { img: 'in-practice', title: 'ลงมือทำจริง', desc: 'ติดตั้ง เริ่มใช้ อ่าน docs และให้ AI ลงมือทำงานแทนคุณ', href: '/in-practice', soon: true, tint: '#7A3FA0' },
];

export function ContentCards() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
      <div className="mb-12 text-center">
        <h2 className={`${SERIF} mb-3 text-[28px] font-bold text-[#00143C] md:text-[34px]`}>
          เรียนอะไรบ้าง
        </h2>
        <p className="font-['DM_Sans',sans-serif] text-[16px] text-[#00143C]/60">
          สี่ช่วง จากไม่รู้อะไรเลย จนใช้ AI ทำงานแทนได้
        </p>
      </div>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(c => (
          <CardItem key={c.href} card={c} />
        ))}
      </RevealGroup>
    </section>
  );
}

function CardItem({ card }: { card: Card }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={revealItem}>
      <Link
        href={card.href}
        className="group block h-full rounded-2xl border border-[#E8E2D4] bg-white p-6 no-underline transition-colors hover:border-[color:var(--tint)]"
        style={{ ['--tint' as string]: card.tint }}
      >
        <motion.div
          className="mb-4 flex h-32 items-center justify-center"
          whileHover={reduce ? undefined : { rotate: [0, -3, 3, 0], y: -4 }}
          transition={{ duration: 0.5 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/landing/cards/${card.img}.png`} alt="" className="h-full w-auto object-contain" loading="lazy" />
        </motion.div>

        <div className="flex items-center gap-2">
          <h3 className={`${SERIF} text-[21px] font-bold text-[#00143C]`}>{card.title}</h3>
          {card.soon && (
            <span className="rounded-full bg-[#F4F1E9] px-2 py-0.5 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-[#00143C]/45">
              เร็ว ๆ นี้
            </span>
          )}
        </div>
        <p className="mt-2 font-['DM_Sans',sans-serif] text-[14px] leading-[1.7] text-[#00143C]/65">
          {card.desc}
        </p>
        <span
          className="mt-4 inline-flex items-center gap-1 font-['DM_Sans',sans-serif] text-[14px] font-medium transition-all group-hover:gap-2"
          style={{ color: card.tint }}
        >
          {card.soon ? 'ดูตัวอย่าง' : 'เริ่มอ่าน'}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </Link>
    </motion.div>
  );
}
