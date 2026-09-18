import React, { useEffect, useRef } from 'react';

function CapabilityVisual({ type }) {
  return <svg className={`capability-visual visual-${type}`} viewBox="0 0 132 72" fill="none" aria-hidden="true">
    {type === '01' && <>
      <circle className="visual-faint" cx="66" cy="36" r="29" /><circle className="visual-line" cx="66" cy="36" r="20" strokeDasharray="2 5" />
      <path className="visual-faint" d="M29 36h74M66 0v72" />
      <g className="compass-needle"><path d="m66 12 7 24-7 24-7-24Z" fill="#ed783a" fillOpacity=".18" /><path d="m66 12 7 24H59Z" fill="#ed783a" /><circle cx="66" cy="36" r="3" fill="#fff9eb" /></g>
      <g className="visual-orbit"><circle cx="66" cy="7" r="3" fill="#eaa34d" /></g>
    </>}
    {type === '02' && <>
      <g className="creative-orbits"><ellipse className="visual-line" cx="66" cy="36" rx="45" ry="17" transform="rotate(-25 66 36)" /><ellipse className="visual-faint" cx="66" cy="36" rx="45" ry="17" transform="rotate(40 66 36)" /><circle cx="105" cy="18" r="4" fill="#eab65d" /><circle cx="34" cy="10" r="2.5" fill="#ec8d6b" /></g>
      <g className="creative-spark"><path d="M66 21v30M51 36h30M55 25l22 22M55 47l22-22" stroke="#ea753d" strokeWidth="2" strokeLinecap="round" /><circle cx="66" cy="36" r="4" fill="#f3b45e" /></g>
    </>}
    {type === '03' && <>
      <path className="visual-faint" d="M17 55h98M25 51V34M64 51V24M103 51V12" />
      {[{x:25,y:34},{x:64,y:24},{x:103,y:12}].map((p,i)=><g key={p.x} className="execution-node" style={{'--node':i}}><rect x={p.x-10} y={p.y} width="20" height={55-p.y} rx="3" fill="#eeb264" fillOpacity=".22" /><circle cx={p.x} cy={p.y} r="5" fill="#ef9251" /><path d={`m${p.x-2} ${p.y} 1.5 1.5 3-3`} stroke="white" strokeWidth="1.3" strokeLinecap="round" /></g>)}
      <path className="execution-path" d="M25 34 64 24 103 12" stroke="#d18e51" strokeWidth="1.3" strokeDasharray="4 5" />
    </>}
    {type === '04' && <>
      <circle className="visual-faint" cx="66" cy="36" r="28" />
      <circle className="broadcast-ring" cx="66" cy="36" r="11" /><circle className="broadcast-ring ring-late" cx="66" cy="36" r="11" />
      <path className="visual-faint" d="m66 36 40-20M66 36l-40 20M66 36l33 25" />
      <circle cx="66" cy="36" r="7" fill="#ed8747" /><circle cx="106" cy="16" r="4" fill="#e9bb75" /><circle cx="26" cy="56" r="3" fill="#e8ac75" /><circle cx="99" cy="61" r="3" fill="#e6c991" />
    </>}
  </svg>;
}

export function CapabilityCard({ capability }) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  function followPointer(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.style.setProperty('--pointer-x', `${x}px`);
      card.style.setProperty('--pointer-y', `${y}px`);
    });
  }
  return <article className="expertise-card" data-reveal data-expertise-motion onPointerMove={followPointer} onPointerLeave={() => cancelAnimationFrame(frame.current)}>
    <div className="expertise-card-top"><span>{capability.number}</span><span>{capability.english}</span><CapabilityVisual type={capability.number} /></div>
    <h3>{capability.title}</h3><p>{capability.description}</p>
    <div className="expertise-tags">{capability.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
  </article>;
}

export function useExpertiseMotion() {
  const ref = useRef(null);
  useEffect(() => {
    const section = ref.current;
    const targets = section.querySelectorAll('[data-expertise-motion]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.dataset.motion = entry.isIntersecting ? 'on' : 'off';
    }), { threshold: .15 });
    targets.forEach(target => observer.observe(target));
    const updateVisibility = () => { section.dataset.visible = document.hidden ? 'off' : 'on'; };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  return ref;
}
