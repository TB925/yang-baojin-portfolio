import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './click-spark.css';

// Adapted from React Bits ClickSpark by David Haz (MIT + Commons Clause).
// Source and license: public/licenses/react-bits.txt.
export default function ClickSpark({
  sparkColor = '#fff', sparkSize = 10, sparkRadius = 15,
  sparkCount = 8, duration = 400, easing = 'ease-out', extraScale = 1,
  children,
}) {
  const boundaryRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let sparks = [];
    let frame = null;
    let width = 0;
    let height = 0;

    function clear() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      sparks = [];
      context.clearRect(0, 0, width, height);
      if (typeof canvas.hidePopover === 'function' && canvas.matches(':popover-open')) canvas.hidePopover();
      canvas.classList.remove('is-sparking');
    }

    function resize() {
      clear();
      width = window.innerWidth;
      height = window.innerHeight;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
    }

    function ease(progress) {
      if (easing === 'linear') return progress;
      if (easing === 'ease-in') return progress * progress;
      if (easing === 'ease-in-out') return progress < .5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      return progress * (2 - progress);
    }

    function draw(timestamp) {
      context.clearRect(0, 0, width, height);
      sparks = sparks.filter(spark => timestamp - spark.started < duration);
      context.strokeStyle = sparkColor;
      context.lineWidth = 2;
      context.lineCap = 'round';
      for (const spark of sparks) {
        const progress = ease(Math.min(1, Math.max(0, (timestamp - spark.started) / duration)));
        const distance = progress * sparkRadius * extraScale;
        const length = sparkSize * (1 - progress);
        const cosine = Math.cos(spark.angle);
        const sine = Math.sin(spark.angle);
        context.beginPath();
        context.moveTo(spark.x + distance * cosine, spark.y + distance * sine);
        context.lineTo(spark.x + (distance + length) * cosine, spark.y + (distance + length) * sine);
        context.stroke();
      }
      if (sparks.length) frame = requestAnimationFrame(draw);
      else clear();
    }

    function click(event) {
      // Keep keyboard activation, reduced-motion mode and ordinary scrolling quiet.
      if (reducedMotion.matches || event.detail === 0 || event.button !== 0 || !boundaryRef.current?.contains(event.target)) return;
      if (duration <= 0 || sparkCount <= 0) return;
      const started = performance.now();
      const count = Math.max(1, Math.floor(sparkCount));
      sparks.push(...Array.from({ length: count }, (_, index) => ({
        x: event.clientX, y: event.clientY, angle: 2 * Math.PI * index / count, started,
      })));
      sparks = sparks.slice(-180);
      // The top layer also covers the native project, photo and PDF dialogs.
      if (typeof canvas.showPopover === 'function') {
        if (canvas.matches(':popover-open')) canvas.hidePopover();
        canvas.showPopover();
      } else canvas.classList.add('is-sparking');
      if (frame === null) frame = requestAnimationFrame(draw);
    }

    function visibilityChange() { if (document.hidden) clear(); }
    resize();
    window.addEventListener('click', click, true);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', clear, { passive: true, capture: true });
    document.addEventListener('visibilitychange', visibilityChange);
    reducedMotion.addEventListener('change', clear);
    return () => {
      clear();
      window.removeEventListener('click', click, true);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', clear, true);
      document.removeEventListener('visibilitychange', visibilityChange);
      reducedMotion.removeEventListener('change', clear);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return <><div ref={boundaryRef} className="click-spark-boundary">{children}</div>{createPortal(
    <canvas ref={canvasRef} className="click-spark-canvas" popover="manual" aria-hidden="true" />,
    document.body,
  )}</>;
}
