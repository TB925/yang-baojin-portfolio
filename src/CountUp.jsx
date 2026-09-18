import React, { useLayoutEffect, useRef } from 'react';

export default function CountUp({ from = 0, to = 100, separator = ',', direction = 'up', duration = 1, className = '', delay = 0, ready = true }) {
  const ref = useRef(null);
  const format = value => Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  useLayoutEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = direction === 'down' ? to : from;
    const end = direction === 'down' ? from : to;
    const write = value => { element.textContent = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator); };
    let frame;
    let observer;
    const finish = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      write(end);
    };
    write(motion.matches ? end : start);

    if (ready && !motion.matches) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
        observer.disconnect();
        const started = performance.now() + Math.max(0, delay) * 1000;
        const tick = now => {
          const progress = duration <= 0 ? 1 : Math.min(1, Math.max(0, (now - started) / (duration * 1000)));
          write(start + (end - start) * (1 - (1 - progress) ** 3));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else finish();
        };
        frame = requestAnimationFrame(tick);
      }, { threshold: 0.5 });
      observer.observe(element);
    }

    const onMotionChange = event => { if (event.matches) finish(); };
    motion.addEventListener('change', onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      motion.removeEventListener('change', onMotionChange);
    };
  }, [from, to, separator, direction, duration, delay, ready]);

  return <span ref={ref} className={className} aria-hidden="true" style={{ display: 'inline-block', minWidth: `${Math.max(format(from).length, format(to).length)}ch`, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{format(direction === 'down' ? from : to)}</span>;
}
