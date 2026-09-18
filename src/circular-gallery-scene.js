import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';

// CircularGallery's looping planes and velocity-driven wave, adapted from React Bits.
// Full source attribution is in public/licenses/react-bits.txt.
const vertex = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uSpeed;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Keep the image edges fixed and let the surface flex only while moving.
    p.z = (sin(p.x * 4.0 + uTime) + cos(p.y * 2.0 + uTime))
      * uSpeed * 0.12 * sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uImageSize;
  uniform vec2 uBoxSize;
  uniform float uRadius;
  varying vec2 vUv;
  void main() {
    float boxAspect = uBoxSize.x / uBoxSize.y;
    float imageAspect = uImageSize.x / uImageSize.y;
    vec2 fit = vec2(max(boxAspect / imageAspect, 1.0), max(imageAspect / boxAspect, 1.0));
    vec2 sampleUv = (vUv - 0.5) * fit + 0.5;
    vec4 color = vec4(0.92549, 0.92157, 0.89412, 1.0);
    if (sampleUv.x >= 0.0 && sampleUv.x <= 1.0 && sampleUv.y >= 0.0 && sampleUv.y <= 1.0) {
      color = texture2D(tMap, sampleUv);
    }
    vec2 d = abs(vUv - 0.5) - vec2(0.5 - uRadius);
    float edge = length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - uRadius;
    gl_FragColor = vec4(color.rgb, color.a * (1.0 - smoothstep(-0.002, 0.0, edge)));
  }
`;

export function createGallery(root, items, options) {
  const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(devicePixelRatio || 1, 2), powerPreference: 'low-power' });
  const gl = renderer.gl;
  const canvas = gl.canvas;
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);
  const camera = new Camera(gl, { fov: 45 });
  camera.position.z = 20;
  const scene = new Transform();
  const geometry = new Plane(gl, { widthSegments: 32, heightSegments: 20 });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const count = items.length;
  let current = options.index;
  let target = current;
  let reported = options.index;
  let width = 1, height = 1, viewWidth = 1, viewHeight = 1, stride = 1;
  let visible = true, destroyed = false, raf = 0, previousTime = 0, snapTimer;
  let gesture = null;
  const mod = value => ((value % count) + count) % count;

  const media = items.map(photo => {
    const texture = new Texture(gl, { generateMipmaps: false });
    const program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false, depthWrite: false, cullFace: null,
      uniforms: { tMap: { value: texture }, uImageSize: { value: [photo.width, photo.height] }, uBoxSize: { value: [1, 1] }, uRadius: { value: options.borderRadius }, uSpeed: { value: 0 }, uTime: { value: 0 } },
    });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
    mesh.visible = false;
    return { photo, texture, program, mesh, loaded: false, loading: false, image: null };
  });

  function load(index) {
    const item = media[mod(index)];
    if (item.loading) return;
    item.loading = true;
    const image = new Image();
    item.image = image;
    image.onload = () => {
      if (destroyed) return;
      item.texture.image = image;
      item.program.uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight];
      item.loaded = true;
      wake();
    };
    image.onerror = () => { item.loading = false; root.classList.remove('is-rendered'); };
    image.src = width <= 420 && item.photo.srcSet ? item.photo.srcSet.split(',')[0].trim().split(' ')[0] : item.photo.src;
  }
  function wake() { if (!destroyed && visible && !raf) raf = requestAnimationFrame(draw); }
  function draw(now) {
    raf = 0;
    const elapsed = previousTime ? Math.min(64, now - previousTime) : 16.667;
    previousTime = now;
    const old = current;
    current = motion.matches ? target : current + (target - current) * (1 - (1 - options.scrollEase) ** (elapsed / 16.667));
    if (Math.abs(target - current) < 0.0005) current = target;
    const speed = (current - old) * stride;
    const nearest = Math.round(current);
    load(nearest); load(nearest - 1); load(nearest + 1);
    const active = mod(nearest);
    if (!gesture && current === target && active !== reported) { reported = active; options.onSelect(active); }
    root.classList.toggle('is-rendered', media[active].loaded);
    media.forEach((item, index) => {
      let offset = mod(index - current + count / 2) - count / 2;
      item.mesh.visible = item.loaded && Math.abs(offset) < 1.6;
      item.mesh.position.x = offset * stride;
      item.mesh.position.y = options.bend ? -Math.abs(options.bend) * offset * offset : 0;
      item.program.uniforms.uSpeed.value = motion.matches ? 0 : Math.max(-1, Math.min(1, speed));
      item.program.uniforms.uTime.value = now * 0.001;
    });
    renderer.render({ scene, camera });
    if (current !== target || Math.abs(speed) > 0.0001) wake();
    else previousTime = 0;
  }
  function resize() {
    width = Math.max(1, root.clientWidth); height = Math.max(1, root.clientHeight);
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    viewHeight = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z;
    viewWidth = viewHeight * camera.aspect;
    stride = viewWidth * (1 + 18 / width);
    media.forEach(item => { item.mesh.scale.set(viewWidth, viewHeight, 1); item.program.uniforms.uBoxSize.value = [width, height]; });
    wake();
  }
  function snap() { target = Math.round(target); wake(); }
  function down(event) {
    if (event.button !== 0 || event.target.closest('button')) return;
    gesture = { x: event.clientX, y: event.clientY, position: current, moved: false, id: event.pointerId };
  }
  function move(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { gesture = null; return; }
    if (Math.abs(dx) < 6 && !gesture.moved) return;
    gesture.moved = true;
    root.setPointerCapture(event.pointerId);
    root.classList.add('is-dragging');
    target = gesture.position - dx / (width + 18) * options.scrollSpeed;
    wake();
  }
  function up(event) {
    if (!gesture) return;
    const moved = gesture.moved;
    gesture = null;
    root.classList.remove('is-dragging');
    if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    if (moved) snap();
    else if (event.type !== 'pointercancel') options.onOpen();
  }
  function wheel(event) {
    if (event.ctrlKey || event.target.closest('button')) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    target += Math.max(-width, Math.min(width, delta * unit)) / width * options.scrollSpeed;
    clearTimeout(snapTimer);
    snapTimer = setTimeout(snap, 200);
    wake();
  }
  function visibility() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake(); }
  function lost(event) { event.preventDefault(); visible = false; cancelAnimationFrame(raf); raf = 0; root.classList.remove('is-rendered'); }
  function onMotionChange() { if (motion.matches) { target = Math.round(target); wake(); } }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('wheel', wheel, { passive: false });
  canvas.addEventListener('webglcontextlost', lost);
  document.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', onMotionChange);
  resize();

  return {
    select(index) {
      if (index === reported) return;
      clearTimeout(snapTimer);
      let distance = mod(index - mod(target) + count / 2) - count / 2;
      target += distance;
      wake();
    },
    setVisible(value) { visible = value; if (value) wake(); else { cancelAnimationFrame(raf); raf = 0; previousTime = 0; } },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf); clearTimeout(snapTimer); resizeObserver.disconnect();
      root.removeEventListener('pointerdown', down); root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', up); root.removeEventListener('pointercancel', up); root.removeEventListener('wheel', wheel);
      canvas.removeEventListener('webglcontextlost', lost); document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', onMotionChange);
      media.forEach(item => { if (item.image) { item.image.onload = null; item.image.onerror = null; } item.program.remove(); gl.deleteTexture(item.texture.texture); });
      geometry.remove(); gl.getExtension('WEBGL_lose_context')?.loseContext(); canvas.remove();
      root.classList.remove('is-rendered', 'is-dragging');
    },
  };
}
