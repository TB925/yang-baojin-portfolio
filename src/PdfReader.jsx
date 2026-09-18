import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import './pdf-reader.css';
import { assetUrl } from './assetUrl.js';

GlobalWorkerOptions.workerSrc = workerUrl;

function PdfPage({ pdf, pageNumber, ratio, width, total }) {
  const frameRef = useRef(null);
  const canvasHostRef = useRef(null);
  const [nearby, setNearby] = useState(false);
  const [status, setStatus] = useState('waiting');
  const [pageText, setPageText] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), {
      root: frameRef.current.closest('.pdf-stage'), rootMargin: '1400px 0px',
    });
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearby || !width) return;
    let active = true;
    let renderTask;
    let canvas;
    setStatus('loading');
    const render = async () => {
      const page = await pdf.getPage(pageNumber);
      if (!active) return;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / base.width });
      const density = Math.min(window.devicePixelRatio || 1, 2, 3200 / Math.max(viewport.width, viewport.height));
      canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width * density);
      canvas.height = Math.floor(viewport.height * density);
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', `完整方案第 ${pageNumber} 页，共 ${total} 页`);
      renderTask = page.render({
        canvasContext: canvas.getContext('2d'), viewport,
        transform: density === 1 ? null : [density, 0, 0, density, 0, 0],
      });
      await renderTask.promise;
      if (!active) return;
      canvasHostRef.current.replaceChildren(canvas);
      setStatus('ready');
      const text = await page.getTextContent();
      if (active) setPageText(text.items.map(item => item.str || '').join(' '));
    };
    render().catch(reason => {
      if (active && reason?.name !== 'RenderingCancelledException') setStatus('error');
    });
    return () => {
      active = false;
      renderTask?.cancel();
      // Release distant bitmaps while keeping each page's exact layout height.
      if (canvas) { canvas.remove(); canvas.width = 0; canvas.height = 0; }
    };
  }, [pdf, nearby, width, pageNumber, total, attempt]);

  return <figure className="pdf-page" aria-label={`方案第 ${pageNumber} 页`}>
    <div className="pdf-page-frame" ref={frameRef} style={{ aspectRatio: ratio }} data-page={pageNumber} aria-busy={nearby && status === 'loading'}>
      <div className="pdf-canvas-host" ref={canvasHostRef} />
      {nearby && status !== 'ready' && <div className="pdf-page-placeholder">
        {status === 'error' ? <><span>这一页暂时未能显示</span><button type="button" onClick={() => setAttempt(value => value + 1)}>重新加载</button></> : <span>正在显示第 {pageNumber} 页…</span>}
      </div>}
      <p className="pdf-accessible-text">{pageText}</p>
    </div>
    <figcaption>{String(pageNumber).padStart(2, '0')} <span>/ {total}</span></figcaption>
  </figure>;
}

export default function PdfReader({ file, onBack }) {
  const [document, setDocument] = useState(null);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const pagesRef = useRef(null);

  useEffect(() => {
    let active = true;
    setDocument(null);
    setProgress(0);
    setError('');
    const task = getDocument({
      url: file.src,
      cMapUrl: assetUrl('/pdfjs/cmaps/'), cMapPacked: true,
      standardFontDataUrl: assetUrl('/pdfjs/standard_fonts/'), wasmUrl: assetUrl('/pdfjs/wasm/'),
    });
    task.onProgress = ({ loaded, total }) => {
      if (active && total) setProgress(Math.min(100, Math.round(loaded / total * 100)));
    };
    task.promise.then(async pdf => {
      // Reserve every page's actual dimensions before drawing any bitmap.
      // Nearby pages can then load and unload without moving the reading position.
      const ratios = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1 });
        return viewport.width / viewport.height;
      }));
      if (active) setDocument({ pdf, ratios });
    }).catch(() => {
      if (active) setError('方案暂时未能加载，请重试。');
    });
    return () => { active = false; void task.destroy().catch(() => {}); };
  }, [file.src, attempt]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(pagesRef.current);
    return () => observer.disconnect();
  }, []);

  return <div className="pdf-reader">
    <header className="pdf-reader-header">
      <button type="button" className="pdf-back" onClick={onBack} autoFocus>← 返回项目</button>
      <h2 id="pdf-reader-title">{file.name}</h2>
    </header>
    <div className="pdf-controls" aria-label="方案阅读控制">
      <span className="pdf-continuous-label">连续阅读 <span>· 共 {document?.pdf.numPages || file.pages || '—'} 页</span></span>
      <div className="pdf-zoom" aria-label="缩放控制">
        <button type="button" aria-label="缩小方案" disabled={!document || zoom <= .5} onClick={() => setZoom(value => Math.max(.5, value - .25))}>−</button>
        <button type="button" aria-label="适合宽度" disabled={!document} onClick={() => setZoom(1)}>{zoom === 1 ? '适合宽度' : `${Math.round(zoom * 100)}%`}</button>
        <button type="button" aria-label="放大方案" disabled={!document || zoom >= 2} onClick={() => setZoom(value => Math.min(2, value + .25))}>＋</button>
      </div>
    </div>
    <div className="pdf-stage" role="region" aria-label="方案连续阅读区" tabIndex="0">
      <div className="pdf-pages" ref={pagesRef} style={{ width: `${zoom * 100}%` }}>
        {document ? document.ratios.map((ratio, index) => <PdfPage key={index} pdf={document.pdf} pageNumber={index + 1} ratio={ratio} width={width} total={document.pdf.numPages} />)
          : <div className="pdf-loading" role="status"><span>{error || `正在加载完整方案${progress ? ` · ${progress}%` : '…'}`}</span>{error && <button type="button" onClick={() => setAttempt(value => value + 1)}>重新加载</button>}</div>}
      </div>
      {document && <p className="pdf-end">完整方案 · 共 {document.pdf.numPages} 页</p>}
    </div>
  </div>;
}
