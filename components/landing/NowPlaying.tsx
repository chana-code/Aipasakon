'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';

/**
 * Click-to-play lo-fi mini player. The mascot widget IS the button — click to play/pause a looping
 * background track. Bobs gently while playing so the state is legible. Audio only starts on a user
 * click (no autoplay-policy issues). Needs an audio file at /landing/audio/lofi.mp3.
 */
export function NowPlaying() {
  const reduce = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.volume = 0.5;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/landing/audio/lofi.mp3" loop preload="none" />
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
    </>
  );
}
