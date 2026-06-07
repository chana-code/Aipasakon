'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const VOLUME = 0.25;

/**
 * Lo-fi mini player, pinned to the bottom-right corner of the viewport (stays put while scrolling).
 * Tries to autoplay a looping background track on load; browsers block audio autoplay until the user
 * interacts, so if the initial play is rejected we arm one-shot listeners that start it on the first
 * click / key / scroll / touch anywhere on the page. The mascot is also a click-to-toggle button.
 * Needs an audio file at /landing/audio/lofi.mp3.
 */
export function NowPlaying() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const a = audioRef.current;
    if (!a) return Promise.reject();
    a.volume = VOLUME;
    return a.play().then(() => setPlaying(true));
  };

  // Attempt autoplay on mount; fall back to starting on the first user gesture.
  useEffect(() => {
    let armed = false;
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    const disarm = () => {
      if (!armed) return;
      armed = false;
      events.forEach((e) => window.removeEventListener(e, start));
    };
    function start(e?: Event) {
      // Ignore gestures on the widget itself — those are handled by the button's onClick (toggle),
      // so the unlock listener never fights a deliberate pause.
      if (e && wrapRef.current && e.target instanceof Node && wrapRef.current.contains(e.target)) return;
      play()
        .then(() => disarm())
        .catch(() => {});
    }
    const arm = () => {
      if (armed) return;
      armed = true;
      events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    };

    play().catch(() => arm());
    return () => disarm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      play().catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={wrapRef} className="fixed bottom-4 right-4 z-50 w-[88px] md:w-[104px]">
      <audio ref={audioRef} src="/landing/audio/lofi.mp3" loop preload="auto" />
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'หยุดเพลง Lo-Fi' : 'เปิดเพลง Lo-Fi เพื่อสมาธิ'}
        aria-pressed={playing}
        title={playing ? 'หยุดเพลง' : 'เปิดเพลง Lo-Fi เพื่อสมาธิ'}
        className="block w-full cursor-pointer"
        animate={playing && !reduce ? { y: [0, -4, 0] } : { y: 0 }}
        transition={playing ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/landing/widgets/nowplaying.png" alt="Lo-Fi เพื่อสมาธิ" className="h-auto w-full" />
      </motion.button>
    </div>
  );
}
