import { assetUrl } from './assetUrl.js';
import React, { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { automotiveCategories, capabilities, galleryPhotoLimit, plannedProjectCounts, profile, projects, secondaryCategories } from './content.js';
import OpeningScene, { shouldShowOpening } from './OpeningScene.jsx';
import AnimatedContent from './AnimatedContent';
import CountUp from './CountUp';
import FoldText from './FoldText';
import CaseVideos from './CaseVideos';
import { CapabilityCard, useExpertiseMotion } from './ExpertiseMotion';
import { ArchiveCollection, StoryGallery, usePageMotion } from './EditorialExperience.jsx';

const PdfReader = lazy(() => import('./PdfReader.jsx'));

export function Arrow({ diagonal = false, ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header wrap" id="home">
    <a className="brand" href="#home" aria-label="杨宝金，回到首页"><span className="brand-symbol">Y<span>·</span></span><span className="brand-name">杨宝金<span>IDEAS INTO EXPERIENCES</span></span></a>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? '关闭导航' : '打开导航'}>{menuOpen ? '关闭' : '菜单'}<span>{menuOpen ? '−' : '+'}</span></button>
    <nav id="main-nav" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航" onClick={() => setMenuOpen(false)}>
      <a href="#work">项目作品<span>Works</span></a><a href="#expertise">专业能力<span>Expertise</span></a><a href="#about">关于我<span>About</span></a><a className="nav-contact" href="#contact">聊聊你的想法 <Arrow diagonal /></a>
    </nav>
  </header>;
}

function Hero({ ready }) {
  return <section className="hero wrap" aria-labelledby="hero-title">
    <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
    <span className="coordinate coordinate-top" aria-hidden="true">+</span><span className="coordinate coordinate-bottom" aria-hidden="true">+</span>
    <AnimatedContent className="hero-copy" ready={ready} distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1} delay={0}>
      <div className="eyebrow"><span className="little-star">✳</span> STRATEGY. CREATIVITY. EXECUTION.</div>
      <FoldText as="h1" id="hero-title" ready={ready}>让好创意，<br />在<span className="hero-accent">真实现场</span>发生<span className="period">。</span></FoldText>
      <FoldText as="p" className="hero-intro" ready={ready}>你好，我是杨宝金。<br /><span className="hero-role">活动项目经理 <i>/</i> 活动策划</span></FoldText>
      <FoldText as="p" className="hero-description" ready={ready}>用策略找到方向，用创意连接人与品牌。<br />从最初的一页提案，到最后一个现场细节。</FoldText>
      <div className="hero-actions"><a className="button button-primary" href="#work">探索我的作品 <Arrow diagonal /></a><a className="text-link" href="#about">认识我 <span>↗</span></a></div>
      <div className="hero-tags"><span>汽车营销</span><span>地产营销</span><span>品牌体验</span></div>
    </AnimatedContent>
    <div className="hero-visual">
      <div className="visual-caption"><span>CREATIVE MIND.<br />HANDS-ON SPIRIT.</span><span className="caption-cross">+</span></div>
      <div className="portrait-halo" aria-hidden="true" />
      <img className="hero-portrait" src={assetUrl("/images/avatar.webp")} srcSet={assetUrl("/images/avatar-small.webp 360w, /images/avatar.webp 800w")} sizes="(max-width: 760px) 340px, 520px" width="800" height="1200" fetchPriority="high" alt="杨宝金的 AI 动画形象，背着双肩包的创意策划师" />
      <div className="glass-note note-idea"><span className="note-icon">✳</span><div>想法有温度<span>Ideas with feeling.</span></div></div>
      <div className="glass-note note-execution"><span className="execution-icon" aria-hidden="true"><span /><span /><span /></span><div>落地有章法<span>Details make it happen.</span></div></div>
      <span className="portrait-label">MY DIGITAL SELF <span>01 / YBJ</span></span>
    </div>
    <div className="hero-bottom"><a href="#work"><span>↓</span> 向下，走进我的策划现场</a><span>BASED IN CHENGDU · OPEN TO POSSIBILITIES</span></div>
  </section>;
}

