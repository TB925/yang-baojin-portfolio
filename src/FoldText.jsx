import React, { Children, cloneElement, isValidElement, useLayoutEffect, useRef } from 'react';
import './fold-text.css';

// Fold motion adapted from React Bits FoldText (David Haz).
// Uses native animations and preserves the existing rich-text typography.
// Source and license: public/licenses/react-bits.txt.
function splitContent(children) {
  return Children.map(children, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return Array.from(String(child)).map((char, index) => /\s/.test(char) ? char :
        <span className="fold-segment" key={index}><span className="fold-piece">{char}<span className="fold-shade" aria-hidden="true" /></span></span>);
    }
    if (isValidElement(child) && child.props.children !== undefined) {
      return cloneElement(child, {}, splitContent(child.props.children));
    }
    return child;
  });
}

export default function FoldText({ as: Tag = 'span', children, ready = true, duration = 0.65, stagger = 0.045, perspective = 700, creaseShading = 0.55, ...props }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const pieces = [...ref.current.querySelectorAll('.fold-piece')];
    const animations = [];
    const clear = () => {
      animations.forEach(animation => animation.cancel());
      pieces.forEach(piece => { piece.style.opacity = ''; });
    };
    pieces.forEach(piece => { piece.style.opacity = '0'; });
    if (ready) {
      pieces.forEach((piece, index) => {
        const frames = Array.from({ length: 61 }, (_, step) => {
          const progress = step / 60;
          const eased = 1 - (1 - progress) ** 4;
          return { offset: progress, transform: `rotateX(${92 * (1 - eased)}deg)`, opacity: eased };
        });
        const timing = { duration: duration * 1000, delay: index * stagger * 1000, fill: 'both', easing: 'linear' };
        const unfold = piece.animate(frames, timing);
        const shade = piece.querySelector('.fold-shade').animate(frames.map(frame => ({ offset: frame.offset, opacity: creaseShading * (1 - frame.opacity) })), timing);
        animations.push(unfold, shade);
        unfold.onfinish = () => { piece.style.opacity = ''; unfold.cancel(); shade.cancel(); };
      });
    }
    const onMotionChange = event => { if (event.matches) clear(); };
    motion.addEventListener('change', onMotionChange);
    return () => { clear(); motion.removeEventListener('change', onMotionChange); };
  }, [ready, duration, stagger, creaseShading]);

  return <Tag {...props} ref={ref} style={{ ...props.style, '--fold-perspective': `${perspective}px` }}>{splitContent(children)}</Tag>;
}
