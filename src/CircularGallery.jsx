import React, { useEffect, useRef } from 'react';
import './circular-gallery.css';

// React Bits CircularGallery motion, adapted for fixed-size, uncropped case photos.
// Reference and license: public/licenses/react-bits.txt.
export default function CircularGallery({ items, index, onSelect, onOpen, bend = 0, borderRadius = 0.05, scrollEase = 0.05, scrollSpeed = 1.5, textColor = '#ffffff' }) {
  const ref = useRef(null);
  const scene = useRef(null);
  const callbacks = useRef({ onSelect, onOpen, index });
  callbacks.current = { onSelect, onOpen, index };

  useEffect(() => {
    const root = ref.current;
    let alive = true;
    let starting = false;
    let visible = false;
    const observer = new IntersectionObserver(async entries => {
      visible = entries[0].isIntersecting;
      scene.current?.setVisible(visible);
      if (!visible || starting) return;
      starting = true;
      try {
        const { createGallery } = await import('./circular-gallery-scene.js');
        if (!alive) return;
        scene.current = createGallery(root, items, {
          index: callbacks.current.index, bend, borderRadius, scrollEase, scrollSpeed,
          onSelect: value => callbacks.current.onSelect(value),
          onOpen: () => callbacks.current.onOpen(),
        });
        scene.current.setVisible(visible);
      } catch {
        // Keep the original image and existing navigation available without WebGL.
        root.classList.remove('is-rendered');
      }
    }, { threshold: 0.01 });
    observer.observe(root);
    return () => { alive = false; observer.disconnect(); scene.current?.destroy(); scene.current = null; };
  }, [items, bend, borderRadius, scrollEase, scrollSpeed]);

  useEffect(() => { scene.current?.select(index); }, [index]);
  const photo = items[index];
  return <div className="story-photo circular-gallery" ref={ref} role="region" tabIndex={0} aria-label="活动现场循环画廊，可左右拖动、滚动或使用左右方向键切换照片" style={{ '--gallery-label-color': textColor }} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); event.stopPropagation();
      onSelect((index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length);
    }
  }}>
    <img className="circular-gallery-fallback" src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 760px) calc(100vw - 64px), 780px" alt={photo.alt} width={photo.width} height={photo.height} decoding="async" />
    <span className="gallery-drag-hint" aria-hidden="true">↔ 拖动浏览</span>
    <button type="button" className="photo-enlarge" onClick={onOpen} aria-label={`放大第 ${index + 1} 张现场照片`}>查看大图 <span aria-hidden="true">⤢</span></button>
  </div>;
}
