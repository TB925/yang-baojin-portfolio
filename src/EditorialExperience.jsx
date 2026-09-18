import React, { useEffect, useRef, useState } from 'react';
import CircularGallery from './CircularGallery';

const twoDigits = value => String(value).padStart(2, '0');
const brands = [
  { label: '福特', matches: project => project.client.includes('福特') },
  { label: '吉利', matches: project => project.client.includes('吉利') },
  { label: '领克', matches: project => project.client.includes('领克') },
];

export function ArchiveCollection({ projects, onOpen }) {
  const [brand, setBrand] = useState(0);
  const [selected, setSelected] = useState(0);
  const featureRef = useRef(null);
  const archiveRef = useRef(null);
  const collection = projects.filter(brands[brand].matches);
  const project = collection[selected] || collection[0];
  useEffect(() => {
    const element = archiveRef.current;
    let inView = false;
    const update = () => { element.dataset.active = inView && !document.hidden ? 'true' : 'false'; };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  function selectCase(index) {
    setSelected(index);
    if (window.matchMedia('(max-width: 760px)').matches) {
      featureRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }
  return <div className="archive-experience" ref={archiveRef} data-brand={brand}>
    <div className="archive-brand-tabs" aria-label="按品牌浏览其余项目">
      {brands.map((item, index) => <button type="button" key={item.label} aria-pressed={brand === index} aria-controls="archive-stage" onClick={() => { setBrand(index); setSelected(0); }}>
        <span className="archive-brand-name">{item.label}</span><sup>{twoDigits(projects.filter(item.matches).length)}</sup>
      </button>)}
    </div>
    <div className="archive-stage" id="archive-stage">
      <div className="archive-index">
        <p className="archive-index-label"><span>项目目录</span><span>{twoDigits(collection.length)} / {brands[brand].label}</span></p>
        {collection.map((item, index) => <button key={item.id} type="button" aria-pressed={project.id === item.id} aria-controls="archive-feature" onClick={() => selectCase(index)}>
          <span>{twoDigits(index + 1)}</span><span>{item.title}<small>{item.subtitle}</small></span><span aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className="archive-deck">
      <span className="archive-deck-label" aria-hidden="true">策划成册，现场成诗。 <span>✳</span></span>
      <article className="archive-feature" id="archive-feature" ref={featureRef} aria-live="polite" aria-atomic="true">
        <div className="archive-feature-inner" key={project.id}>
          <div className="archive-orbit" aria-hidden="true"><span /><span /><i /><b>✳</b></div>
          <div className="archive-feature-top"><span>{project.client} / 本人主导</span><span>{project.date.slice(0, 4)}</span></div>
          <span className="archive-case-number" aria-hidden="true">{project.periodMark}<i> / {twoDigits(projects.length)}</i></span>
          <div className="archive-feature-copy"><span className="overline">{project.type}</span><h3>{project.title}</h3><p className="archive-subtitle">{project.subtitle}</p><p className="archive-summary">{project.summary}</p></div>
          <div className="archive-feature-bottom"><span>{project.proposalFiles[0].pages}<small>页完整方案</small></span><button type="button" onClick={() => onOpen(project)} aria-label={`查看${project.title}：${project.subtitle}案例`}>打开这个故事 <span aria-hidden="true">↗</span></button></div>
        </div>
      </article>
      <div className="archive-pagination" aria-label="浏览当前品牌项目">
        <span><b>{twoDigits(selected + 1)}</b> / {twoDigits(collection.length)}<i aria-hidden="true" style={{ '--progress': `${((selected + 1) / collection.length) * 100}%` }} /></span>
        <div><button type="button" aria-label="上一个项目" onClick={() => setSelected((selected + collection.length - 1) % collection.length)}>←</button><button type="button" aria-label="下一个项目" onClick={() => setSelected((selected + 1) % collection.length)}>→</button></div>
      </div>
      </div>
    </div>
    <p className="archive-footnote"><span>活动整体统筹 / 方案文案撰写 / 线下执行 / 传播执行</span><span>选择品牌与项目，慢慢翻阅。</span></p>
  </div>;
}

function FullscreenPhoto({ photos, index, onSelect, onClose }) {
  const ref = useRef(null);
  const photo = photos[index];
  useEffect(() => { ref.current.showModal(); }, []);
  function move(delta) { onSelect((index + delta + photos.length) % photos.length); }
  return <dialog ref={ref} className="photo-lightbox" aria-label="现场照片大图" onClose={event => { event.stopPropagation(); onClose(); }} onCancel={event => { event.stopPropagation(); }} onClick={event => { if (event.target === event.currentTarget) ref.current.close(); }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="photo-lightbox-top"><span>SELECTED MOMENTS <span>{twoDigits(index + 1)} / {twoDigits(photos.length)}</span></span><button type="button" autoFocus aria-label="关闭照片大图" onClick={() => ref.current.close()}>关闭 <span aria-hidden="true">×</span></button></div>
    <div className="photo-lightbox-body"><button type="button" className="photo-nav" aria-label="上一张大图" onClick={() => move(-1)}>←</button><img key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} /><button type="button" className="photo-nav" aria-label="下一张大图" onClick={() => move(1)}>→</button></div>
    <p>{photo.caption || photo.alt}</p>
  </dialog>;
}

export function StoryGallery({ photos }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  if (!photos.length) return null;
  const photo = photos[index];
  const groupStart = Math.floor(index / 4) * 4;
  function move(delta) { setIndex(current => (current + delta + photos.length) % photos.length); }
  return <div className="story-gallery">
    <div className="story-gallery-stage">
      <CircularGallery items={photos} index={index} onSelect={setIndex} onOpen={() => setExpanded(true)} bend={0} textColor="#ffffff" borderRadius={0} scrollEase={0.05} scrollSpeed={1.5} />
      <div className="story-gallery-note"><span className="overline">IN THE MOMENT</span><div className="photo-count" aria-live="polite" aria-atomic="true">{twoDigits(index + 1)}<span> / {twoDigits(photos.length)}</span></div><p key={photo.src}>{photo.caption || photo.alt}</p><div className="photo-navigation"><button type="button" className="photo-nav" onClick={() => move(-1)} aria-label="上一张现场照片">←</button><button type="button" className="photo-nav" onClick={() => move(1)} aria-label="下一张现场照片">→</button></div></div>
    </div>
    <div className="photo-filmstrip" aria-label={`现场照片 ${groupStart + 1} 至 ${Math.min(groupStart + 4, photos.length)}`}>
      {photos.slice(groupStart, groupStart + 4).map((item, offset) => <button key={item.src} type="button" aria-label={`查看第 ${groupStart + offset + 1} 张现场照片：${item.alt}`} aria-pressed={index === groupStart + offset} onClick={() => setIndex(groupStart + offset)}><img src={item.src} srcSet={item.srcSet} sizes="(max-width: 760px) 85px, 200px" alt="" width={item.width} height={item.height} loading="lazy" /><span>{twoDigits(groupStart + offset + 1)}</span></button>)}
    </div>
    <div className="gallery-pagination"><span>{photos.length} 个瞬间，一段完整的现场记忆。</span><div aria-label="照片分组">{Array.from({ length: Math.ceil(photos.length / 4) }, (_, group) => <button type="button" key={group} aria-pressed={Math.floor(index / 4) === group} aria-label={`浏览现场照片 ${group * 4 + 1} 至 ${Math.min(group * 4 + 4, photos.length)}`} onClick={() => setIndex(group * 4)}>{twoDigits(group * 4 + 1)}—{twoDigits(Math.min(group * 4 + 4, photos.length))}</button>)}</div></div>
    {expanded && <FullscreenPhoto photos={photos} index={index} onSelect={setIndex} onClose={() => setExpanded(false)} />}
  </div>;
}

export function usePageMotion(ready) {
  useEffect(() => {
    if (!ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animations = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animations.push(entry.target.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
      observer.unobserve(entry.target);
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [ready]);
}
