import React, { useEffect, useRef, useState } from 'react';
import './case-videos.css';

export default function CaseVideos({ videos }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState({});
  useEffect(() => {
    const players = [...ref.current.querySelectorAll('video')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
    }, { threshold: 0 });
    players.forEach(player => observer.observe(player));
    const pauseWhenHidden = () => { if (document.hidden) players.forEach(player => player.pause()); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => { observer.disconnect(); players.forEach(player => player.pause()); document.removeEventListener('visibilitychange', pauseWhenHidden); };
  }, [videos]);

  return <section className="case-videos" aria-label="活动现场视频" ref={ref}>
    <div className="section-heading"><div><span className="overline">MOMENTS IN MOTION</span><h3>活动现场视频</h3></div><p>让现场，再发生一次。</p></div>
    <div className="case-video-grid">{videos.map((video, index) => <figure key={video.src}>
      <video controls playsInline preload="none" poster={video.poster} width={video.width} height={video.height} aria-label={video.title}
        onPlay={event => { ref.current.querySelectorAll('video').forEach(player => { if (player !== event.currentTarget) player.pause(); }); }}
        onError={() => setFailed(current => ({ ...current, [video.src]: true }))}>
        <source src={video.src} type="video/mp4" />
        你的浏览器暂不支持视频播放。
      </video>
      <figcaption><span className="case-video-number">0{index + 1}</span><span>{video.title}</span><small>{video.durationLabel} / {video.height}P</small></figcaption>
      {failed[video.src] && <p role="status" className="case-video-error">暂时无法播放，<a href={video.src} target="_blank" rel="noopener noreferrer">单独打开视频</a></p>}
    </figure>)}</div>
  </section>;
}
