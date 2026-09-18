import React, { useEffect, useRef, useState } from 'react';
import './opening-scene.css';

const SEEN_KEY = 'ybj-opening-seen';

export function shouldShowOpening() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.location.hash && window.location.hash !== '#home') return false;
  try { return sessionStorage.getItem(SEEN_KEY) !== 'yes'; } catch { return true; }
}

export default function OpeningScene({ onComplete }) {
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    skipRef.current?.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setTimeout(() => setLeaving(true), reduceMotion.matches ? 500 : 2800);
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); setLeaving(true); }
    };
    const onMotionChange = event => { if (event.matches) setLeaving(true); };
    window.addEventListener('keydown', onKeyDown);
    reduceMotion.addEventListener('change', onMotionChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      reduceMotion.removeEventListener('change', onMotionChange);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => {
      try { sessionStorage.setItem(SEEN_KEY, 'yes'); } catch { /* Storage may be unavailable in private browsing. */ }
      onComplete();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600);
    return () => window.clearTimeout(timer);
  }, [leaving, onComplete]);

  return <section className={`opening-scene${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-labelledby="opening-title" aria-describedby="opening-description">
    <div className="opening-topline"><span className="opening-signature">Y<span>·</span><small>YANG BAOJIN<br />CREATIVE PORTFOLIO</small></span><button ref={skipRef} className="opening-skip" onClick={() => setLeaving(true)}>跳过开场 <span aria-hidden="true">↗</span></button></div>
    <div className="opening-art" aria-hidden="true"><div className="opening-halo" /><div className="opening-orbit opening-orbit-outer" /><div className="opening-orbit opening-orbit-inner" /><div className="opening-glass" /><div className="opening-sphere" /><span className="opening-spark spark-one">+</span><span className="opening-spark spark-two">+</span><span className="opening-orbit-label">A LITTLE SPARK. A REAL EXPERIENCE.</span></div>
    <div className="opening-copy"><p className="opening-eyebrow"><span aria-hidden="true">✳</span> EVERY EXPERIENCE STARTS WITH AN IDEA</p><h1 id="opening-title"><span>让好创意，</span><span>在此<span className="opening-emphasis">发生。</span></span></h1><p id="opening-description">杨宝金 <span>/</span> 活动策划与项目管理</p></div>
    <div className="opening-bottomline"><span>STRATEGY <i>·</i> CREATIVITY <i>·</i> EXECUTION</span><span className="opening-entering">走进我的策划现场 <span aria-hidden="true">↓</span></span></div>
  </section>;
}