function Experience({ ready }) {
  return <section className="experience wrap" aria-label="经历概览" data-reveal>
    <div className="experience-intro"><span className="overline">EXPERIENCE, IN NUMBERS</span><p>把每一次想象，<br />变成值得记住的现场。</p></div>
    {[ [6, '年汽车行业活动经验'], [100, '主导汽车活动'], [20, '参与车展主办方项目'] ].map(([value, label]) =>
      <div className="stat" key={label}><strong aria-label={`${value}+`}><CountUp from={0} to={value} separator="," direction="up" duration={2} className="count-up-text" delay={4} ready={ready} /><span className="stat-plus" aria-hidden="true">+</span></strong><span>{label}</span></div>
    )}
    <span className="experience-source">据个人简历</span>
  </section>;
}

function ProjectCover({ project, large = false }) {
  if (project.cover) return <img
    className={`project-cover-image${project.cover.fit === 'contain' ? ' preserve-cover' : ''}${large ? ' cover-large' : ''}`}
    src={project.cover.src} srcSet={project.cover.srcSet}
    sizes={large ? '(max-width: 760px) calc(100vw - 20px), 1020px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1820px) calc((100vw - 120px) * .58), 980px'}
    alt={project.cover.alt} width={project.cover.width || 1200} height={project.cover.height || 800} loading={large ? 'eager' : 'lazy'}
  />;
  return <span className={`project-cover cover-${project.theme}${large ? ' cover-large' : ''}`}>
    <span className="cover-topline"><span>{project.client}</span><span>CONCEPT / {project.date === '待核实' ? 'JOURNEY' : project.date}</span></span>
    <span className="cover-typography">{project.english.split('\n').map(line => <span key={line}>{line}</span>)}</span>
    <span className="cover-bottomline"><span>{project.subcategory || project.category} / 方案案例</span><span>封面素材待确认 <span aria-hidden="true">↗</span></span></span>
  </span>;
}

function ProjectCard({ project, onOpen, featured = false, index = 0 }) {
  const isArchive = project.kind === 'archive';
  if (project.kind === 'proposal' || isArchive) return <article className={`planning-card${isArchive ? ' archive-card' : ''}`}>
    <button className="planning-open" onClick={() => onOpen(project)} aria-label={`查看${project.title}：${project.subtitle}案例`}>
      <span className="planning-period" aria-hidden="true"><span>{project.periodYear}</span><strong>{project.periodMark}</strong></span>
      <span className="planning-copy"><span className="planning-kicker">{isArchive ? `${project.client} / 本人主导` : project.proposalLabel || 'REGIONAL MARKETING / 区域营销规划'}</span><span className="planning-title">{project.title}</span>{(project.category === '地产营销' || isArchive) && <span className="planning-subtitle">{project.subtitle}</span>}{!isArchive && <><span className="planning-summary">{project.summary}</span><span className="planning-tags">{project.tags.join(' / ')}</span></>}</span>
      <span className="planning-action"><span>{project.proposalFiles[0]?.pages} 页完整方案</span><span className="project-arrow"><Arrow diagonal /></span><span>{isArchive ? '查看方案' : project.category === '地产营销' ? '查看提案' : '查看规划'}</span></span>
    </button>
  </article>;
  return <article className={`project-card${featured ? ' featured-project-card' : ''}`} style={{ '--card-order': index }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`查看${project.title}：${project.subtitle}案例`}>
      <span className="project-visual"><span className="project-card-index"><span>SELECTED / {String(index + 1).padStart(2, '0')}</span><span>{project.subcategory}</span></span><ProjectCover project={project} /><span className="project-hover-label" aria-hidden="true">走进这个现场 ↗</span></span>
      <span className="project-card-info">
        {featured && <span className="project-category-label">汽车营销 / {project.subcategory}</span>}
        <span className="project-heading"><span className="project-title">{project.title}</span><span className="project-arrow"><Arrow diagonal /></span></span>
        <span className="project-subtitle">{project.subtitle}</span>
        <span className="project-summary">{project.summary}</span>
        <span className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
        {featured && <span className="project-read-more">查看项目故事 <Arrow /></span>}
      </span>
    </button>
  </article>;
}

function ProjectSlots({ title, total, filled }) {
  const remaining = Math.max(0, total - filled);
  if (!remaining) return null;
  return <div className="reserved-projects" aria-label={`${title}预留项目位置`}>
    {Array.from({ length: remaining }, (_, index) => <div className="reserved-project" key={index}>
      <span className="reserved-number">{String(filled + index + 1).padStart(2, '0')}</span>
      <span><span className="reserved-title">项目待补充</span><span className="reserved-status">完整方案待上传</span></span>
      <span className="reserved-plus" aria-hidden="true">＋</span>
    </div>)}
  </div>;
}

