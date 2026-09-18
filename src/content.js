import { automotiveProjects } from './automotiveProjects.js';
import { realEstateProjects } from './realEstateProjects.js';
import { otherProjects } from './otherProjects.js';
import { projectPhotos } from './projectPhotos.js';
import { resolveProjectAssets } from './assetUrl.js';

// 所有可维护内容集中在此。项目按资料分类暂排，不代表最终精选顺序。
// 未确认的个人职责、执行日期、规模与成果必须保留 null，不以方案目标代替成果。
export const profile = {
  name: '杨宝金',
  city: '成都',
  title: '活动项目经理 / 活动策划',
  email: '1757372225@qq.com',
  phone: '13061466935',
  brands: ['长安福特', '吉利汽车', '东风日产', '领克汽车', '广汽传祺'],
};

export const automotiveCategories = ['自驾游', '区域上市会', '区域营销方案', '保客活动'];
// 用户确认的最终收录计划，不等同于当前已上传或已完成的案例数。
export const plannedProjectCounts = {
  '自驾游': 3,
  '区域上市会': 2,
  '区域营销方案': 4,
  '保客活动': 2,
  '地产营销': 2,
  '其余项目展示': 9,
};
export const secondaryCategories = [
  { id: 'real-estate', title: '地产营销', english: 'REAL ESTATE MARKETING' },
  { id: 'other-projects', title: '其余项目展示', english: 'OTHER PROJECTS' },
];

