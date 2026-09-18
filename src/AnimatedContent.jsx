import React, { useLayoutEffect, useRef } from 'react';

// Native animation implementation of the supplied AnimatedContent API.
export default function AnimatedContent({
  children, className, distance = 100, direction = 'vertical', reverse = false,
  duration = 0.8, ease = 'power3.out', initialOpacity = 0,
  animateOpacity = true, scale = 1, threshold = 0.1, delay = 0, ready = true,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    let observer;
    const reveal = () => {
      observer?.disconnect();
      animation?.cancel();
      element.style.opacity = '';
    };

    if (motion.matches) return;
    if (animateOpacity) element.style.opacity = String(initialOpacity);

    if (ready) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= threshold)) return;
        observer.disconnect();
        const offset = reverse ? -distance : distance;
        // power3.out is quartic ease-out. Sample it for the native animation API.
        const keyframes = Array.from({ length: 61 }, (_, index) => {
          const progress = index / 60;
          const eased = ease === 'power3.out' ? 1 - (1 - progress) ** 4 : progress;
          return {
            offset: progress,
            transform: `translate${direction === 'horizontal' ? 'X' : 'Y'}(${offset * (1 - eased)}px) scale(${scale + (1 - scale) * eased})`,
            ...(animateOpacity ? { opacity: initialOpacity + (1 - initialOpacity) * eased } : {}),
          };
        });
        animation = element.animate(keyframes, {
          duration: duration * 1000, delay: delay * 1000,
          easing: ease === 'power3.out' ? 'linear' : ease, fill: 'both',
        });
        animation.onfinish = reveal;
      }, { threshold });
      observer.observe(element);
    }

    const onMotionChange = event => { if (event.matches) reveal(); };
    motion.addEventListener('change', onMotionChange);
    // Keyboard navigation must never land on invisible links.
    element.addEventListener('focusin', reveal);
    return () => {
      reveal();
      motion.removeEventListener('change', onMotionChange);
      element.removeEventListener('focusin', reveal);
    };
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, threshold, delay, ready]);

  return <div ref={ref} className={className}>{children}</div>;
}