function Work({ onOpen }) {
  const [subcategory, setSubcategory] = useState(automotiveCategories[0]);
  const shown = projects.filter(project => project.category === '汽车营销' && project.subcategory === subcategory);
  const plannedTotal = Object.values(plannedProjectCounts).reduce((total, count) => total + count, 0);
  const completedTotal = projects.filter(project => project.proposalFiles.length).length;
  const automotiveTotal = automotiveCategories.reduce((total, category) => total + plannedProjectCounts[category], 0);
  const automotiveComplete = projects.filter(project => project.category === '汽车营销' && project.proposalFiles.length).length;
  const collectionComplete = shown.filter(project => project.proposalFiles.length).length === plannedProjectCounts[subcategory];
  return <div className="section work-section wrap" id="work">
    <section className="automotive-work" aria-labelledby="automotive-title">
      <div className="section-heading automotive-heading" data-reveal><div><span className="overline">01 / PROJECT STORIES — AUTOMOTIVE</span><h2 id="automotive-title">汽车营销<span className="heading-period">.</span></h2></div><p>从一段自驾旅程，到一场区域发布。<br />以创意连接产品、用户与品牌。</p></div>
      <div className="work-toolbar"><div className="category-list automotive-categories" aria-label="汽车营销子分类">{automotiveCategories.map((item, index) => <button key={item} type="button" aria-label={item} aria-pressed={item === subcategory} aria-controls="automotive-projects" onClick={() => setSubcategory(item)}><span className="category-number">0{index + 1}</span>{item}<sup aria-hidden="true">{plannedProjectCounts[item]}</sup></button>)}</div><span className="work-index">{automotiveComplete === automotiveTotal ? '已收录' : '计划收录'} {automotiveTotal} 个项目</span></div>
      <div id="automotive-projects" aria-label={`${subcategory}项目`} aria-live="polite" aria-atomic="true">
        <p className="collection-plan"><span>{subcategory}<span> / {collectionComplete ? '已收录' : '计划'} {plannedProjectCounts[subcategory]} 个项目</span></span><span>{subcategory === '区域营销方案' ? '线上客户提案 · 独立策划与撰写' : '每个项目附完整方案'}</span></p>
        {shown.length > 0 && <div key={subcategory} className={`project-grid automotive-projects${shown.length === 1 ? ' single-project' : ''}${subcategory === '区域营销方案' ? ' planning-projects' : ' editorial-projects'}`}>{shown.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={onOpen} featured={shown.length === 1} />)}</div>}
        <ProjectSlots title={subcategory} total={plannedProjectCounts[subcategory]} filled={shown.length} />
      </div>
    </section>
      {secondaryCategories.map(category => {
        const categoryProjects = projects.filter(project => project.category === category.title);
        const complete = categoryProjects.filter(project => project.proposalFiles.length).length === plannedProjectCounts[category.title];
        const archiveOnly = categoryProjects.length > 0 && categoryProjects.every(project => project.kind === 'archive');
        const documentsOnly = categoryProjects.length > 0 && categoryProjects.every(project => ['proposal', 'archive'].includes(project.kind));
        return <section className="secondary-category independent-collection" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
          <div className="secondary-heading" data-reveal><span className="overline">{category.english}</span><h2 id={`${category.id}-title`}>{category.title}<span className="planned-count">{complete ? '已收录' : '计划'} {plannedProjectCounts[category.title]} 个</span></h2>{documentsOnly && <p className="secondary-proposal-note">{archiveOnly ? '本人主导活动 · 完整方案展示' : '线上客户提案 · 完整方案展示'}</p>}</div>
          {archiveOnly ? <ArchiveCollection projects={categoryProjects} onOpen={onOpen} /> : <div className={`secondary-projects${documentsOnly ? ' secondary-proposals' : ''}`}>{categoryProjects.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}<ProjectSlots title={category.title} total={plannedProjectCounts[category.title]} filled={categoryProjects.length} /></div>}
        </section>;
      })}
    <p className="draft-note"><span>{completedTotal === plannedTotal ? '已收录' : '收录计划'} / {plannedTotal} 个项目</span> 每个项目展示完整方案，案例内容与视觉素材随资料逐项完善。</p>
  </div>;
}

