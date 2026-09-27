import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  /** Characters per second (default 30) */
  speed?: number;
  /** Delay in ms before typing starts (default 0) */
  delay?: number;
  /** Whether to skip animation and show text immediately */
  instant?: boolean;
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const { speed = 30, delay = 0, instant = false } = options;
  const [displayed, setDisplayed] = useState(instant ? text : '');
  const [done, setDone] = useState(instant);
  const frameRef = useRef<number>();
  const startRef = useRef<number | null>(null);
  const charInterval = 1000 / speed;

  useEffect(() => {
    if (instant) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);
    startRef.current = null;

    const delayTimer = setTimeout(() => {
      let index = 0;

      const tick = (timestamp: number) => {
        if (startRef.current === null) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const target = Math.floor(elapsed / charInterval);

        if (target > index) {
          index = Math.min(target, text.length);
          setDisplayed(text.slice(0, index));
        }

        if (index < text.length) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setDone(true);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, delay, instant, charInterval]);

  return { displayed, done };
}