export const projects = [
  {
    id: 'jiangbulake', category: '汽车营销', subcategory: '自驾游', theme: 'journey', english: 'EXPLORE\nWITH PURPOSE.',
    title: '福探长 北疆行', subtitle: '福探长行动 · 北疆野生动物保护之旅', client: '长安福特新能源',
    date: '2024.07.13—14', dateLabel: '方案活动日期', city: '乌鲁木齐 / 吉木萨尔 / 江布拉克', type: '车主自驾 · 自然探索 · 公益体验',
    role: '活动整体统筹 / 方案文案撰写 / 线下执行 / 传播执行',
    responsibilities: '负责整个活动的统筹与方案文案撰写，并推进线下执行和传播执行，将策划内容衔接到活动现场与传播环节。',
    scale: '预计约 50 人（含工作人员）', scaleLabel: '方案预计规模', actualDate: null, result: null,
    tags: ['车主自驾', '野生动物保护', '全流程统筹'],
    summary: '让探索走向自然，也让品牌与车主走得更近。',
    background: '围绕福探长行动的探索主题，以北疆夏季自驾为场景，将车主出游、产品体验与野生动物保护内容融入同一段旅程。',
    need: '方案围绕车主关系与品牌体验展开：用真实行程承载车辆体验，用公益主题增加参与感，并让旅途中的内容持续进入传播。',
    idea: '以“心怀敬畏地探索，肩负担当地远行”为线索，串联乌鲁木齐集结、吉木萨尔野狼谷体验与江布拉克自驾，将发车仪式、野生动物保护课堂和沿途体验组织为两天的主题旅程。',
    highlights: ['自然探索与野生动物保护主题相结合', '发车集结、公益课堂与自驾体验串联', '车主视角与 KOL 内容协同，覆盖活动前中后传播'],
    source: '【最终活动方案 0705d5】“福探长们的江布拉克”——福探长行动·野生动物保护之旅.pdf',
    sourceNote: '项目内容据完整方案整理，个人职责由本人确认。日期与人数为方案安排，实际举办日期、参与人数及成果待补充。',
    cover: {
      src: '/images/jiangbulake/kv-1600.webp',
      srcSet: '/images/jiangbulake/kv-800.webp 800w, /images/jiangbulake/kv-1600.webp 1600w',
      alt: '福探长北疆行活动主 KV：北疆山野、橙色福特探险者与野生动物保护之旅主题',
      width: 1600, height: 899, fit: 'contain',
    },
    albumUrl: 'https://m.alltuu.com/album/4408f78fc69d4bc68ea1d81dd5293dce?from=appmessage&menu=live',
    videos: [
      { src: '/videos/jiangbulake/film-01.mp4', poster: '/videos/jiangbulake/film-01-poster.jpg', title: '北疆行 · 现场影像 01', width: 1920, height: 1080, durationLabel: '01:00' },
      { src: '/videos/jiangbulake/film-02.mp4', poster: '/videos/jiangbulake/film-02-poster.jpg', title: '北疆行 · 现场影像 02', width: 1920, height: 1080, durationLabel: '01:00' },
    ],
    media: [],
    proposalFiles: [{
      src: '/proposals/jiangbulake/complete-proposal.pdf',
      name: '福探长 北疆行 · 完整活动方案',
      format: 'PDF', sizeLabel: '14.8 MB', pages: 34,
      downloadName: '【最终活动方案 0705d5】“福探长们的江布拉克”——福探长行动·野生动物保护之旅.pdf',
    }],
  },
  {
    id: 'dunhuang', category: '汽车营销', subcategory: '自驾游', theme: 'desert', english: 'ACROSS\nTHE DUNES.',
    title: '敢问路在何方 共赴心中昆仑', subtitle: '福探长行动·探大漠风沙种公益新绿', client: '长安福特',
    date: '2025.08.16—17', dateLabel: '方案活动日期', city: '嘉峪关 / 瓜州 / 敦煌（方案路线）', type: '车主自驾 · 文化探索 · 防沙公益',
    role: '活动整体统筹 / 方案文案撰写 / 线下执行 / 传播执行',
    responsibilities: '负责整个活动的统筹与方案文案撰写，并推进线下执行和传播执行，将路线、体验环节与传播内容衔接起来。',
    scale: '预计约 65 人（含工作人员） / 20 辆车', scaleLabel: '方案预计规模', actualDate: null, result: null,
    tags: ['敦煌自驾', '文化探索', '防风固沙'],
    summary: '循着西行足迹，把探索与守护带进大漠。',
    background: '围绕“敢问路在何方 共赴心中昆仑”年度主题，以玄奘西行路线为叙事脉络，把敦煌文化体验、戈壁自驾与生态保护融入福探长行动。',
    need: '方案聚焦品牌文化表达、车主体验与传播内容，通过有参与感的公益环节增强车主联系，并在长途自驾中呈现探险者车型的产品体验。',
    idea: '以嘉峪关至敦煌的旅程串联玄奘取经博物馆、戈壁雕塑与敦煌景观，将鸣沙山草方格防沙体验作为公益主线，让文化探访与生态守护成为同一段旅程的内容。',
    highlights: ['玄奘西行主题与敦煌文化路线结合', '草方格防风固沙公益体验', '长途自驾体验与车主故事传播'],
    source: '【活动方案 0730d4】敢问路在何方 共赴心中昆仑 福探长行动·探大漠风沙种公益新绿.pptx',
    sourceNote: '文字据 33 页完整方案整理，个人职责由本人确认。日期、人数与车辆数为方案安排，实际执行数据与成果待补充。',
    cover: {
      src: '/images/dunhuang/kv-1600.webp',
      srcSet: '/images/dunhuang/kv-800.webp 800w, /images/dunhuang/kv-1600.webp 1600w',
      alt: '敦煌活动主 KV：沙丘与敦煌建筑间的橙色福特探险者，主题为探大漠风沙种公益新绿',
      width: 1600, height: 848, fit: 'contain',
    },
    media: [],
    videos: [
      { src: '/videos/dunhuang/film-01.mp4', poster: '/videos/dunhuang/film-01-poster.jpg', title: '敦煌行 · 活动花絮 01', width: 1920, height: 1080, durationLabel: '01:15' },
      { src: '/videos/dunhuang/film-02.mp4', poster: '/videos/dunhuang/film-02-poster.jpg', title: '敦煌行 · 活动花絮 02', width: 1920, height: 1080, durationLabel: '01:05' },
    ],
    albumUrl: 'https://live.photoplus.cn/live/94520283?nw=1755078203039',
    proposalFiles: [{
      src: '/proposals/dunhuang/complete-proposal.pdf', name: '探大漠风沙种公益新绿 · 完整方案阅读版',
      format: 'PDF', sizeLabel: '14.5 MB', pages: 33,
      downloadName: '福探长行动·探大漠风沙种公益新绿-完整方案阅读版.pdf', downloadLabel: '下载阅读版',
    }, {
      src: '/proposals/dunhuang/complete-proposal.pptx', name: '探大漠风沙种公益新绿 · 完整活动方案',
      format: 'PPTX', sizeLabel: '51.4 MB', pages: 33,
      downloadName: '【活动方案 0730d4】敢问路在何方 共赴心中昆仑 福探长行动·探大漠风沙种公益新绿.pptx',
    }],
  },
  {
    id: 'explorer-journey', category: '汽车营销', subcategory: '自驾游', theme: 'journey', english: 'BEYOND\nTHE ROAD.',
    title: '敢问路在何方 共赴心中昆仑', subtitle: '福探长行动·再启玄奘之路开启爱心征途', client: '长安福特',
    date: '2025.05.24—25', dateLabel: '方案活动日期', city: '西安 / 太白山 / 麦积山（方案路线）', type: '车主自驾 · 文化公益',
    role: '活动整体统筹 / 方案文案撰写 / 线下执行 / 传播执行',
    responsibilities: '负责整个活动的统筹与方案文案撰写，并推进线下执行和传播执行，将策划内容落实到旅程体验与活动传播。',
    scale: '预计约 67 人（含工作人员） / 20 辆车', scaleLabel: '方案预计规模', actualDate: null, result: null,
    tags: ['车主活动', '文化体验', '公益联动'],
    summary: '让一次远行，成为人与品牌共同的记忆。',
    background: '延续福探长的探索与公益主题，以玄奘精神、丝路文化与自然保护为线索，为车主自驾活动建立更具情感的叙事。',
    need: '方案希望串联路线、文化内容和公益参与，在产品体验之外形成用户对品牌的认同。',
    idea: '以西安至麦积山的路线串联文化与自然体验，将太白山生态保护、石窟文化与公益行动融入行程。',
    highlights: ['以路线串联玄奘精神与丝路文明', '生态保护与文化公益相结合', '从旅途体验延展品牌共同记忆'],
    source: '最终【活动方案 0517d5】敢问路在何方 共赴心中昆仑 福探长行动·再启玄奘之路开启爱心征途.pdf',
    sourceNote: '文字据 42 页完整方案整理，个人职责由本人确认。活动日期据方案第 13、17—18 页；封面标注为 2025.2。人数与车辆数为方案预计，实际日期、规模与成果待补充。',
    cover: {
      src: '/images/xuanzang/kv-1600.webp',
      srcSet: '/images/xuanzang/kv-800.webp 800w, /images/xuanzang/kv-1600.webp 1600w',
      alt: '玄奘之路活动主 KV：橙色福特探险者拖挂房车行驶于戈壁公路，主题为再启玄奘之路开启爱心征途',
      width: 1600, height: 898, fit: 'contain',
    },
    media: [],
    videos: [
      { src: '/videos/xuanzang/film-01.mp4', poster: '/videos/xuanzang/film-01-poster.jpg', title: '玄奘之路 · 活动花絮 01', width: 1920, height: 1080, durationLabel: '01:15' },
      { src: '/videos/xuanzang/film-02.mp4', poster: '/videos/xuanzang/film-02-poster.jpg', title: '玄奘之路 · 活动花絮 02', width: 1920, height: 1080, durationLabel: '01:03' },
    ],
    albumUrl: 'https://live.photoplus.cn/live/72530092?nw=1747641960721',
    proposalFiles: [{
      src: '/proposals/xuanzang/complete-proposal.pdf', name: '再启玄奘之路开启爱心征途 · 完整活动方案',
      format: 'PDF', sizeLabel: '26.5 MB', pages: 42,
      downloadName: '最终【活动方案 0517d5】敢问路在何方 共赴心中昆仑 福探长行动·再启玄奘之路开启爱心征途.pdf',
    }],
  },
  ...realEstateProjects,
  ...otherProjects,
  ...automotiveProjects,
].map(project => resolveProjectAssets({ ...project, media: projectPhotos[project.id] || project.media || [] }));

export const capabilities = [
  { number: '01', english: 'STRATEGY', title: '从需求里，找到方向', description: '理解品牌目标、产品卖点与区域市场，把客户需求转化为清晰的活动命题。', tags: ['策略策划', '区域营销规划', '客户需求梳理'] },
  { number: '02', english: 'CREATIVE', title: '让创意，成为可感知的体验', description: '从主题概念到体验环节，把一个想法展开为有内容、有节奏的完整方案。', tags: ['活动创意', '方案撰写', 'PPT 策划', '流程设计'] },
  { number: '03', english: 'PRODUCTION', title: '把每个细节，带到现场', description: '协调设计、搭建、物料、人员与供应商，把时间、预算和现场执行放在同一张计划里。', tags: ['预算规划', '供应商管理', '现场统筹', '风险管控'] },
  { number: '04', english: 'CONNECTION', title: '让一次活动，留下更多回响', description: '在活动前、中、后组织内容触点，连接现场体验、用户关系与后续传播。', tags: ['传播内容', '短视频策划', '用户活动', '经销商活动'] },
];

export const galleryPhotoLimit = 12;