function ProposalFiles({ files = [], onRead }) {
  const readableFiles = files.filter(file => file.format.toUpperCase() === 'PDF');
  return <section className="case-proposals" aria-label="完整方案">
    <div className="proposal-heading"><div><span className="overline">THE COMPLETE PROPOSAL</span><h3>完整方案</h3></div><span className="proposal-format">PDF</span></div>
    {readableFiles.length ? <div className="proposal-files">{readableFiles.map(file => <div className="proposal-file" key={file.src}>
      <div className="proposal-file-info"><span className="proposal-file-type">{file.format}</span><div><h4>{file.name}</h4><p>{[file.sizeLabel, file.pages ? `${file.pages} 页` : null].filter(Boolean).join(' · ') || '完整方案文件'}</p></div></div>
      <div className="proposal-actions"><button type="button" className="proposal-view" onClick={() => onRead(file)} aria-label={`查看完整方案：${file.name}`}>查看完整方案 <Arrow diagonal /></button></div>
    </div>)}</div> : <div className="proposal-pending"><span className="proposal-pending-mark" aria-hidden="true">＋</span><div><p>完整方案待上传</p><span>整份方案将在这里呈现。</span></div></div>}
  </section>;
}

function CaseDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const caseScrollRef = useRef(0);
  const [readingFile, setReadingFile] = useState(null);
  const isProposal = project.kind === 'proposal';
  const isArchive = project.kind === 'archive';
  const documentsOnly = isProposal || isArchive;
  const galleryPhotos = (project.media || []).filter(media => media.type !== 'video').slice(0, galleryPhotoLimit);
  const isRealEstate = project.category === '地产营销';
  const meta = isProposal
    ? [['品牌 / 客户', project.client], [project.dateLabel || '规划周期', project.date], [project.cityLabel || '覆盖区域', project.city], ['方案类型', project.type], ['我的角色', project.role], ['交付形式', '完整方案 · 线上客户提案']]
    : [['品牌 / 客户', project.client], [project.dateLabel, project.date], ['项目城市', project.city], ['活动类型', project.type], ['我的角色', project.role || '待补充个人分工'], isArchive ? ['项目状态', project.executionStatus] : [project.scaleLabel || '项目人数 / 规模', project.scale || '待确认实际规模']];
  const story = [
    ['01', isRealEstate ? '策划背景' : isProposal ? '规划背景' : '项目背景', project.background],
    ['02', isRealEstate ? '提案目标' : isProposal ? '规划目标' : '客户需求', project.need],
    ['03', isProposal && !isRealEstate ? '策略与内容' : '核心创意', project.idea],
    ['04', '我负责了什么', project.responsibilities || project.role || '此处将呈现我在提案、策划、协调和执行中的具体工作，待补充本人分工后更新。'],
    ...(!documentsOnly ? [['05', '最终落地效果', project.result || '此处将加入实际活动规模、现场反馈和成果证据；当前未以方案目标代替实际成果。']] : []),
  ];
  function openReader(file) {
    caseScrollRef.current = dialogRef.current.scrollTop;
    setReadingFile(file);
  }
  function closeReader() { setReadingFile(null); }
  function jumpTo(selector) {
    const target = dialogRef.current?.querySelector(selector);
    if (!target) return;
    const top = target.getBoundingClientRect().top - dialogRef.current.getBoundingClientRect().top + dialogRef.current.scrollTop - 85;
    dialogRef.current.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  useLayoutEffect(() => {
    if (!dialogRef.current) return;
    dialogRef.current.scrollTop = readingFile ? 0 : caseScrollRef.current;
    if (!readingFile && caseScrollRef.current) dialogRef.current.querySelector('.proposal-view')?.focus({ preventScroll: true });
  }, [readingFile]);
  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [project]);
  if (!project) return null;
  return <dialog className={`case-dialog${readingFile ? ' is-reading' : ''}`} ref={dialogRef} aria-labelledby={readingFile ? 'pdf-reader-title' : 'case-title'} onClose={onClose} onCancel={event => { if (readingFile) { event.preventDefault(); closeReader(); } }} onClick={event => { if (event.target === event.currentTarget) { if (readingFile) closeReader(); else dialogRef.current.close(); } }}>
    {readingFile ? <Suspense fallback={<div className="pdf-reader-loading"><button className="close-dialog" onClick={closeReader}>← 返回项目</button><h2 id="pdf-reader-title">{readingFile.name}</h2><p role="status">正在准备方案阅读器…</p></div>}><PdfReader file={readingFile} onBack={closeReader} /></Suspense> : <div className="case-shell"><div className="case-toolbar"><span>{project.category}{project.subcategory ? ` / ${project.subcategory}` : ''}</span><div className="case-jump-nav" aria-label="案例快捷浏览"><button type="button" onClick={() => jumpTo('.case-proposals')}>完整方案</button>{project.videos?.length > 0 && <button type="button" className="case-video-jump" onClick={() => jumpTo('.case-videos')}>现场视频</button>}{galleryPhotos.length > 0 && <button type="button" onClick={() => jumpTo('.case-gallery')}>现场影像 <span>{galleryPhotos.length}</span></button>}</div><button className="close-dialog" autoFocus onClick={() => dialogRef.current.close()} aria-label="关闭案例详情">关闭 <span aria-hidden="true">×</span></button></div>
      {!documentsOnly && <ProjectCover project={project} large />}
      <div className={`case-content${documentsOnly ? ' planning-case-content' : ''}`}><span className="overline">{documentsOnly ? project.proposalLabel || 'REGIONAL STRATEGY / 线上客户提案' : 'CONCEPT & EXPERIENCE'}</span><h2 id="case-title">{project.title}</h2><p className="case-subtitle">{project.subtitle}</p>
        {documentsOnly && <p className="planning-case-intro">{project.summary}</p>}
        <dl className="case-meta">{meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <ProposalFiles files={project.proposalFiles} onRead={openReader} />
        <div className="case-story">{story.map(([number, title, text]) => <section key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></section>)}</div>
        <div className="case-highlights"><span className="overline">CONCEPT HIGHLIGHTS / 方案亮点</span>{project.highlights.map((highlight, index) => <p key={highlight}><span>0{index + 1}</span>{highlight}</p>)}</div>
        {!documentsOnly && project.videos?.length > 0 && <CaseVideos videos={project.videos} />}
        {!documentsOnly && <section className="case-gallery" aria-label="活动精选照片"><div className="section-heading"><div><span className="overline">SELECTED MOMENTS</span><h3>活动现场精选</h3></div>{project.albumUrl && <a className="album-link" href={project.albumUrl} target="_blank" rel="noopener noreferrer">查看活动云相册 <Arrow diagonal /></a>}</div><StoryGallery photos={galleryPhotos} /></section>}
      </div>
      <div className="case-footer"><span>好的创意，值得被完整讲述。</span><button className="text-link" onClick={() => dialogRef.current.close()}>返回作品集 <Arrow /></button></div>
    </div>}
  </dialog>;
}

function Expertise() {
  const motionRef = useExpertiseMotion();
  return <section ref={motionRef} className="expertise-section" id="expertise" aria-labelledby="expertise-title"><div className="wrap section">
    <div className="section-heading"><div><span className="overline">02 / WHAT I BRING</span><h2 id="expertise-title">想得开，<span>也落得下来。</span></h2></div><p>策略与创意，是起点。<br />把每一环接好，才是项目管理的价值。</p></div>
    <div className="expertise-grid">{capabilities.map(capability => <CapabilityCard key={capability.number} capability={capability} />)}</div>
    <div className="expertise-process" data-expertise-motion><span className="process-label">HOW I WORK<span>从第一句沟通，到最后一次复盘</span></span><ol>{['理解需求', '形成创意', '统筹落地', '复盘沉淀'].map((step, index) => <li key={step} style={{'--step': index}}><span>0{index + 1}</span>{step}{index < 3 && <Arrow />}</li>)}</ol></div>
  </div></section>;
}

function About() {
  return <section className="section about-section wrap" id="about" aria-labelledby="about-title"><div className="about-portrait-panel" data-reveal><div className="about-portrait-top"><span>A LITTLE ABOUT ME</span><span>＋</span></div><img src={assetUrl("/images/avatar.webp")} srcSet={assetUrl("/images/avatar-small.webp 360w, /images/avatar.webp 800w")} sizes="(max-width: 760px) 300px, 420px" alt="杨宝金的 AI 动画形象" width="800" height="1200" loading="lazy" /><div className="about-portrait-bottom"><span>杨宝金<span>YANG BAOJIN</span></span><span className="about-location">CHENGDU, CHINA<br />活动项目经理 / 活动策划</span></div></div>
    <div className="about-copy" data-reveal><span className="overline">03 / THE PERSON BEHIND THE PLAN</span><h2 id="about-title">做有想法的策划，<br />做<span>靠得住的搭档。</span></h2><p>我是杨宝金，一名活动项目经理，也是一名活动策划。过去 6 年多，我持续参与汽车品牌活动，从区域营销规划、新车上市，到试驾体验、车主自驾与经销商活动。</p><p>我习惯把创意和执行放在一起思考：一个主题如何被体验，一份方案如何被推进，每一个现场细节如何被照顾。</p><p>汽车营销是我扎实的经验起点。也期待把对品牌、人与场景的理解，带入地产营销与更多品牌活动。</p><div className="about-signoff"><span>“</span><p>在有序的执行里，<br />给灵感留一点自由。</p><span className="signature">Baojin.</span></div></div>
    <div className="brand-experience"><span>过往服务品牌</span><div>{profile.brands.map(brand => <span key={brand}>{brand}</span>)}</div></div>
  </section>;
}

function Contact({ onOpen }) {
  return <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="wrap"><div className="contact-top"><span className="overline">NEXT / SOMETHING GOOD STARTS HERE</span><span className="contact-asterisk" aria-hidden="true">✳</span></div><div className="contact-main" data-reveal><div><h2 id="contact-title">下一个好现场，<br />从<span>一次交流</span>开始。</h2><p>关于活动创意、品牌体验，或一个值得尝试的新想法。</p></div><button className="contact-circle" onClick={onOpen} aria-label="查看联系信息"><Arrow diagonal width="34" height="34" /><span>LET’S TALK</span></button></div><div className="contact-bottom"><span>活动策划 / 项目统筹 / 品牌体验</span><span>成都 · 期待更多可能</span></div></div></section>;
}

function ContactDialog({ onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => { const el = dialogRef.current; el.showModal(); const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previousOverflow; }; }, []);
  return <dialog className="contact-dialog" ref={dialogRef} aria-labelledby="contact-dialog-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}><div className="contact-dialog-inner"><button className="close-dialog" onClick={() => dialogRef.current.close()} aria-label="关闭联系信息" autoFocus>关闭 <span>×</span></button><span className="overline">LET’S MAKE IT HAPPEN</span><h2 id="contact-dialog-title">期待与你交流。</h2>{profile.emailPlacementConfirmed ? <><p>从一个简单的想法开始，聊聊我们能一起做些什么。</p><a className="button button-primary" href={`mailto:${profile.email}`}>发送邮件 <Arrow diagonal /></a><p className="contact-email">{profile.email}</p></> : <><p>联系入口已预留。邮箱、电话或微信的展示方式，确认后会在这里更新。</p><span className="contact-pending">基础预览版 · 联系方式待确认</span></>}</div></dialog>;
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [openingVisible, setOpeningVisible] = useState(shouldShowOpening);
  usePageMotion(!openingVisible);
  const finishOpening = useCallback(() => setOpeningVisible(false), []);
  return <><div className="site-content" inert={openingVisible ? true : undefined}><a className="skip-link" href="#work">跳至项目作品</a><Header /><main><Hero ready={!openingVisible} /><Experience ready={!openingVisible} /><Work onOpen={setSelectedProject} /><Expertise /><About /><Contact onOpen={() => setContactOpen(true)} /></main>
    <footer className="site-footer wrap"><a className="footer-name" href="#home">Y<span>·</span> <span>杨宝金</span></a><p>STRATEGY WITH WARMTH. EXECUTION WITH CARE.</p><div className="footer-actions"><button className="opening-replay" onClick={() => setOpeningVisible(true)}>重播开场 ↗</button><a className="back-top" href="#home">回到顶部 ↑</a></div><div className="footer-baseline"><span>© {new Date().getFullYear()} YANG BAOJIN</span><span>个人作品集</span><span>IDEAS INTO EXPERIENCES</span></div></footer>
    {selectedProject && <CaseDialog project={selectedProject} onClose={() => setSelectedProject(null)} />}{contactOpen && <ContactDialog onClose={() => setContactOpen(false)} />}
    </div>{openingVisible && <OpeningScene onComplete={finishOpening} />}
  </>;
}
