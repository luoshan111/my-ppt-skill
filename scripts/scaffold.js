/* ============================================================
 * blue-academic-ppt 组件库 scaffold.js
 * 风格：蓝白学术风（答辩 defense / 蓝白商务 business / 竞赛路演 contest 三变体）
 * 用法：const S = require("<本文件路径>");
 *       const pres = S.init({ variant: "defense" });
 *       const s = pres.addSlide(); S.coverDefense(s, {...});
 * 规则：所有颜色/字体一律引用 S.T / S.CON 常量，禁止手写新色值。
 * ============================================================ */
const pptxgen = require("pptxgenjs");

// ---------- 设计常量（从用户参考 PPT 提炼，勿随意改动） ----------
const T = {
  W: 13.33, H: 7.5, M: 0.6,                    // 画布与页边距
  INK: "1A1A1A", BODY: "333333", MUT: "5A6472", // 主文字 / 正文 / 弱文字
  NAVY: "24498F",                               // 答辩风主结构蓝
  NAVYTXT: "31497A",                            // 深蓝灰（页标题/强调文字）
  BLUE: "2E6BC4",                               // 中蓝（图标/次级）
  BIZNAVY: "0E419C",                            // 商务风主结构蓝
  LIGHT: "C7D3E8",                              // 浅蓝芯片底
  SKY: "B9C9E4",                                // 底部渐变浅蓝带
  PALE: "E8EEF7",                               // 极浅蓝（占位/底带）
  GREY: "F0F1F3",                               // 灰胶囊/灰底带
  MIST: "F4F6FA",                               // 引言带/表格斑马纹
  LINE: "D9DFE9",                               // 细线/描边
  GOLD: "FFC000", RED: "C00000", WHITE: "FFFFFF",
  F: "Microsoft YaHei", FL: "Arial",            // 中文 / 西文数字
};
const CHART_BLUES = ["24498F", "4472C4", "8FAADC", "C7D3E8"];
// 图解页五色族（来自用户架构图集）：饱和主色 + 粉彩底
const DIA = {
  blue:   { main: "466AB2", fill: "E9EEF7" },
  red:    { main: "BE4343", fill: "F7E9E9" },
  amber:  { main: "F0A40C", fill: "FCF8E4" },
  purple: { main: "A56FB1", fill: "F3ECF4" },
  teal:   { main: "449387", fill: "EBF5F4" },
  coral:  { main: "FF4C6D", fill: "FDE7EB" },   // 珊瑚红（材料研究方法集）
  steel:  { main: "5290C0", fill: "E3EEF7" },   // 钢蓝（同上）
  royal:  { main: "3944C9", fill: "E3E7FA" },   // 竞选宝蓝（国奖竞选集）
  peri:   { main: "A5AAE9", fill: "EDF0FB" },   // 浅藤紫（同上）
  sun:    { main: "F6D671", fill: "FCF3DC" },   // 金黄（同上，强调色）
};
// 色阶插值（gradStripRow 用）：t=0 取 c1，t=1 取 c2
function lerpColor(c1, c2, t) {
  const p = h => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  const a = p(c1), b = p(c2);
  return a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("").toUpperCase();
}

let VARIANT = "defense";

// ---------- 初始化 ----------
function init(opts = {}) {
  VARIANT = opts.variant || "defense";
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: T.F, bodyFontFace: T.F };
  if (opts.title) pres.title = opts.title;
  if (opts.author) pres.author = opts.author;
  return pres;
}
const primary = () => (VARIANT === "business" ? T.BIZNAVY : T.NAVY);

// ---------- 基础绘制 ----------
function card(s, x, y, w, h, o = {}) {
  const shp = { x, y, w, h, rectRadius: o.r ?? 0.06, fill: { color: o.fill ?? T.WHITE } };
  if (o.line !== null) shp.line = { color: o.line ?? T.LINE, width: o.lw ?? 1, dashType: o.dash ? "dash" : "solid" };
  s.addShape("roundRect", shp);
}
function txt(s, t, o) { s.addText(t, { fontFace: T.F, margin: 0, ...o }); }
// 富文本（关键词高亮）：parts = ["文字", {t:"关键词", c:T.NAVY, b:true}, ...]
// 需配合 fix_ppr.py 后处理（构建流程内含）。
function rich(parts) {
  return parts.map(p => typeof p === "string" ? { text: p, options: {} }
    : { text: p.t, options: { color: p.c, bold: !!p.b } });
}
function logo(s, path) {
  if (!path) return;
  s.addImage({ path, x: T.W - 1.85, y: 0.3, w: 1.45, h: 0.45, sizing: { type: "contain", w: 1.45, h: 0.45 } });
}
function pageNo(s, n) {
  txt(s, String(n), { x: T.W - 0.85, y: 7.08, w: 0.5, h: 0.3, fontSize: 11, fontFace: T.FL, color: T.MUT, align: "right" });
}

// ---------- 底部色带（答辩风签名母题） ----------
function bottomBands(s, summary) {
  s.addShape("rect", { x: 0, y: 6.35, w: T.W, h: 0.72, fill: { color: T.SKY } });
  s.addShape("rect", { x: 0, y: 7.0, w: T.W, h: 0.5, fill: { color: primary() } });
  if (summary) txt(s, summary, { x: 1.2, y: 7.0, w: T.W - 2.4, h: 0.5, fontSize: 10.5, color: T.WHITE, align: "center", valign: "middle" });
}
// ---------- 底部波浪（商务风签名母题） ----------
function waveFooter(s) {
  s.addShape("ellipse", { x: -2.0, y: 6.6, w: 17.3, h: 2.1, fill: { color: T.PALE } });
  s.addShape("ellipse", { x: -2.6, y: 6.88, w: 18.5, h: 2.1, fill: { color: T.WHITE } });
  s.addShape("rect", { x: 0, y: 7.14, w: T.W, h: 0.36, fill: { color: primary() } });
}

// ---------- 封面（答辩风） ----------
function coverDefense(s, o = {}) {
  // 左上汉堡标
  [0, 1, 2].forEach(i => s.addShape("rect", { x: 0.5, y: 0.44 + i * 0.12, w: 0.32, h: 0.035, fill: { color: T.NAVYTXT } }));
  logo(s, o.logo);
  txt(s, o.kicker ?? "", { x: 1.2, y: 1.62, w: 10.93, h: 0.4, fontSize: 16, bold: true, color: T.INK, align: "center" });
  txt(s, o.title ?? "", { x: 0.8, y: 2.18, w: 11.73, h: 0.95, fontSize: 40, bold: true, color: primary(), align: "center" });
  txt(s, o.en ?? "", { x: 1.2, y: 3.28, w: 10.93, h: 0.4, fontSize: 13, bold: true, color: T.NAVYTXT, align: "center", charSpacing: 2 });
  const infos = o.info ?? [];
  const n = infos.length, pw = Math.min(2.6, 11 / n), gap = 0.3;
  const x0 = (T.W - (n * pw + (n - 1) * gap)) / 2;
  infos.forEach((it, i) => {
    const x = x0 + i * (pw + gap);
    s.addShape("roundRect", { x, y: 4.45, w: pw, h: 0.52, rectRadius: 0.26, fill: { color: T.GREY } });
    txt(s, it.label + "：" + it.value, { x, y: 4.45, w: pw, h: 0.52, fontSize: 13, bold: true, color: T.NAVYTXT, align: "center", valign: "middle" });
  });
  bottomBands(s, o.summary);
}

// ---------- 目录（答辩风） ----------
function tocDefense(s, o = {}) {
  const chs = o.chapters ?? [];
  s.addShape("rect", { x: 0, y: 0, w: 2.95, h: T.H, fill: { color: primary() } });
  s.addShape("rect", { x: 2.95, y: 0, w: 0.7, h: T.H, fill: { color: T.SKY } });
  txt(s, "目", { x: 0.85, y: 2.2, w: 1.25, h: 1.1, fontSize: 52, bold: true, color: T.WHITE, align: "center" });
  txt(s, "录", { x: 0.85, y: 3.55, w: 1.25, h: 1.1, fontSize: 52, bold: true, color: T.WHITE, align: "center" });
  txt(s, "CONTENTS", { x: 0.35, y: 4.9, w: 2.25, h: 0.4, fontSize: 12, bold: true, color: T.WHITE, align: "center", charSpacing: 3 });
  const n = chs.length, rh = 0.78, gap = 0.26;
  const y0 = (T.H - n * rh - (n - 1) * gap) / 2;
  chs.forEach((c, i) => {
    const y = y0 + i * (rh + gap);
    s.addShape("roundRect", { x: 4.3, y, w: 8.2, h: rh, rectRadius: rh / 2, fill: { color: T.WHITE }, line: { color: T.LINE, width: 1 } });
    txt(s, c.no, { x: 4.75, y, w: 0.95, h: rh, fontSize: 26, bold: true, fontFace: T.FL, color: primary(), align: "left", valign: "middle" });
    txt(s, c.title, { x: 5.8, y, w: 6.4, h: rh, fontSize: 17, bold: true, color: T.INK, valign: "middle" });
  });
}

// ---------- 分节页（答辩风：PART X） ----------
function partDivider(s, o = {}) {
  logo(s, o.logo);
  txt(s, o.no ?? "01", { x: 5.42, y: 1.3, w: 2.5, h: 1.15, fontSize: 66, bold: true, fontFace: T.FL, color: T.WHITE,
    outline: { size: 1.2, color: T.NAVYTXT }, align: "center" });
  s.addShape("roundRect", { x: 5.57, y: 2.26, w: 2.2, h: 0.44, rectRadius: 0.22, fill: { color: T.GREY } });
  txt(s, o.en ?? "PART ONE", { x: 5.57, y: 2.26, w: 2.2, h: 0.44, fontSize: 13, bold: true, fontFace: T.FL, color: T.NAVYTXT, align: "center", valign: "middle", charSpacing: 2 });
  txt(s, o.title ?? "", { x: 1.5, y: 2.9, w: 10.33, h: 0.95, fontSize: 40, bold: true, color: primary(), align: "center" });
  txt(s, o.enSub ?? "", { x: 1.5, y: 3.98, w: 10.33, h: 0.4, fontSize: 13, bold: true, fontFace: T.FL, color: T.NAVYTXT, align: "center", charSpacing: 2 });
  if (o.points?.length) {
    txt(s, o.points.map(p => "· " + p).join("　　"), { x: 1.5, y: 4.62, w: 10.33, h: 0.4, fontSize: 13.5, bold: true, color: T.INK, align: "center" });
  }
  bottomBands(s, o.summary);
}

// ---------- 内容页页眉（答辩风：顶部章节标签导航） ----------
function tabNav(s, o = {}) {
  const tabs = o.tabs ?? [], y = 0.3, tw = o.tabW ?? 1.66, gap = 0.12;
  tabs.forEach((t, i) => {
    const x = 0.55 + i * (tw + gap), act = i === (o.active ?? 0);
    s.addShape("roundRect", { x, y, w: tw, h: 0.56, rectRadius: 0.07,
      fill: { color: act ? primary() : T.GREY } });
    txt(s, t, { x, y, w: tw, h: 0.56, fontSize: 13.5, bold: true, color: act ? T.WHITE : T.NAVYTXT, align: "center", valign: "middle" });
  });
  s.addShape("line", { x: 0.55, y: 1.02, w: T.W - 1.1, h: 0, line: { color: T.LINE, width: 1 } });
  logo(s, o.logo);
}
// 小节标题："1.1 研究背景"
function pageTitle(s, o = {}) {
  txt(s, (o.no ? o.no + "  " : "") + (o.text ?? ""), { x: T.M, y: 1.14, w: 11, h: 0.52, fontSize: 24, bold: true, color: T.NAVYTXT });
}
// 灰底引言带
function introBand(s, o = {}) {
  const y = o.y ?? 1.78, h = o.h ?? 0.92;
  s.addShape("rect", { x: T.M, y, w: T.W - 2 * T.M, h, fill: { color: T.MIST } });
  txt(s, o.text ?? "", { x: T.M + 0.25, y, w: T.W - 2 * T.M - 0.5, h, fontSize: 14, color: T.BODY, valign: "middle", lineSpacingMultiple: 1.25 });
}
// navy 实心标签（kaiti 风）
function navyTag(s, o = {}) {
  const w = o.w ?? 2.6, h = o.h ?? 0.5;
  s.addShape("roundRect", { x: o.x, y: o.y, w, h, rectRadius: 0.04, fill: { color: primary() } });
  txt(s, o.text ?? "", { x: o.x, y: o.y, w, h, fontSize: 15, bold: true, color: T.WHITE, align: "center", valign: "middle" });
}
// 浅蓝芯片 + 卡片（shuobo 对比卡）
function chipCard(s, o = {}) {
  const chipW = o.chipW ?? 1.95;
  s.addShape("roundRect", { x: o.x, y: o.y, w: chipW, h: 0.52, rectRadius: 0.05, fill: { color: T.LIGHT } });
  txt(s, o.chip ?? "", { x: o.x, y: o.y, w: chipW, h: 0.52, fontSize: 16, bold: true, color: T.NAVYTXT, align: "center", valign: "middle" });
  const cy = o.y + 0.62, ch = o.h ?? 1.35;
  card(s, o.x, cy, o.w, ch, { dash: o.dash ?? true, lw: 0.75 });
  txt(s, o.text ?? "", { x: o.x + 0.22, y: cy, w: o.w - 0.44, h: ch, fontSize: o.fs ?? 13, color: T.BODY,
    align: o.align ?? "center", valign: "middle", lineSpacingMultiple: 1.2 });
}
// 全宽结论带（kaiti 风）
function calloutBand(s, o = {}) {
  const h = o.h ?? 0.8, y = o.y;
  s.addShape("rect", { x: 0.7, y, w: T.W - 1.4, h, fill: { color: primary() } });
  txt(s, o.text ?? "", { x: 1.1, y, w: T.W - 2.2, h, fontSize: 15.5, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.15 });
}
// kaiti 风内容页眉：navy 方块章节号 + 黑标题
function sectionSquare(s, o = {}) {
  s.addShape("rect", { x: 0.55, y: 0.3, w: 0.75, h: 0.75, fill: { color: primary() } });
  txt(s, o.no ?? "01", { x: 0.55, y: 0.3, w: 0.75, h: 0.75, fontSize: 26, bold: true, fontFace: T.FL, color: T.WHITE, align: "center", valign: "middle" });
  txt(s, o.title ?? "", { x: 1.5, y: 0.3, w: 9.5, h: 0.75, fontSize: 20, bold: true, color: T.INK, valign: "middle" });
  s.addShape("line", { x: 1.5, y: 1.05, w: 10.3, h: 0, line: { color: T.LINE, width: 1 } });
  logo(s, o.logo);
}

// ---------- 商务风组件 ----------
// 页眉：图标位 + 蓝标题 + 右侧描边导航胶囊
function bizHeader(s, o = {}) {
  const nav = o.nav ?? [], y = 0.42, nw = 1.5, nh = 0.5;
  txt(s, o.title ?? "", { x: 1.15, y: y - 0.08, w: 4.6, h: 0.62, fontSize: 24, bold: true, color: primary() });
  s.addShape("line", { x: 1.15, y: y + 0.62, w: 3.6, h: 0, line: { color: primary(), width: 2 } });
  nav.forEach((t, i) => {
    const x = T.W - 0.55 - (nav.length - i) * (nw + 0.14), act = i === (o.active ?? 0);
    s.addShape("roundRect", { x, y, w: nw, h: nh, rectRadius: 0.06,
      fill: { color: act ? primary() : T.WHITE },
      line: { color: primary(), width: 1 } });
    txt(s, t, { x, y, w: nw, h: nh, fontSize: 13, bold: true, color: act ? T.WHITE : T.NAVYTXT, align: "center", valign: "middle" });
  });
  s.addShape("roundRect", { x: 0.55, y: y - 0.06, w: 0.46, h: 0.5, rectRadius: 0.05, fill: { color: T.PALE }, line: { color: primary(), width: 1 } });
}
// 圆角缺口横幅（yiliao 风）
function bizBanner(s, o = {}) {
  const h = o.h ?? 0.62;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h, rectRadius: 0.1, fill: { color: primary() } });
  s.addShape("rect", { x: o.x + o.w - 0.5, y: o.y, w: 0.5, h, fill: { color: primary() } });
  s.addShape("roundRect", { x: o.x + o.w - 0.5, y: o.y + h * 0.4, w: 0.5, h: h * 0.6, rectRadius: 0.06, fill: { color: T.PALE } });
  txt(s, o.text ?? "", { x: o.x + 0.35, y: o.y, w: o.w - 0.9, h, fontSize: o.fs ?? 18, bold: true, color: T.WHITE, valign: "middle" });
}
// 统计项：蓝圆 + 大数字 + 标签
function statItem(s, o = {}) {
  const d = 0.58;
  s.addShape("ellipse", { x: o.x, y: o.y, w: d, h: d, fill: { color: primary() } });
  txt(s, o.icon ?? "", { x: o.x, y: o.y, w: d, h: d, fontSize: 15, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  txt(s, o.value ?? "", { x: o.x + d + 0.12, y: o.y - 0.12, w: o.w - d - 0.12, h: 0.42, fontSize: 21, bold: true, fontFace: T.FL, color: primary() });
  txt(s, o.label ?? "", { x: o.x + d + 0.12, y: o.y + 0.3, w: o.w - d - 0.12, h: 0.32, fontSize: 12.5, bold: true, color: T.INK });
}
// 描边胶囊行
function pillRow(s, o = {}) {
  const n = o.items?.length ?? 0, w = o.w ?? 1.75, h = o.h ?? 0.44, gap = o.gap ?? 0.22;
  (o.items ?? []).forEach((t, i) => {
    const x = o.x + i * (w + gap);
    s.addShape("roundRect", { x, y: o.y, w, h, rectRadius: h / 2, fill: { color: T.WHITE }, line: { color: primary(), width: 1 } });
    txt(s, t, { x, y: o.y, w, h, fontSize: 12.5, bold: true, color: primary(), align: "center", valign: "middle" });
  });
}
// 图片占位
function imgPlaceholder(s, o = {}) {
  card(s, o.x, o.y, o.w, o.h, { fill: o.fill ?? T.PALE, line: o.line ?? T.LINE, dash: true, lw: 0.75 });
  txt(s, o.caption ?? "图表 / 图片占位（替换为素材）", { x: o.x, y: o.y, w: o.w, h: o.h, fontSize: 11.5, color: T.MUT, align: "center", valign: "middle" });
}

// ---------- 通用内容件 ----------
// 表格：rows = [[...], ...]，首行为表头
function table(s, rows, o = {}) {
  const data = rows.map((r, ri) => r.map(c => ({
    text: String(c),
    options: ri === 0
      ? { fill: { color: primary() }, color: T.WHITE, bold: true, fontSize: o.headFs ?? 13, align: "center", valign: "middle" }
      : { fill: { color: ri % 2 ? T.WHITE : T.MIST }, color: T.BODY, fontSize: o.fs ?? 12.5, align: "center", valign: "middle" },
  })));
  s.addTable(data, { x: o.x, y: o.y, w: o.w, colW: o.colW, border: { pt: 0.75, color: T.LINE }, fontFace: T.F, rowH: o.rowH ?? 0.42 });
}
// 原生图表统一蓝系
function chartOpts(extra = {}) {
  return { chartColors: CHART_BLUES, chartArea: { fill: { color: T.WHITE } },
    catAxisLabelColor: T.MUT, valAxisLabelColor: T.MUT, catAxisLabelFontFace: T.F, valAxisLabelFontFace: T.F,
    valGridLine: { color: "E4E9F2", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false, ...extra };
}
// 强调数字（红/蓝大数字）
function statNumber(s, o = {}) {
  txt(s, o.value ?? "", { x: o.x, y: o.y, w: o.w ?? 2, h: o.h ?? 0.7, fontSize: o.fs ?? 34, bold: true, fontFace: T.FL, color: o.color ?? T.RED });
  txt(s, o.label ?? "", { x: o.x, y: o.y + (o.h ?? 0.7), w: o.w ?? 2, h: 0.3, fontSize: 12, color: T.MUT });
}

// ---------- 图解组件（架构图/技术路线页，来自用户架构图集） ----------
// 竖排文字导轨：blocks=[{text,color}]，每个色块一字一行
function vRail(s, o = {}) {
  const n = o.blocks.length, gap = o.gap ?? 0.18;
  const bh = (o.h - (n - 1) * gap) / n;
  o.blocks.forEach((b, i) => {
    const y = o.y + i * (bh + gap);
    const fam = DIA[b.color] ?? DIA.blue;
    const soft = b.soft ?? o.soft;
    s.addShape("roundRect", { x: o.x, y, w: o.w, h: bh, rectRadius: 0.09, fill: { color: soft ? fam.fill : (b.fill ?? fam.main) } });
    txt(s, (b.text ?? "").split("").join("\n"), { x: o.x, y, w: o.w, h: bh, fontSize: o.fs ?? 15, bold: true,
      color: soft ? fam.main : T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.05 });
  });
}
// 图解节点：pastel 底 + 饱和色粗体字（solid 则反转）；sub 为第二行小字
function diaNode(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  const shp = { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06, fill: { color: o.solid ? fam.main : (o.fill ?? fam.fill) } };
  if (!o.lineless) shp.line = { color: fam.main, width: 0.75 };
  s.addShape("roundRect", shp);
  const tc = o.solid ? T.WHITE : (o.tc ?? fam.main);
  const runs = o.sub
    ? [{ text: o.text, options: { fontSize: o.fs ?? 13, bold: true, color: tc, breakLine: true } },
       { text: o.sub, options: { fontSize: (o.fs ?? 13) - 1.5, bold: true, color: tc } }]
    : [{ text: o.text, options: { fontSize: o.fs ?? 13, bold: true, color: tc } }];
  s.addText(runs, { x: o.x + 0.08, y: o.y, w: o.w - 0.16, h: o.h, fontFace: T.F, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
}
// 虚线分组框
function dashGroup(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.1, fill: { color: o.fill ?? T.WHITE },
    line: { color: o.lineColor ?? fam.main, width: 1, dashType: "dash" } });
  if (o.label) txt(s, o.label, { x: o.x + 0.18, y: o.y + 0.08, w: o.w - 0.36, h: 0.3, fontSize: 12.5, bold: true, color: o.labelColor ?? fam.main });
}
// 块状箭头 dir=down|right|left|up
function blockArrow(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  const down = (o.dir ?? "down") === "down";
  const shp = { x: o.x, y: o.y,
    w: o.w ?? (down ? 0.3 : (o.len ?? 0.6)), h: o.h ?? (down ? (o.len ?? 0.45) : 0.3),
    fill: { color: o.solid === false ? fam.fill : fam.main } };
  s.addShape({ down: "downArrow", right: "rightArrow", left: "leftArrow", up: "upArrow" }[o.dir ?? "down"], shp);
}
// chevron 流程链（首节点用平头 homePlate）；items=[{text,color}]
function chevronChain(s, o = {}) {
  const n = o.items.length, ov = o.overlap ?? 0.12;
  const w = (o.w - (n - 1) * ov) / n, h = o.h ?? 0.6;
  o.items.forEach((it, i) => {
    const x = o.x + i * (w + ov);
    const fam = DIA[it.color] ?? DIA.blue;
    s.addShape(i === 0 ? "homePlate" : "chevron", { x, y: o.y, w, h, fill: { color: it.fill ?? (o.solid ? fam.main : fam.fill) } });
    txt(s, it.text, { x: x + (i === 0 ? 0.08 : w * 0.18), y: o.y, w: w - (i === 0 ? 0.16 : w * 0.18), h,
      fontSize: o.fs ?? 13.5, bold: true, color: it.tc ?? fam.main, align: "center", valign: "middle" });
  });
}
// 圆形节点闭环：节点间双向箭头
function circleChain(s, o = {}) {
  const d = o.d ?? 0.95, gap = o.gap ?? 0.5;
  const total = o.items.length * (d + gap) - gap;
  o.items.forEach((it, i) => {
    const cx = o.cx - total / 2 + i * (d + gap);
    const fam = DIA[it.color] ?? DIA.blue;
    s.addShape("ellipse", { x: cx, y: o.cy - d / 2, w: d, h: d, fill: { color: it.fill ?? fam.fill } });
    txt(s, it.text, { x: cx, y: o.cy - d / 2, w: d, h: d, fontSize: o.fs ?? 12, bold: true, color: it.tc ?? fam.main, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
    if (i < o.items.length - 1)
      s.addShape("leftRightArrow", { x: cx + d + 0.06, y: o.cy - 0.13, w: gap - 0.12, h: 0.26, fill: { color: fam.main } });
  });
}
// 色块头 + 小标签网格（2 列常用）；返回组件底部 y
function badgeGrid(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.amber;
  const cols = o.cols ?? 2, hh = o.hh ?? 0.44;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: hh, rectRadius: 0.05, fill: { color: fam.main } });
  txt(s, o.title ?? "", { x: o.x, y: o.y, w: o.w, h: hh, fontSize: o.hfs ?? 15, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  const items = o.items ?? [], th = o.th ?? 0.4;
  const tw = (o.w - 0.24 - (cols - 1) * 0.12) / cols;
  items.forEach((t, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = o.x + 0.12 + c * (tw + 0.12), y = o.y + hh + 0.12 + r * (th + 0.1);
    s.addShape("roundRect", { x, y, w: tw, h: th, rectRadius: 0.04, fill: { color: fam.fill } });
    txt(s, t, { x, y, w: tw, h: th, fontSize: o.fs ?? 11.5, bold: true, color: fam.main, align: "center", valign: "middle" });
  });
  return o.y + hh + 0.12 + Math.ceil(items.length / cols) * (th + 0.1);
}
// 便签卡：标题条 + 密集小字行
function noteStack(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.amber;
  card(s, o.x, o.y, o.w, o.h, { fill: fam.fill, line: fam.main, lw: 0.75 });
  if (o.title) {
    s.addShape("roundRect", { x: o.x + 0.12, y: o.y + 0.12, w: o.w - 0.24, h: 0.4, rectRadius: 0.05, fill: { color: fam.main } });
    txt(s, o.title, { x: o.x + 0.12, y: o.y + 0.12, w: o.w - 0.24, h: 0.4, fontSize: 13, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  }
  txt(s, (o.items ?? []).map(t => "· " + t).join("\n"), { x: o.x + 0.18, y: o.y + (o.title ? 0.62 : 0.14),
    w: o.w - 0.36, h: o.h - (o.title ? 0.76 : 0.28), fontSize: o.fs ?? 11.5, bold: true, color: fam.main,
    valign: o.valign ?? "top", lineSpacingMultiple: 1.35 });
}
// 金字塔（levels 自顶向底）；返回底部 y
function diaPyramid(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.amber;
  const n = o.levels.length, lh = (o.h ?? 2.1) / n;
  o.levels.forEach((t, i) => {
    const frac = 1 - i * (0.72 / Math.max(n - 1, 1));
    const w = o.w * frac, x = o.cx - w / 2, y = o.y + i * lh;
    s.addShape(i === 0 ? "triangle" : "trapezoid", { x, y, w, h: lh * 0.92, fill: { color: fam.fill } });
    txt(s, t, { x, y: y + (i === 0 ? lh * 0.18 : 0), w, h: lh * 0.92, fontSize: o.fs ?? 13, bold: true, color: fam.main, align: "center", valign: "middle" });
  });
  return o.y + n * lh;
}
// 图解页大标题条（整页架构图的标题横幅）
function diaTitleBar(s, o = {}) {
  const h = o.h ?? 0.72;
  s.addShape("roundRect", { x: o.x ?? 0.7, y: o.y ?? 0.45, w: o.w ?? (T.W - 1.4), h, rectRadius: 0.08, fill: { color: o.color ?? primary() } });
  txt(s, o.text ?? "", { x: (o.x ?? 0.7) + 0.3, y: o.y ?? 0.45, w: (o.w ?? T.W - 1.4) - 0.6, h, fontSize: o.fs ?? 22, bold: true, color: T.WHITE, valign: "middle" });
}

// ---------- 图解组件 II（环形体系/双循环/对称列，来自架构图集后半部分） ----------
const rad = d => (d * Math.PI) / 180;
// 虚线列表框：items 为字符串（自动加 · ）或 {k,v}（k 粗体色字，v 深色常规）
function listGroup(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  const shp = { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.08, fill: { color: o.fill ?? T.WHITE },
    line: { color: fam.main, width: 1, dashType: "dash" } };
  s.addShape("roundRect", shp);
  const runs = [];
  (o.items ?? []).forEach((it, i) => {
    const last = i === (o.items.length - 1);
    if (typeof it === "string") {
      runs.push({ text: "· " + it, options: { fontSize: o.fs ?? 12, bold: true, color: fam.main, breakLine: !last } });
    } else {
      runs.push({ text: "· " + it.k + "：", options: { fontSize: o.fs ?? 12, bold: true, color: fam.main } });
      runs.push({ text: it.v, options: { fontSize: o.fs ?? 12, color: T.BODY, breakLine: !last } });
    }
  });
  s.addText(runs, { x: o.x + 0.18, y: o.y + (o.title ? 0.52 : 0.1), w: o.w - 0.36, h: o.h - (o.title ? 0.62 : 0.2),
    fontFace: T.F, valign: o.valign ?? "middle", margin: 0, lineSpacingMultiple: o.lsm ?? 1.35,
    align: o.align ?? "left", paraSpaceAfter: o.psa ?? 4 });
  if (o.title) txt(s, o.title, { x: o.x, y: o.y, w: o.w, h: 0.46, fontSize: o.tfs ?? 14.5, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  if (o.title) s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: 0.46, rectRadius: 0.06, fill: { color: fam.main } });
  if (o.title) s.addText(o.title, { x: o.x, y: o.y, w: o.w, h: 0.46, fontFace: T.F, fontSize: o.tfs ?? 14.5, bold: true, color: T.WHITE, align: "center", valign: "middle", margin: 0 });
}
// 实心头 + 虚线列表卡
function headerList(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: 0.52, rectRadius: 0.06, fill: { color: fam.main } });
  const runs = [{ text: o.title ?? "", options: { fontSize: 15, bold: true, color: T.WHITE } }];
  if (o.sub) runs.push({ text: "  " + o.sub, options: { fontSize: 10.5, bold: true, color: T.WHITE } });
  s.addText(runs, { x: o.x, y: o.y, w: o.w, h: 0.52, fontFace: T.F, align: "center", valign: "middle", margin: 0 });
  listGroup(s, { x: o.x, y: o.y + 0.62, w: o.w, h: (o.h ?? 1.8) - 0.62, color: o.color, items: o.items, fs: o.fs, lsm: o.lsm ?? 1.3 });
}
// 水平轨道圆点链（知情意行/岗课赛证式）：cx 为轨道中心
function orbitCircles(s, o = {}) {
  const d = o.d ?? 0.85, n = o.items.length, gap = o.gap ?? 0.9;
  const total = n * d + (n - 1) * gap;
  const step = d + gap;
  const x0 = o.cx - (total - d) / 2 - d / 2;
  if (o.track !== false) s.addShape("line", { x: x0 + d / 2, y: o.cy, w: total - d, h: 0, line: { color: T.LINE, width: 1.25 } });
  o.items.forEach((it, i) => {
    const cx = x0 + i * step + d / 2;
    const fam = DIA[it.color] ?? DIA.blue;
    if (it.double) {
      s.addShape("ellipse", { x: cx - d / 2, y: o.cy - d / 2, w: d, h: d, fill: { color: T.WHITE }, line: { color: fam.main, width: 1.25 } });
      const d2 = d * 0.66;
      s.addShape("ellipse", { x: cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fill: { color: fam.main } });
      txt(s, it.text, { x: cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fontSize: o.fs ?? 18, bold: true, color: T.WHITE, align: "center", valign: "middle" });
    } else {
      s.addShape("ellipse", { x: cx - d / 2, y: o.cy - d / 2, w: d, h: d, fill: { color: it.fill ?? fam.main } });
      txt(s, it.text, { x: cx - d / 2, y: o.cy - d / 2, w: d, h: d, fontSize: o.fs ?? 14, bold: true, color: it.tc ?? T.WHITE, align: "center", valign: "middle" });
    }
  });
  if (o.center) txt(s, o.center.text, { x: o.cx - 0.9, y: o.cy - 0.35, w: 1.8, h: 0.7, fontSize: o.cfs ?? 22, bold: true,
    color: o.center.color ?? T.RED, align: "center", valign: "middle" });
}
// 双节点双向箭头 + 上/下标签（持续赋能/驱动参与式）
function dualArrowLink(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  const nw = o.nodeW ?? 2.2, nh = o.nodeH ?? 0.55, gapW = o.gapW ?? 1.5;
  [o.l, o.r].forEach((t, i) => {
    const x = o.x + i * (nw + gapW);
    s.addShape("roundRect", { x, y: o.y, w: nw, h: nh, rectRadius: 0.07, fill: { color: fam.main } });
    txt(s, t, { x, y: o.y, w: nw, h: nh, fontSize: o.fs ?? 14, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  });
  const ax = o.x + nw + 0.08;
  s.addShape("leftRightArrow", { x: ax, y: o.y + nh / 2 - 0.08, w: gapW - 0.16, h: 0.16, fill: { color: fam.main } });
  if (o.top) txt(s, o.top, { x: ax - 0.3, y: o.y - 0.32, w: gapW + 0.6, h: 0.26, fontSize: 10.5, bold: true, color: fam.main, align: "center" });
  if (o.bottom) txt(s, o.bottom, { x: ax - 0.3, y: o.y + nh + 0.06, w: gapW + 0.6, h: 0.26, fontSize: 10.5, bold: true, color: fam.main, align: "center" });
}
// 方节点双向粗箭头行（企业师傅↔企业工匠式）
function nodeLinkRow(s, o = {}) {
  const n = o.items.length, gap = o.gap ?? 0.55, w = o.w ?? 1.9, h = o.h ?? 0.6;
  const total = n * w + (n - 1) * gap;
  o.items.forEach((it, i) => {
    const x = o.cx - total / 2 + i * (w + gap);
    const fam = DIA[it.color] ?? DIA.blue;
    s.addShape("roundRect", { x, y: o.cy - h / 2, w, h, rectRadius: 0.07, fill: { color: it.fill ?? fam.fill } });
    txt(s, it.text, { x, y: o.cy - h / 2, w, h, fontSize: o.fs ?? 13.5, bold: true, color: it.tc ?? fam.main, align: "center", valign: "middle" });
    if (i < n - 1) s.addShape("leftRightArrow", { x: x + w + 0.06, y: o.cy - 0.14, w: gap - 0.12, h: 0.28, fill: { color: it.ac ?? fam.main } });
  });
}
// 中心圆 + 卫星圆 + 虚线连线（业态创新内核式）；spokes 角度：90=正上，顺时针
function hubSpokes(s, o = {}) {
  const hub = o.hub, hubFam = DIA[hub.color] ?? DIA.red;
  (o.spokes ?? []).forEach(sp => {
    const fam = DIA[sp.color] ?? DIA.teal;
    const a = rad(sp.angle ?? 0), dist = sp.dist ?? 1.4;
    const x1 = o.cx + (hub.d / 2) * Math.cos(a), y1 = o.cy - (hub.d / 2) * Math.sin(a);
    const x2 = o.cx + (dist - sp.d / 2) * Math.cos(a), y2 = o.cy - (dist - sp.d / 2) * Math.sin(a);
    s.addShape("line", { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: x2 < x1, flipV: y2 < y1, line: { color: fam.main, width: 1, dashType: "dash" } });
  });
  (o.spokes ?? []).forEach(sp => {
    const fam = DIA[sp.color] ?? DIA.teal;
    const a = rad(sp.angle ?? 0), dist = sp.dist ?? 1.4;
    const sx = o.cx + dist * Math.cos(a) - sp.d / 2, sy = o.cy - dist * Math.sin(a) - sp.d / 2;
    s.addShape("ellipse", { x: sx, y: sy, w: sp.d, h: sp.d, fill: { color: fam.main } });
    txt(s, sp.text, { x: sx, y: sy, w: sp.d, h: sp.d, fontSize: sp.fs ?? 12, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.05 });
  });
  s.addShape("ellipse", { x: o.cx - hub.d / 2, y: o.cy - hub.d / 2, w: hub.d, h: hub.d, fill: { color: hubFam.main } });
  txt(s, hub.text, { x: o.cx - hub.d / 2 + 0.1, y: o.cy - hub.d / 2, w: hub.d - 0.2, h: hub.d, fontSize: hub.fs ?? 14, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.15 });
}
// 大虚线圆轨道 + 均布卫星节点（业态创新外圈式）；items 自正点顺时针
function satelliteRing(s, o = {}) {
  const r = o.r;
  s.addShape("ellipse", { x: o.cx - r, y: o.cy - r, w: 2 * r, h: 2 * r, fill: { color: T.WHITE },
    line: { color: o.lineColor ?? T.INK, width: 1, dashType: "dash" } });
  (o.items ?? []).forEach((it, i) => {
    const a = rad(90 - i * (360 / o.items.length));
    const fam = DIA[it.color] ?? DIA.amber;
    const cx = o.cx + r * Math.cos(a), cy = o.cy - r * Math.sin(a);
    s.addShape("ellipse", { x: cx - o.d / 2, y: cy - o.d / 2, w: o.d, h: o.d, fill: { color: it.fill ?? fam.fill } });
    txt(s, it.text, { x: cx - o.d / 2, y: cy - o.d / 2, w: o.d, h: o.d, fontSize: o.fs ?? 15, bold: true, color: it.tc ?? fam.main, align: "center", valign: "middle", lineSpacingMultiple: 1.0 });
  });
}
// 中心循环：淡外圈 + 环形箭头 + 实心内圆
function cycleHub(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  s.addShape("ellipse", { x: o.cx - o.d / 2, y: o.cy - o.d / 2, w: o.d, h: o.d, fill: { color: fam.fill } });
  s.addShape("circularArrow", { x: o.cx - o.d * 0.46, y: o.cy - o.d * 0.46, w: o.d * 0.92, h: o.d * 0.92, fill: { color: fam.main } });
  const d2 = o.d * 0.5;
  s.addShape("ellipse", { x: o.cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fill: { color: fam.main } });
  txt(s, o.text ?? "", { x: o.cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fontSize: o.fs ?? 14, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
}
// 大弧形箭头（双循环外环）；dir: up|down|left|right
function curveArrow(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.amber;
  s.addShape({ up: "curvedUpArrow", down: "curvedDownArrow", left: "curvedLeftArrow", right: "curvedRightArrow" }[o.dir ?? "up"],
    { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: fam.main } });
}
// 底条富文本（支持金色强调）：parts 传 S.rich() 的数组
function calloutBandRich(s, o = {}) {
  const h = o.h ?? 0.7, y = o.y;
  s.addShape("roundRect", { x: o.x ?? 0.7, y, w: o.w ?? (T.W - 1.4), h, rectRadius: 0.07, fill: { color: primary() } });
  s.addText(o.parts ?? [], { x: (o.x ?? 0.7) + 0.3, y, w: (o.w ?? T.W - 1.4) - 0.6, h, fontFace: T.F,
    fontSize: o.fs ?? 17, bold: true, color: T.WHITE, align: "center", valign: "middle", margin: 0 });
}

// ---------- 图解组件 III（图解集页框/花瓣中心/圆柱链/渐变条，来自《材料研究方法》集） ----------
// 图解集页框：左上主题色标题 + 全宽细线 + 右上角标
function pageHeader(s, o = {}) {
  txt(s, o.title ?? "", { x: 0.55, y: 0.26, w: 6, h: 0.45, fontSize: 20, bold: true, color: o.color ?? T.NAVYTXT });
  s.addShape("line", { x: 0.55, y: 0.78, w: T.W - 1.1, h: 0, line: { color: o.color ?? T.NAVYTXT, width: 1.5 } });
  if (o.brand) txt(s, o.brand, { x: T.W - 3.05, y: 0.26, w: 2.5, h: 0.45, fontSize: 20, bold: true, color: o.color ?? T.NAVYTXT, align: "right" });
}
// 实心胶囊链，节点间 ">" 字符分隔
function pillChain(s, o = {}) {
  const n = o.items.length, gap = 0.3, h = o.h ?? 0.52;
  const w = (o.w - (n - 1) * gap) / n;
  o.items.forEach((it, i) => {
    const x = o.x + i * (w + gap);
    const fam = DIA[it.color] ?? DIA[o.color] ?? DIA.blue;
    s.addShape("roundRect", { x, y: o.y, w, h, rectRadius: h / 2, fill: { color: it.fill ?? fam.main } });
    txt(s, it.text ?? it, { x, y: o.y, w, h, fontSize: o.fs ?? 13.5, bold: true, color: it.tc ?? T.WHITE, align: "center", valign: "middle" });
    if (i < n - 1) txt(s, ">", { x: x + w - 0.02, y: o.y, w: gap + 0.04, h, fontSize: o.gfs ?? 16, bold: true, fontFace: T.FL, color: o.gtc ?? fam.main, align: "center", valign: "middle" });
  });
}
// 渐变波浪飘带 + 箭头（双色带交错，右端收箭头；近似参考件的丝带流）
function waveRibbon(s, o = {}) {
  const famA = DIA[o.colorA] ?? DIA.purple, famB = DIA[o.colorB] ?? DIA.steel;
  s.addShape("wave", { x: o.x, y: o.y, w: o.w - 0.5, h: o.h ?? 0.55, fill: { color: famA.fill }, line: { color: famA.main, width: 0.75 } });
  s.addShape("wave", { x: o.x + 0.25, y: o.y + 0.28, w: o.w - 0.55, h: o.h ?? 0.55, fill: { color: famB.fill }, line: { color: famB.main, width: 0.75 } });
  s.addShape("rightArrow", { x: o.x + o.w - 0.75, y: o.y + (o.h ?? 0.55) / 2 - 0.19, w: 0.75, h: 0.38, fill: { color: o.arrowColor ?? famA.main } });
}
// 双环圆图标节点行（节点内 2 字标签，节点间双向箭头）
function iconNodeRow(s, o = {}) {
  const n = o.items.length, d = o.d ?? 1.0, gap = o.gap ?? 0.75;
  const total = n * d + (n - 1) * gap;
  o.items.forEach((it, i) => {
    const cx = o.cx - total / 2 + i * (d + gap) + d / 2;
    const fam = DIA[it.color] ?? DIA.steel;
    s.addShape("ellipse", { x: cx - d / 2, y: o.cy - d / 2, w: d, h: d, fill: { color: T.WHITE }, line: { color: fam.main, width: 1.5 } });
    const d2 = d * 0.74;
    s.addShape("ellipse", { x: cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fill: { color: fam.main } });
    txt(s, it.text, { x: cx - d2 / 2, y: o.cy - d2 / 2, w: d2, h: d2, fontSize: o.fs ?? 13, bold: true, color: T.WHITE, align: "center", valign: "middle" });
    if (i < n - 1 && o.link !== false)
      s.addShape("leftRightArrow", { x: cx + d / 2 + 0.07, y: o.cy - 0.11, w: gap - 0.14, h: 0.22, fill: { color: fam.main } });
  });
}
// 花瓣/六边形中心图：中心 shape + n 个淡色大瓣均布 + 可选编号小圆
function petalHub(s, o = {}) {
  const shape = o.shape === "hexagon" ? "hexagon" : "ellipse";
  const petalShape = o.petalShape ?? "ellipse";
  const n = o.petals.length, hubD = o.hubD ?? 1.7;
  (o.petals ?? []).forEach((p, i) => {
    const a = 90 - i * (360 / n);                 // 数学角：90=正上，顺时针
    const dist = o.dist ?? (hubD / 2 + (p.d ?? 1.55) / 2 + 0.12);
    const fam = DIA[p.color] ?? DIA.teal;
    const px = o.cx + dist * Math.cos(rad(a)), py = o.cy - dist * Math.sin(rad(a));
    const pd = p.d ?? 1.55;
    const shp = { x: px - pd / 2, y: py - pd / 2, w: pd, h: pd, fill: { color: p.fill ?? fam.fill }, line: { color: fam.main, width: 0.75 } };
    if (petalShape === "teardrop") shp.rotate = ((135 - a) % 360 + 360) % 360;  // 尖角指向中心
    s.addShape(petalShape === "teardrop" ? "teardrop" : petalShape, shp);
    txt(s, p.text, { x: px - pd / 2, y: py - pd / 2, w: pd, h: pd, fontSize: p.fs ?? 14, bold: true, color: fam.main, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
    if (p.no) {
      const nd = 0.42;
      const nx = px + pd / 2 * 0.72 - nd / 2, ny = py - pd / 2 * 0.72 - nd / 2;
      s.addShape("ellipse", { x: nx, y: ny, w: nd, h: nd, fill: { color: fam.main } });
      txt(s, p.no, { x: nx, y: ny, w: nd, h: nd, fontSize: 13, bold: true, fontFace: T.FL, color: T.WHITE, align: "center", valign: "middle" });
    }
  });
  const hubFam = DIA[o.color] ?? DIA.teal;
  s.addShape(shape, { x: o.cx - hubD / 2, y: o.cy - hubD / 2, w: hubD, h: hubD, fill: { color: hubFam.main } });
  txt(s, o.text ?? "", { x: o.cx - hubD / 2 + 0.12, y: o.cy - hubD / 2, w: hubD - 0.24, h: hubD, fontSize: o.fs ?? 15, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.2 });
}
// 3D 圆柱编号节点链（01-04 can 竖排字，节间波浪连接）
function cylinderChain(s, o = {}) {
  const n = o.items.length, w = o.w ?? 1.45, h = o.h ?? 2.1, gap = o.gap ?? 0.55;
  const total = n * w + (n - 1) * gap;
  o.items.forEach((it, i) => {
    const x = o.cx - total / 2 + i * (w + gap);
    const fam = DIA[it.color] ?? DIA.purple;
    s.addShape("can", { x, y: o.cy - h / 2, w, h, fill: { color: fam.main } });
    txt(s, [{ text: it.no ?? "", options: { fontSize: 20, bold: true, fontFace: T.FL, color: T.WHITE, breakLine: true } },
            { text: (it.text ?? "").split("").join("\n"), options: { fontSize: o.fs ?? 13, bold: true, color: T.WHITE } }],
      { x: x + w * 0.12, y: o.cy - h / 2 + 0.1, w: w * 0.86, h: h - 0.2, fontFace: T.F, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.08 });
    if (i < n - 1) s.addShape("wave", { x: x + w + 0.04, y: o.cy - 0.26, w: gap - 0.08, h: 0.52, fill: { color: fam.fill } });
  });
}
// 图片卡：顶部叠加色块标题 + 图片/占位
function picCard(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.blue;
  const th = o.th ?? 0.42;
  card(s, o.x, o.y, o.w, o.h, { fill: T.WHITE, line: fam.main, lw: 0.75 });
  if (o.img) s.addImage({ path: o.img, x: o.x + 0.06, y: o.y + th + 0.06, w: o.w - 0.12, h: o.h - th - 0.12, sizing: { type: "cover", w: o.w - 0.12, h: o.h - th - 0.12 } });
  else s.addShape("rect", { x: o.x + 0.06, y: o.y + th + 0.06, w: o.w - 0.12, h: o.h - th - 0.12, fill: { color: T.MIST } });
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: th, rectRadius: 0.05, fill: { color: fam.main } });
  txt(s, o.title ?? "", { x: o.x, y: o.y, w: o.w, h: th, fontSize: o.fs ?? 12.5, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  if (!o.img) txt(s, "图片占位", { x: o.x + 0.06, y: o.y + th + 0.06, w: o.w - 0.12, h: o.h - th - 0.12, fontSize: 10, color: T.MUT, align: "center", valign: "middle" });
}
// 描述卡：色字标题 + 黑色正文，细边框
function descCard(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.teal;
  card(s, o.x, o.y, o.w, o.h, { fill: o.fill ?? T.WHITE, line: fam.main, lw: 0.75 });
  s.addText([
    { text: o.title ?? "", options: { fontSize: o.tfs ?? 14, bold: true, color: fam.main, breakLine: true } },
    { text: o.text ?? "", options: { fontSize: o.fs ?? 12, color: T.BODY } },
  ], { x: o.x + 0.16, y: o.y, w: o.w - 0.32, h: o.h, fontFace: T.F, valign: "middle", margin: 0, lineSpacingMultiple: 1.25, paraSpaceAfter: 4 });
}
// 色头 + 下箭头 + 描述卡 竖列
function headDescCol(s, o = {}) {
  navyTag(s, { x: o.x, y: o.y, w: o.w, text: o.head, h: 0.5, fs: 14 });
  blockArrow(s, { x: o.x + o.w / 2 - 0.14, y: o.y + 0.58, dir: "down", len: 0.34, w: 0.28, color: o.color, solid: false });
  descCard(s, { x: o.x, y: o.y + 1.0, w: o.w, h: o.h ?? 1.3, color: o.color, title: o.title, text: o.text });
}
// 渐变分段横条（由浅到深）
function gradStripRow(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.steel;
  const n = o.items.length, gap = o.gap ?? 0.08;
  const w = (o.w - (n - 1) * gap) / n;
  o.items.forEach((t, i) => {
    const x = o.x + i * (w + gap);
    s.addShape("rect", { x, y: o.y, w, h: o.h ?? 0.55, fill: { color: lerpColor(fam.main, "1F3B6E", n === 1 ? 0 : i / (n - 1)) } });
    txt(s, t, { x, y: o.y, w, h: o.h ?? 0.55, fontSize: o.fs ?? 14, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  });
}
// 通栏编号色带行：左右两个编号圆 + 色带上左/右两段文字（参考件 09 式）
function numBandRow(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.purple;
  const nd = 0.52;
  const bx = o.x + nd + 0.12, bw = o.w - 2 * (nd + 0.12);
  s.addShape("roundRect", { x: bx, y: o.cy - 0.28, w: bw, h: 0.56, rectRadius: 0.06, fill: { color: fam.fill } });
  txt(s, o.text ?? "", { x: bx + 0.3, y: o.cy - 0.28, w: bw * 0.5, h: 0.56, fontSize: o.fs ?? 13.5, bold: true, color: fam.main, valign: "middle" });
  if (o.textR) txt(s, o.textR, { x: bx + bw * 0.5, y: o.cy - 0.28, w: bw * 0.5 - 0.3, h: 0.56, fontSize: o.fs ?? 13.5, bold: true, color: fam.main, align: "right", valign: "middle" });
  s.addShape("ellipse", { x: o.x, y: o.cy - nd / 2, w: nd, h: nd, fill: { color: fam.main } });
  txt(s, o.no ?? "", { x: o.x, y: o.cy - nd / 2, w: nd, h: nd, fontSize: 16, bold: true, fontFace: T.FL, color: T.WHITE, align: "center", valign: "middle" });
  if (o.noR !== false) {
    s.addShape("ellipse", { x: o.x + o.w - nd, y: o.cy - nd / 2, w: nd, h: nd, fill: { color: fam.main } });
    txt(s, o.noR === true ? (o.no ?? "") : (o.noR ?? ""), { x: o.x + o.w - nd, y: o.cy - nd / 2, w: nd, h: nd, fontSize: 16, bold: true, fontFace: T.FL, color: T.WHITE, align: "center", valign: "middle" });
  }
}
// 圆台底座：扁椭圆 + 矩形 + 底椭圆
function podium(s, o = {}) {
  const fam = DIA[o.color] ?? DIA.steel;
  s.addShape("ellipse", { x: o.x, y: o.y, w: o.w, h: o.ellipse ?? 0.5, fill: { color: lerpColor(fam.main, "FFFFFF", 0.55) } });
  s.addShape("rect", { x: o.x + (o.w - (o.innerW ?? o.w * 0.94)) / 2, y: o.y + (o.ellipse ?? 0.5) / 2 - 0.02, w: o.innerW ?? o.w * 0.94, h: o.h ?? 0.3, fill: { color: fam.main } });
  s.addShape("ellipse", { x: o.x + (o.w - (o.innerW ?? o.w * 0.94)) / 2 - 0.04, y: o.y + (o.ellipse ?? 0.5) / 2 + (o.h ?? 0.3) - 0.24, w: (o.innerW ?? o.w * 0.94) + 0.08, h: o.ellipse ?? 0.5, fill: { color: fam.main } });
}

// ---------- 图解组件 IV（竞选/个人答辩风，来自《国家奖学金答辩》集） ----------
const JX = { royal: "3944C9", vivid: "000DB8", peri: "A5AAE9", gold: "F6D671", cream: "F6E6D1" };
// 签名页脚：底部蓝金双层大弧（竞选风每页都有）
function arcFooter(s, o = {}) {
  const royal = o.royal ?? JX.royal, gold = o.gold ?? JX.gold;
  s.addShape("ellipse", { x: -2.2, y: o.y ?? 7.0, w: 17.7, h: 2.3, fill: { color: gold } });
  s.addShape("ellipse", { x: -2.2, y: (o.y ?? 7.0) + 0.1, w: 17.7, h: 2.4, fill: { color: royal } });
}
// 章节文字导航条 + 左上角标（当前章深蓝粗体，其余浅蓝，竖线分隔）
function navBarText(s, o = {}) {
  s.addShape("rect", { x: 0.35, y: 0.32, w: 0.85, h: 0.3, fill: { color: JX.peri } });
  s.addShape("rect", { x: 0.2, y: 0.42, w: 0.85, h: 0.3, fill: { color: JX.royal } });
  const n = o.items.length, cw = (10.8 - 0.3) / n;
  o.items.forEach((t, i) => {
    const x = 1.25 + i * cw, act = i === (o.active ?? 0);
    s.addText(t, { x, y: 0.3, w: cw - 0.15, h: 0.45, fontSize: act ? 17 : 16.5, bold: act,
      color: act ? JX.vivid : JX.peri, fontFace: T.F, align: "left", valign: "middle", margin: 0 });
    if (i < n - 1) s.addText("|", { x: x + cw - 0.22, y: 0.3, w: 0.3, h: 0.45, fontSize: 16, color: JX.peri, align: "center", valign: "middle", margin: 0 });
  });
}
// 照片封面/金句页：右侧照片(占位)、左侧宝蓝底大字标题、信息三列、金弧
function photoCover(s, o = {}) {
  const PW = o.photoW ?? 4.6;
  s.addShape("rect", { x: 0, y: 0, w: T.W, h: T.H, fill: { color: JX.royal } });
  if (o.photo) s.addImage({ path: o.photo, x: T.W - PW, y: 0, w: PW, h: T.H, sizing: { type: "cover", w: PW, h: T.H } });
  else {
    s.addShape("rect", { x: T.W - PW, y: 0, w: PW, h: T.H, fill: { color: lerpColor(JX.royal, "000000", 0.25) } });
    txt(s, "人物照片位", { x: T.W - PW, y: T.H / 2 - 0.3, w: PW, h: 0.6, fontSize: 14, color: T.WHITE, align: "center", transparency: 30 });
  }
  const lines = o.quote ?? [o.title ?? ""];
  const bigRuns = lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1 } }));
  s.addText(bigRuns, { x: 0.7, y: o.quoteY ?? 1.35, w: T.W - PW - 1.2, h: (lines.length) * 1.05, fontSize: o.fs ?? 44, bold: true,
    color: o.titleColor ?? "EFE3C8", fontFace: T.F, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
  if (o.sub) txt(s, o.sub, { x: 0.75, y: (o.quoteY ?? 1.35) + lines.length * 1.05 + 0.15, w: T.W - PW - 1.3, h: 0.5,
    fontSize: 20, bold: true, color: T.WHITE, charSpacing: 2, margin: 0 });
  const infos = o.info ?? [], n = infos.length, cw = 1.9;
  infos.forEach((it, i) => {
    const x = 0.85 + i * cw;
    txt(s, it.label, { x, y: 5.6, w: cw - 0.25, h: 0.4, fontSize: 15, bold: true, color: T.WHITE, align: "center" });
    txt(s, it.value, { x, y: 6.05, w: cw - 0.25, h: 0.4, fontSize: 13, color: T.WHITE, align: "center" });
    if (i < n - 1) s.addShape("line", { x: x + cw - 0.12, y: 5.62, w: 0, h: 0.78, line: { color: T.WHITE, width: 0.75 } });
  });
  arcFooter(s, { y: 6.95 });
}
// 扇形渐变卡目录：卡片渐变蓝→纯 royal 近似，交错微旋转，下方倒影
function tocFan(s, o = {}) {
  txt(s, o.en ?? "CONTENTS", { x: 0, y: 0.75, w: T.W, h: 0.8, fontSize: 44, bold: true, fontFace: T.FL,
    color: "D6DDF3", align: "center", charSpacing: 8, margin: 0 });
  txt(s, o.title ?? "目 录", { x: 0, y: 0.72, w: T.W, h: 0.85, fontSize: 44, bold: true, color: JX.vivid, align: "center", margin: 0 });
  const n = o.items.length, cw = o.cw ?? 2.35, gap = 0.25;
  const total = n * cw + (n - 1) * gap, x0 = (T.W - total) / 2;
  o.items.forEach((it, i) => {
    const x = x0 + i * (cw + gap);
    const rot = (i - (n - 1) / 2) * 1.6, y = 2.55 + Math.abs(i - (n - 1) / 2) * 0.12;
    s.addShape("rect", { x, y: y + 3.15, w: cw, h: 0.55, fill: { color: "E9EDF9" } });
    s.addShape("rect", { x, y, w: cw, h: 3.1, rotate: rot, fill: { color: JX.royal } });
    s.addShape("ellipse", { x: x + cw / 2 - 0.26, y: y + 0.35, w: 0.52, h: 0.52, fill: { color: T.WHITE } });
    txt(s, it.no ?? String(i + 1).padStart(2, "0"), { x: x + cw / 2 - 0.26, y: y + 0.35, w: 0.52, h: 0.52, fontSize: 15, bold: true, fontFace: T.FL, color: JX.royal, align: "center", valign: "middle", margin: 0 });
    txt(s, it.title, { x: x + 0.08, y: y + 1.5, w: cw - 0.16, h: 0.5, fontSize: 17, bold: true, color: T.WHITE, align: "center", margin: 0 });
    txt(s, it.en ?? "", { x: x + 0.05, y: y + 2.05, w: cw - 0.1, h: 0.35, fontSize: 10.5, bold: true, fontFace: T.FL, color: "C9D4F5", align: "center", margin: 0 });
  });
  arcFooter(s, { y: 7.05 });
}
// 渐变大数字分节页：数字双层错位近似渐变 + 竖线 + 标题 + 金句
function sectionGradient(s, o = {}) {
  s.addShape("rect", { x: 0, y: 0, w: T.W, h: T.H, fill: { color: "F7F9FE" } });
  s.addShape("line", { x: o.lineX ?? 4.6, y: 1.5, w: 0, h: 3.6, line: { color: "B9C2D8", width: 1 } });
  const nx = (o.lineX ?? 4.6) - (o.numW ?? 2.9), ny = 2.0;
  txt(s, o.no ?? "01", { x: nx + 0.06, y: ny + 0.06, w: o.numW ?? 2.9, h: 2.0, fontSize: 96, bold: true, fontFace: T.FL, color: "C99AA6", align: "right", margin: 0 });
  txt(s, o.no ?? "01", { x: nx, y: ny, w: o.numW ?? 2.9, h: 2.0, fontSize: 96, bold: true, fontFace: T.FL, color: JX.royal, align: "right", margin: 0 });
  const tx = (o.lineX ?? 4.6) + 0.45;
  txt(s, o.title ?? "", { x: tx, y: 2.0, w: 7.5, h: 0.85, fontSize: 40, bold: true, color: "17171B", fontFace: T.F, margin: 0 });
  s.addShape("rect", { x: tx, y: 3.0, w: 0.75, h: 0.12, fill: { color: JX.royal } });
  s.addShape("rect", { x: tx + 0.75, y: 3.05, w: 6.6, h: 0.06, fill: { color: "B9C6EE" } });
  txt(s, o.en ?? "", { x: tx, y: 3.25, w: 7.5, h: 0.4, fontSize: 16, bold: true, fontFace: T.FL, color: "3A3A44", charSpacing: 4, margin: 0 });
  txt(s, o.quote ?? "", { x: tx, y: 3.85, w: 7.5, h: 0.55, fontSize: 24, bold: true, color: JX.vivid, fontFace: T.F, margin: 0 });
  arcFooter(s, { y: 6.95 });
}
// 大数字强调：标签 + 超大数字 + 描述段
function bigStat(s, o = {}) {
  s.addText([
    { text: o.label ?? "", options: { fontSize: 20, bold: true, color: "1A1A1A", fontFace: T.F } },
    { text: o.number ?? "", options: { fontSize: o.nfs ?? 58, bold: true, color: o.ncolor ?? JX.vivid, fontFace: T.F } },
  ], { x: o.x, y: o.y, w: o.w ?? 5.5, h: 1.15, margin: 0, valign: "middle", align: "left" });
  if (o.desc) txt(s, o.desc, { x: o.x, y: o.y + 1.2, w: o.w ?? 5.5, h: o.dh ?? 1.4, fontSize: 14.5, bold: true, color: "3A3A44", fontFace: T.F, lineSpacingMultiple: 1.35, margin: 0, valign: "top" });
}
// 圆角照片网格（真图或占位）+ 装饰方块
function photoGrid(s, o = {}) {
  (o.deco ?? []).forEach(d => {
    s.addShape("roundRect", { x: d.x, y: d.y, w: d.s ?? 0.7, h: d.s ?? 0.7, rectRadius: 0.12, fill: { color: d.c ?? JX.peri, transparency: d.t ?? 25 } });
  });
  (o.cells ?? []).forEach(c => {
    if (c.img) s.addImage({ path: c.img, x: c.x, y: c.y, w: c.w, h: c.h, rounding: c.round ?? true, sizing: { type: "cover", w: c.w, h: c.h } });
    else {
      s.addShape("roundRect", { x: c.x, y: c.y, w: c.w, h: c.h, rectRadius: 0.18, fill: { color: T.MIST }, line: { color: T.LINE, width: 0.75 } });
      txt(s, "照片占位", { x: c.x, y: c.y, w: c.w, h: c.h, fontSize: 10, color: T.MUT, align: "center", valign: "middle" });
    }
  });
}
// 荣誉列表：红方块 bullet，两列
function honorList(s, o = {}) {
  const cols = o.cols ?? 2, items = o.items ?? [];
  const per = Math.ceil(items.length / cols);
  items.forEach((t, i) => {
    const c = Math.floor(i / per), r = i % per;
    const x = o.x + c * (o.colW ?? 3.6), y = o.y + r * (o.rowH ?? 0.52);
    s.addShape("rect", { x, y: y + 0.12, w: 0.15, h: 0.15, fill: { color: "C00000" } });
    txt(s, t, { x: x + 0.3, y, w: (o.colW ?? 3.6) - 0.4, h: 0.45, fontSize: o.fs ?? 16, bold: true, color: "17171B", fontFace: T.F, margin: 0 });
  });
}
// 荣誉证书展台：倒梯形台 + 金边证书卡 + 桂冠标签
function certPodium(s, o = {}) {
  const w = o.w ?? 2.6, h = o.h ?? 2.1, x = o.x, y = o.y;
  s.addShape("trapezoid", { x: x + w * 0.04, y: y + 0.5, w: w * 0.92, h: h - 0.5, flipV: true, fill: { color: "E8D5EE", transparency: 20 } });
  s.addShape("ellipse", { x: x + w * 0.08, y: y + h - 0.45, w: w * 0.84, h: 0.4, fill: { color: "C9C2E8", transparency: 35 } });
  card(s, x + w * 0.16, y + 0.95, w * 0.68, h * 0.42, { fill: "FFFDF6", line: "C9A86A", lw: 1.25 });
  s.addShape("arc", { x: x + w * 0.2, y: y + 0.02, w: w * 0.6, h: 0.5, line: { color: "3D3D99", width: 2.25 }, angleRange: [180, 360] });
  txt(s, o.title ?? "", { x: x, y: y + 0.05, w, h: 0.4, fontSize: o.fs ?? 14, bold: true, color: "17171B", align: "center", margin: 0 });
}
// 证书放射散布：中央大标题 + 左右两列错层圆角块（近列/远列）
function spreadTags(s, o = {}) {
  txt(s, [
    { text: (o.pre ?? "") + " ", options: { fontSize: 26, bold: true, color: "17171B", fontFace: T.F } },
    { text: o.number ?? "", options: { fontSize: 44, bold: true, color: JX.vivid, fontFace: T.F } },
  ], { x: 0, y: o.titleY ?? 1.1, w: T.W, h: 0.95, align: "center", valign: "middle", margin: 0 });
  const w = o.w ?? 2.35, h = o.h ?? 0.62, step = h + (o.gap ?? 0.38);
  const half = Math.ceil(o.items.length / 2);
  o.items.forEach((t, i) => {
    const side = i < half ? -1 : 1, k = i < half ? i : i - half;
    const x = o.cx + side * 0.45 + (k % 2 ? side * 0.6 : 0) - (side < 0 ? w : 0);
    const y = (o.topY ?? 1.95) + k * step;
    s.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: JX.royal } });
    txt(s, t, { x, y, w, h, fontSize: o.fs ?? 16, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  });
}
// 个人简介卡：浅蓝大卡 + 蓝色标签块两列 + 姓名大字
function kvProfileCard(s, o = {}) {
  card(s, o.x, o.y, o.w, o.h, { fill: "F0F4FE", line: null, r: 0.02 });
  if (o.name) txt(s, o.name, { x: o.x + o.w - 2.6, y: o.y + 0.6, w: 2.2, h: 0.9, fontSize: 40, bold: true, color: JX.royal, align: "center", margin: 0 });
  const rows = o.rows ?? [], half = Math.ceil(rows.length / 2);
  rows.forEach((r, i) => {
    const col = i < half ? 0 : 1, row = i % half;
    const x = o.x + 0.3 + col * ((o.w - 3.1) / 2), y = o.y + 0.28 + row * 0.62;
    const kw = 1.15;
    s.addShape("roundRect", { x, y, w: kw, h: 0.38, rectRadius: 0.05, fill: { color: JX.royal } });
    txt(s, r.k, { x, y: y - 0.01, w: kw, h: 0.38, fontSize: 11.5, bold: true, color: T.WHITE, align: "center", valign: "middle", margin: 0 });
    txt(s, r.v, { x: x + kw + 0.15, y: y - 0.01, w: (o.w - 3.1) / 2 - kw - 0.3, h: 0.38, fontSize: 13.5, bold: true, color: "17171B", valign: "middle", margin: 0 });
  });
}
// 桂冠徽章：上下弧线夹两行字（证书/成绩）
function laurelBadge(s, o = {}) {
  const w = o.w ?? 2.6, h = o.h ?? 1.05, x = o.x, y = o.y;
  s.addShape("arc", { x: x + 0.1, y: y - 0.06, w: w - 0.2, h: 0.5, line: { color: JX.royal, width: 2 }, angleRange: [200, 340] });
  s.addShape("arc", { x: x + 0.1, y: y + h - 0.42, w: w - 0.2, h: 0.5, line: { color: JX.royal, width: 2 }, angleRange: [20, 160] });
  txt(s, [
    { text: o.top ?? "", options: { fontSize: o.tfs ?? 15, bold: true, color: "17171B", fontFace: T.F, breakLine: true } },
    { text: o.bottom ?? "", options: { fontSize: o.bfs ?? 16, bold: true, color: "17171B", fontFace: T.F } },
  ], { x: x + 0.2, y, w: w - 0.4, h, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });
}

// ============ 竞赛路演变体 contest（服务外包/互联网+/挑战杯等大赛答辩） ============
// 来源：用户《服外（答辩改）》服务外包大赛路演 PPT（16 页，fuwai-*.png 参考件）。
// 特征：竞赛 logo 右上角、绿建筑图标+青绿大字页眉、亮蓝渐变结构色、藏青卡头、
//       正文深灰 474747 + 橙/金关键词高亮、虚线分区框、粉彩步骤盒、公式+彩色大数字。
const CON = {
  BLUE: "275DF5",    // 主结构蓝（渐变主色）
  BLUE2: "0F53E0",   // 深一档蓝（渐变深端）
  NAVY: "2E54A1",    // 藏青（小标签/说明条/正文强调）
  NAVYBAR: "0352BF", // 卡头深蓝条
  CYAN: "4BD1FB",    // 渐变浅端/高光青
  TEAL: "30C0B4",    // 主题青绿（accent5）
  TEALD: "19605C",   // 页眉标题字色（TEAL lumMod50）
  GREEN: "75BD42",   // 主题绿（accent4，图标/chevron）
  ORANGE: "EE822F",  // 强调橙（accent2，正文高亮/收尾金句）
  GOLD: "F2BA02",    // 金（accent3，大数字/装饰）
  GOLDD: "D2A517",   // 深金（正文金色高亮）
  RED: "E54C5E",     // 强调红（accent6）
  INK: "474747",     // 正文深灰（本变体正文不用纯黑）
  MUT: "7A828E",     // 弱文字
  MIST: "E2E4EA",    // 灰胶囊
  ARROW: "B2CDE2",   // 浅蓝箭头
  PILL: "C7D8D9",    // 白胶囊描边
  CREAM: "FCE6D5",   // 封面奶油胶囊
  CREAMLN: "C8894A", // 奶油胶囊描边
  PINK: "FCE5E8", CYANP: "99E6F0", PURP: "FEF5FF", CREAMP: "FFF4E3",
  BLUP: "EDF7FF", GRNP: "F0FAF0",             // 粉彩底（步骤盒/软色块）
  DEEP: "1F4E79",    // 深海军蓝（信息卡标题）
  STRIP: ["FF0000", "FFC000", "92D050"],      // 封面三色条（大赛红黄绿）
};
// 竞赛变体字体（机器缺字体时 PowerPoint 自动回退，观感略变——交付说明里提醒）
const CF = {
  disp: "汉仪雅酷黑 65W",   // 大副标题/能力标题（回退微软雅黑加粗）
  zong: "汉仪综艺体简",     // 口号字（回退雅酷黑）
  cal: "汉仪尚巍手书W",     // 书法主标（回退华文行楷）
  xk: "华文行楷",           // 行楷（收尾金句）
  song: "方正小标宋简体",   // 公文宋标题（回退华文中宋）
  zsong: "华文中宋",        // 中宋（卡片标题/引导句）
  kai: "华文楷体",          // 楷体引言（团队介绍/斜体标签）
  ft: "Times New Roman",    // 公式/Step 编号
};
// 文本估宽（英寸）： contestHeader 排 chevron、tagRow 自适应用
function measure(str, fs) {
  let w = 0;
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    w += (c > 0x2e7f ? 1.02 : /[iIl.,:;!|'"()\[\] ]/.test(ch) ? 0.34 : 0.56) * fs;
  }
  return w / 72;
}
// 线性渐变矩形（pptxgenjs 不支持渐变填充，用 lerp 色阶竖切片模拟；宽件几乎无色带感）
function gradRect(s, x, y, w, h, c1, c2, o = {}) {
  const n = o.n ?? Math.max(8, Math.round(w / 0.1));
  for (let i = 0; i < n; i++)
    s.addShape("rect", { x: x + (i * w) / n, y, w: w / n + 0.006, h,
      fill: { color: lerpColor(c1, c2, n === 1 ? 0 : i / (n - 1)), transparency: o.ty ?? 0 } });
}
// 渐变胶囊：两端圆帽用深端纯色，中段渐变
function gradPill(s, x, y, w, h, c1, c2, o = {}) {
  const r = h / 2;
  s.addShape("roundRect", { x, y, w, h, rectRadius: r, fill: { color: c2 } });
  gradRect(s, x + r * 0.9, y, Math.max(w - r * 1.8, 0.01), h, c1, c2, { n: o.n });
  if (o.line) s.addShape("roundRect", { x, y, w, h, rectRadius: r, fill: { color: c2, transparency: 100 }, line: { color: o.line, width: o.lw ?? 1 } });
}
// 简笔绿建筑图标（页眉用；有真图标可传 contestHeader.icon 路径）
function buildingIcon(s, x, y, h, color) {
  const u = h / 10;
  s.addShape("rect", { x: x + u * 0.6, y: y + u, w: u * 3.4, h: u * 9, fill: { color } });
  s.addShape("rect", { x: x + u * 4.4, y: y + u * 3.6, w: u * 2.4, h: u * 6.4, fill: { color: lerpColor(color, "FFFFFF", 0.35) } });
  s.addShape("rect", { x: x + u * 7.2, y: y + u * 5.6, w: u * 1.8, h: u * 4.4, fill: { color } });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++)
    s.addShape("rect", { x: x + u * (1.3 + c * 1.4), y: y + u * (2.1 + r * 2.1), w: u * 0.8, h: u * 1.1, fill: { color: T.WHITE } });
  s.addShape("rect", { x: x + u * 5.0, y: y + u * 4.6, w: u * 1.2, h: u * 1.0, fill: { color: T.WHITE } });
  s.addShape("rect", { x: x - u * 0.4, y: y + u * 9.7, w: u * 10, h: u * 0.35, fill: { color } });
}
// 页眉：绿建筑图标 + 青绿大字标题（带投影）+ 绿色双 chevron；title 支持「核心技术一｜xxx」
function contestHeader(s, o = {}) {
  const y = o.y ?? 0.1, h = o.h ?? 0.57, fs = o.fs ?? 24;
  if (o.icon) s.addImage({ path: o.icon, x: o.ix ?? 0.27, y, w: h, h });
  else buildingIcon(s, o.ix ?? 0.27, y + 0.02, h - 0.04, o.iconColor ?? CON.GREEN);
  const tx = o.tx ?? 0.98;
  txt(s, o.title ?? "", { x: tx, y: y - 0.04, w: 9.4, h: h + 0.08, fontSize: fs, bold: true, color: o.tc ?? CON.TEALD,
    shadow: { type: "outer", angle: 90, blur: 2.5, offset: 1.8, color: lerpColor(CON.TEAL, "FFFFFF", 0.45), opacity: 0.55 } });
  const chx = tx + measure(o.title ?? "", fs) + 0.16, chy = y + h / 2 - 0.16;
  s.addShape("chevron", { x: chx, y: chy, w: 0.3, h: 0.32, fill: { color: o.cc ?? CON.GREEN } });
  s.addShape("chevron", { x: chx + 0.16, y: chy, w: 0.3, h: 0.32, fill: { color: lerpColor(o.cc ?? CON.GREEN, "FFFFFF", 0.45) } });
  if (o.logo || o.brand1) logoCorner(s, o);
}
// 右上角 logo + 两行品牌字
function logoCorner(s, o = {}) {
  const x = o.lx ?? 10.34, y = o.ly ?? 0.06;
  if (o.logo) s.addImage({ path: o.logo, x, y, w: 0.73, h: 0.73, sizing: { type: "contain", w: 0.73, h: 0.73 } });
  if (o.brand1) txt(s, o.brand1, { x: x + 0.72, y: y + 0.03, w: 2.2, h: 0.32, fontSize: 13, bold: true, color: CON.INK });
  if (o.brand2) txt(s, o.brand2, { x: x + 0.72, y: y + 0.36, w: 2.2, h: 0.32, fontSize: 13, bold: true, color: CON.INK });
}
// 页引导句（居中加粗，rich 高亮关键词）
function pageLead(s, o = {}) {
  txt(s, o.parts ?? o.text ?? "", { x: o.x ?? 0.54, y: o.y ?? 0.8, w: o.w ?? T.W - 1.08, h: o.h ?? 0.5,
    fontSize: o.fs ?? 17, bold: true, color: o.color ?? CON.INK, align: "center", valign: "middle" });
}
// 底纹理：极浅几何碎片（模拟原版建筑线稿水印；整页铺底可选）
function bgContest(s) {
  s.addShape("rect", { x: 0, y: 0, w: T.W, h: T.H, fill: { color: "F9FAFC" } });
  s.addShape("parallelogram", { x: 9.4, y: -0.7, w: 4.4, h: 2.3, rotate: 18, fill: { color: T.PALE, transparency: 45 } });
  s.addShape("rect", { x: 11.7, y: 1.5, w: 2.2, h: 2.2, rotate: 18, fill: { color: T.PALE, transparency: 35 } });
  s.addShape("parallelogram", { x: -1.3, y: 5.5, w: 4.0, h: 2.2, rotate: 15, fill: { color: T.PALE, transparency: 50 } });
}
// 小节胶囊：浅渐变圆角条 + 白方块描边 bullet + 藏青粗体（slide2「国家政策驱动」）
function sectionPill(s, o = {}) {
  const w = o.w ?? 3.83, h = o.h ?? 0.47;
  gradPill(s, o.x, o.y, w, h, CON.BLUE, "F2F5FA", { line: CON.ARROW, lw: 0.75 });
  s.addShape("rect", { x: o.x + 0.16, y: o.y + h / 2 - 0.08, w: 0.16, h: 0.16, fill: { color: T.WHITE }, line: { color: CON.BLUE, width: 2.25 } });
  txt(s, o.text, { x: o.x + 0.44, y: o.y, w: w - 0.6, h, fontSize: o.fs ?? 18, bold: true, color: o.tc ?? CON.NAVY, valign: "middle" });
}
// 勾选胶囊行：白勾选框 + 渐变蓝胶囊 + 加粗斜体（slide2 政策清单）
function checkPills(s, o = {}) {
  (o.items ?? []).forEach((t, i) => {
    const y = o.y + i * (o.dy ?? 0.62);
    s.addShape("rect", { x: o.x, y: y + 0.04, w: 0.32, h: 0.32, fill: { color: T.WHITE }, line: { color: CON.PILL, width: 1.25 } });
    txt(s, "✓", { x: o.x, y: y + 0.04, w: 0.32, h: 0.32, fontSize: 14, bold: true, color: CON.MUT, align: "center", valign: "middle" });
    const pw = o.pw ?? measure(t, o.fs ?? 15) + 0.7;
    gradPill(s, o.x + 0.46, y, pw, 0.4, CON.BLUE2, CON.BLUE);
    txt(s, t, { x: o.x + 0.46, y, w: pw, h: 0.4, fontSize: o.fs ?? 15, bold: true, italic: true, color: T.WHITE, align: "center", valign: "middle" });
  });
}
// 虚线框引言/结论：dashed 圆角框 + 粗体 rich（slide2/10/11 顶部导语）
function dashCallout(s, o = {}) {
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.1, fill: { color: o.fill ?? T.WHITE, transparency: o.fty ?? 0 },
    line: { color: o.color ?? CON.BLUE, width: o.lw ?? 1.5, dashType: "dash" } });
  txt(s, o.parts ?? o.text ?? "", { x: o.x + 0.28, y: o.y, w: o.w - 0.56, h: o.h, fontSize: o.fs ?? 15, bold: true,
    color: o.tc ?? CON.INK, align: o.align ?? "center", valign: "middle", lineSpacingMultiple: 1.3 });
}
// 页底横幅：全宽渐变带 + 白粗体（slide3）
function bottomBanner(s, o = {}) {
  const y = o.y ?? 6.6, h = o.h ?? 0.68;
  gradRect(s, 0, y, T.W, h, o.c1 ?? CON.NAVY, o.c2 ?? CON.BLUE);
  txt(s, o.parts ?? o.text ?? "", { x: 0.8, y, w: T.W - 1.6, h, fontSize: o.fs ?? 17, bold: true, color: T.WHITE, align: "center", valign: "middle" });
}
// 页底灯泡结论条：淡蓝底 + 青绿圆灯泡 + 深灰粗体（slide12）
function bulbCallout(s, o = {}) {
  const y = o.y ?? 6.85, h = o.h ?? 0.5;
  s.addShape("rect", { x: 0, y, w: T.W, h, fill: { color: CON.BLUP } });
  s.addShape("ellipse", { x: 0.35, y: y + h / 2 - 0.17, w: 0.34, h: 0.34, fill: { color: CON.TEAL } });
  s.addShape("ellipse", { x: 0.44, y: y + h / 2 - 0.12, w: 0.16, h: 0.16, fill: { color: T.WHITE } });
  s.addShape("rect", { x: 0.49, y: y + h / 2 + 0.06, w: 0.06, h: 0.07, fill: { color: T.WHITE } });
  txt(s, o.text ?? "", { x: 0.85, y, w: T.W - 1.1, h, fontSize: o.fs ?? 13.5, bold: true, color: CON.INK, valign: "middle" });
}
// 页底标签胶囊行（slide6「产品能力基础/系统关键能力/...」四段脚标）
function footPills(s, o = {}) {
  const items = o.items ?? [], n = items.length, gap = o.gap ?? 0.35;
  const w = (o.w ?? T.W - 0.8) / n;
  items.forEach((t, i) => {
    const x = (o.x ?? 0.4) + i * (w + gap);
    gradPill(s, x, o.y, w, o.h ?? 0.5, o.c1 ?? "D9DCF2", o.c2 ?? T.WHITE);
    txt(s, t, { x, y: o.y, w, h: o.h ?? 0.5, fontSize: o.fs ?? 16, bold: true, color: o.tc ?? CON.NAVY, align: "center", valign: "middle" });
  });
}
// 灰标签胶囊行（返回行尾 x；不自动换行，超宽请分两行调用）
function tagPills(s, o = {}) {
  const items = o.items ?? [], n = items.length, gap = o.gap ?? 0.12;
  const w = (o.w - (n - 1) * gap) / n;
  items.forEach((t, i) => {
    const x = o.x + i * (w + gap);
    s.addShape("roundRect", { x, y: o.y, w, h: o.h ?? 0.32, rectRadius: (o.h ?? 0.32) / 2, fill: { color: o.fill ?? CON.MIST } });
    txt(s, t, { x, y: o.y, w, h: o.h ?? 0.32, fontSize: o.fs ?? 10.5, color: o.tc ?? CON.INK, align: "center", valign: "middle" });
  });
  return o.x + o.w;
}
// 痛点/特性四联卡之一：白卡 + 渐变藏青圆角卡头 + 图位 + 标签行 + rich 正文
function painCard(s, o = {}) {
  const { x, y, w, h } = o;
  card(s, x, y, w, h, { fill: T.WHITE, line: T.LINE, lw: 0.75, r: 0.05 });
  const hh = o.hh ?? 0.42;
  gradRect(s, x + 0.12, y + 0.1, w - 0.24, hh, CON.NAVY, CON.BLUE);
  s.addShape("roundRect", { x: x + 0.12, y: y + 0.1, w: w - 0.24, h: hh, rectRadius: 0.09, fill: { color: CON.NAVY, transparency: 100 }, line: { color: CON.NAVY, width: 0.75 } });
  txt(s, o.title ?? "", { x: x + 0.12, y: y + 0.1, w: w - 0.24, h: hh, fontSize: 14.5, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  const iy = y + 0.1 + hh + 0.12, ih = o.ih ?? 1.5;
  if (o.img) s.addImage({ path: o.img, x: x + 0.15, y: iy, w: w - 0.3, h: ih, sizing: { type: "cover", w: w - 0.3, h: ih } });
  else imgPlaceholder(s, { x: x + 0.15, y: iy, w: w - 0.3, h: ih, caption: o.imgCap ?? "配图（替换素材）" });
  let ty = iy + ih + 0.12;
  if (o.tags && o.tags.length) { tagPills(s, { x: x + 0.12, y: ty, w: w - 0.24, items: o.tags, fs: 10 }); ty += (o.tagH ?? 0.44); }
  txt(s, o.parts ?? o.text ?? "", { x: x + 0.18, y: ty, w: w - 0.36, h: Math.max(y + h - ty - 0.1, 0.4), fontSize: o.fs ?? 10.5, color: CON.INK, valign: "top", lineSpacingMultiple: 1.22 });
}
// 编号卡：白卡 + 渐变蓝编号方块 + 藏青粗体标题 + rich 正文（slide4 中列 01-04）
function numCard(s, o = {}) {
  const { x, y, w, h } = o;
  card(s, x, y, w, h, { fill: T.WHITE, line: lerpColor(CON.RED, "FFFFFF", 0.72), lw: 1, r: 0.08 });
  const ns = 0.5, nx = x + 0.16, ny = y + 0.16;
  gradRect(s, nx, ny, ns, ns, CON.BLUE2, CON.CYAN);
  txt(s, o.no ?? "01", { x: nx, y: ny, w: ns, h: ns, fontSize: 17, bold: true, fontFace: T.FL, color: T.WHITE, align: "center", valign: "middle" });
  txt(s, o.title ?? "", { x: nx + ns + 0.14, y: ny - 0.02, w: w - ns - 0.5, h: ns + 0.04, fontSize: o.tfs ?? 15, bold: true, color: CON.NAVY, valign: "middle" });
  txt(s, o.parts ?? o.text ?? "", { x: x + 0.2, y: ny + ns + 0.08, w: w - 0.4, h: Math.max(y + h - ny - ns - 0.2, 0.4), fontSize: o.fs ?? 10.5, color: CON.INK, valign: "top", lineSpacingMultiple: 1.22 });
}
// 青绿片头卡：白卡 + 居中青绿芯片头 + 正文（slide4 右列「数据层响应」）
function tealHeadCard(s, o = {}) {
  const { x, y, w, h } = o;
  card(s, x, y, w, h, { fill: T.WHITE, line: T.LINE, lw: 0.75, r: 0.08 });
  const cw = o.cw ?? w * 0.62, ch = o.ch ?? 0.4;
  s.addShape("roundRect", { x: x + (w - cw) / 2, y: y + 0.12, w: cw, h: ch, rectRadius: 0.06, fill: { color: o.color ?? lerpColor(CON.TEAL, "FFFFFF", 0.62) } });
  txt(s, o.head ?? "", { x: x + (w - cw) / 2, y: y + 0.12, w: cw, h: ch, fontSize: 14.5, bold: true, color: o.tc ?? CON.TEALD, align: "center", valign: "middle" });
  txt(s, o.parts ?? o.text ?? "", { x: x + 0.22, y: y + 0.12 + ch + 0.08, w: w - 0.44, h: Math.max(h - ch - 0.34, 0.4), fontSize: o.fs ?? 12, color: CON.INK, align: o.align ?? "center", valign: "middle", lineSpacingMultiple: 1.25 });
}
// 角色卡：图标 + 彩色标题 + 正文（slide4 左列「管理人员/运维人员/平台使用者」）
function personaCard(s, o = {}) {
  const { x, y, w, h } = o;
  card(s, x, y, w, h, { fill: T.WHITE, line: T.LINE, lw: 0.75, r: 0.12 });
  if (o.icon) s.addImage({ path: o.icon, x: x + 0.14, y: y + 0.2, w: o.d ?? 0.9, h: o.d ?? 0.9 });
  else imgPlaceholder(s, { x: x + 0.14, y: y + 0.2, w: o.d ?? 0.9, h: o.d ?? 0.9, caption: "图标" });
  txt(s, o.title ?? "", { x: x + (o.d ?? 0.9) + 0.28, y: y + 0.14, w: w - (o.d ?? 0.9) - 0.4, h: 0.4, fontSize: o.tfs ?? 16, bold: true, color: o.color ?? CON.BLUE });
  txt(s, o.text ?? "", { x: x + (o.d ?? 0.9) + 0.28, y: y + 0.56, w: w - (o.d ?? 0.9) - 0.42, h: Math.max(h - 0.7, 0.4), fontSize: o.fs ?? 10.5, color: CON.INK, valign: "top", lineSpacingMultiple: 1.2 });
}
// 三段式栏头：灰渐变圆角条 + 浅蓝箭头（slide4「业务场景→核心需求→系统响应」）
function triColHeaders(s, o = {}) {
  const titles = o.titles ?? [], n = titles.length, gap = o.gap ?? 0.9;
  const w = ((o.w ?? T.W - 1.0) - (n - 1) * gap) / n;
  titles.forEach((t, i) => {
    const x = (o.x ?? 0.5) + i * (w + gap);
    gradPill(s, x, o.y, w, o.h ?? 0.5, o.c1 ?? T.GREY, o.c2 ?? "FFFFFF", { line: CON.PILL, lw: 0.75 });
    txt(s, t, { x, y: o.y, w, h: o.h ?? 0.5, fontSize: o.fs ?? 17, bold: true, color: o.tc ?? CON.INK, align: "center", valign: "middle" });
    if (i < n - 1) s.addShape("rightArrow", { x: x + w + gap / 2 - 0.35, y: o.y + (o.h ?? 0.5) / 2 - 0.11, w: 0.7, h: 0.22, fill: { color: CON.ARROW } });
  });
  return { colW: w, gap, y2: o.y + (o.h ?? 0.5) };
}
// 虚线分区列 + 深蓝头条（slide5 可行性三区；返回内容区起点）
function dashColumn(s, o = {}) {
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.08, fill: { color: o.fill ?? T.WHITE, transparency: o.fty ?? 0 },
    line: { color: o.lc ?? CON.INK, width: 1.25, dashType: "dash" } });
  const bh = o.bh ?? 0.42, bw = o.bw ?? o.w * 0.62;
  s.addShape("rect", { x: o.x + (o.w - bw) / 2, y: o.y + (o.by ?? 0.18), w: bw, h: bh, fill: { color: o.hc ?? CON.NAVYBAR } });
  txt(s, o.title ?? "", { x: o.x + (o.w - bw) / 2, y: o.y + (o.by ?? 0.18), w: bw, h: bh, fontSize: o.hfs ?? 15, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  return { x: o.x + 0.18, y: o.y + (o.by ?? 0.18) + bh + 0.14, w: o.w - 0.36, h: o.h - bh - (o.by ?? 0.18) - 0.3 };
}
// 白描边指标胶囊网格（slide5「≥1000条能耗数据」）
function metricPills(s, o = {}) {
  const items = o.items ?? [], cols = o.cols ?? 2, gap = o.gap ?? 0.14;
  const w = (o.w - (cols - 1) * gap) / cols, h = o.h ?? 0.34;
  items.forEach((t, i) => {
    const x = o.x + (i % cols) * (w + gap), y = o.y + Math.floor(i / cols) * (h + gap);
    s.addShape("roundRect", { x, y, w, h, rectRadius: 0.05, fill: { color: T.WHITE }, line: { color: CON.PILL, width: 1 } });
    txt(s, t, { x, y, w, h, fontSize: o.fs ?? 12, bold: true, color: CON.INK, align: "center", valign: "middle" });
  });
  return o.y + Math.ceil(items.length / cols) * (h + gap);
}
// 大金数字：藏青说明胶囊 + 44pt 金色数字（slide5「30%/50%」）
function bigGold(s, o = {}) {
  const w = o.w ?? 3.0, cw = o.cw ?? w - 0.3;
  gradPill(s, o.x + (w - cw) / 2, o.y, cw, 0.4, CON.NAVY, CON.BLUE);
  txt(s, o.caption ?? "", { x: o.x + (w - cw) / 2, y: o.y, w: cw, h: 0.4, fontSize: 13.5, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  txt(s, o.number ?? "", { x: o.x, y: o.y + 0.44, w, h: o.h ?? 0.85, fontSize: o.fs ?? 44, bold: true, color: o.color ?? CON.GOLDD, align: "center", valign: "middle" });
}
// 渐变纵板：淡蓝底 + 加粗编号行 + 藏青圆角说明条（slide6「数据治理基础」）
function gradPanel(s, o = {}) {
  const { x, y, w, h } = o, ch = o.ch ?? 0.44, n = 12;
  for (let i = 0; i < n; i++)
    s.addShape("rect", { x, y: y + (i * h) / n, w, h: h / n + 0.006, fill: { color: lerpColor(o.c1 ?? "D9E7FA", "FFFFFF", i / (n - 1)) } });
  const lines = o.lines ?? [], lh = (h - ch - 0.24) / Math.max(lines.length, 1);
  lines.forEach((t, i) => txt(s, t, { x: x + 0.16, y: y + 0.12 + i * lh, w: w - 0.32, h: lh, fontSize: o.fs ?? 11, bold: true, color: CON.INK, valign: "middle", lineSpacingMultiple: 1.12 }));
  s.addShape("roundRect", { x: x + 0.06, y: y + h - ch, w: w - 0.12, h: ch, rectRadius: 0.2, fill: { color: CON.NAVY } });
  txt(s, o.caption ?? "", { x: x + 0.06, y: y + h - ch, w: w - 0.12, h: ch, fontSize: 13.5, bold: true, color: T.WHITE, align: "center", valign: "middle" });
}
// 能力盒：渐变蓝标题条 + 白色内卡 + 可选侧标（slide6「查询统计能力」）
function capBox(s, o = {}) {
  const { x, y, w, h } = o, th = o.th ?? 0.4;
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color: o.fill ?? "D6E4F5" } });
  gradRect(s, x + 0.14, y + 0.1, w - 0.28, th, CON.BLUE2, CON.BLUE);
  txt(s, o.title ?? "", { x: x + 0.14, y: y + 0.1, w: w - 0.28, h: th, fontSize: o.tfs ?? 15, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  const iy = y + th + 0.2, ih = h - th - 0.34;
  s.addShape("rect", { x: x + 0.2, y: iy, w: w - 0.4, h: ih, fill: { color: T.WHITE }, line: { color: lerpColor(CON.NAVY, "FFFFFF", 0.5), width: 0.75 } });
  txt(s, o.text ?? "", { x: x + 0.32, y: iy, w: w - 0.64, h: ih, fontSize: o.fs ?? 10.5, bold: true, color: CON.INK, valign: "middle", lineSpacingMultiple: 1.2 });
  return iy + ih;
}
// 辐射中心：白环 + 渐变主圆 + 青高光 + 卫星圆组（卫星传绝对 x,y）+ 产品胶囊（slide6）
function hubRadial(s, o = {}) {
  const cx = o.cx, cy = o.cy, d = o.d ?? 1.5;
  const ball = (bx, by, bd, lines, fs) => {
    s.addShape("ellipse", { x: bx - bd / 2 - 0.05, y: by - bd / 2 - 0.05, w: bd + 0.1, h: bd + 0.1, fill: { color: T.WHITE } });
    s.addShape("ellipse", { x: bx - bd / 2, y: by - bd / 2, w: bd, h: bd, fill: { color: CON.BLUE } });
    s.addShape("ellipse", { x: bx - bd * 0.3, y: by - bd * 0.4, w: bd * 0.6, h: bd * 0.42, fill: { color: CON.CYAN, transparency: 55 } });
    txt(s, lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1 } })),
      { x: bx - bd / 2, y: by - bd / 2, w: bd, h: bd, fontSize: fs, bold: true, color: T.WHITE, align: "center", valign: "middle", lineSpacingMultiple: 1.05 });
  };
  ball(cx, cy, d, o.titleLines ?? [o.title ?? ""], o.fs ?? 19);
  (o.sats ?? []).forEach(st => ball(st.x, st.y, st.d ?? 0.92, st.lines, st.fs ?? 11.5));
  if (o.product) {
    const pw = o.pw ?? 1.7, px = o.pX ?? cx + d / 2 + 1.1;
    gradPill(s, px, cy - 0.23, pw, 0.46, CON.CYAN, CON.BLUE);
    txt(s, o.product, { x: px, y: cy - 0.23, w: pw, h: 0.46, fontSize: 16, bold: true, color: T.WHITE, align: "center", valign: "middle" });
    s.addShape("line", { x: cx + d / 2 + 0.1, y: cy, w: Math.max(px - cx - d / 2 - 0.18, 0.2), h: 0, line: { color: CON.BLUE, width: 2.5, endArrowType: "triangle" } });
  }
}
// 架构横幅：渐变带 + 两侧深色燕尾翼 + 白粗体（slide7「前端交互——业务展示层」）
function archBanner(s, o = {}) {
  const y = o.y, h = o.h ?? 0.5, x = o.x ?? 0.55, w = o.w ?? T.W - 1.1;
  s.addShape("parallelogram", { x: x - 0.3, y, w: 0.55, h, flipH: true, fill: { color: lerpColor(CON.NAVY, "FFFFFF", 0.45) } });
  s.addShape("parallelogram", { x: x + w - 0.25, y, w: 0.55, h, fill: { color: lerpColor(CON.NAVY, "FFFFFF", 0.45) } });
  gradRect(s, x, y, w, h, o.c1 ?? CON.NAVY, o.c2 ?? CON.BLUE);
  txt(s, o.text ?? "", { x, y, w, h, fontSize: o.fs ?? 16, bold: true, color: T.WHITE, align: "center", valign: "middle" });
}
// 截图横排：字距拉开标题行（丨分隔）+ 截图行（返回底部 y）
function shotStrip(s, o = {}) {
  const caps = o.captions ?? [], n = caps.length, gap = o.gap ?? 0.3;
  const w = (o.w - (n - 1) * gap) / n;
  caps.forEach((c, i) => {
    const x = o.x + i * (w + gap);
    txt(s, c.split("").join(" "), { x, y: o.y, w, h: 0.34, fontSize: 13, bold: true, color: CON.INK, align: "center" });
    if (i < n - 1) txt(s, "丨", { x: x + w - 0.06, y: o.y, w: gap + 0.12, h: 0.34, fontSize: 13, bold: true, color: CON.INK, align: "center" });
  });
  const iy = o.y + 0.42, ih = o.ih ?? 1.7;
  (o.imgs ?? []).forEach((im, i) => {
    const x = o.x + i * (w + gap);
    if (im) s.addImage({ path: im, x, y: iy, w, h: ih, sizing: { type: "cover", w, h: ih } });
    else imgPlaceholder(s, { x, y: iy, w, h: ih, caption: "界面截图（替换素材）" });
  });
  return iy + ih;
}
// 步骤虚线盒：「StepN:标题」黑粗头 + dashed 框（返回内容区；fill 传 CON 粉彩底）
function stepBox(s, o = {}) {
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.06, fill: { color: o.fill ?? T.WHITE, transparency: o.fty ?? 0 },
    line: { color: o.lc ?? CON.INK, width: 1.25, dashType: "sysDash" } });
  txt(s, [{ text: (o.step ?? "Step") + ":", options: { fontFace: CF.ft, bold: true } }, { text: o.title ?? "", options: {} }],
    { x: o.x + 0.18, y: o.y + 0.07, w: o.w - 0.36, h: 0.38, fontSize: 15.5, bold: true, color: CON.INK });
  return { x: o.x + 0.15, y: o.y + 0.5, w: o.w - 0.3, h: o.h - 0.6 };
}
// 粉彩软色块（步骤盒内的小底块/图示底）
function softBox(s, o = {}) {
  s.addShape("rect", { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: o.fill ?? CON.PINK }, line: o.line ? { color: o.line, width: 1 } : undefined });
  txt(s, o.parts ?? o.text ?? "", { x: o.x + 0.05, y: o.y, w: o.w - 0.1, h: o.h, fontSize: o.fs ?? 11, bold: o.bold ?? false, color: o.tc ?? CON.INK, align: "center", valign: "middle", lineSpacingMultiple: 1.15 });
}
// 彩边胶囊标签（流程支线：缺失值填补/非法值修正式）
function flowTag(s, o = {}) {
  const h = o.h ?? 0.38;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h, rectRadius: h / 2, fill: { color: o.fill ?? T.WHITE }, line: { color: o.color ?? CON.BLUE, width: 1.5 } });
  txt(s, o.text ?? "", { x: o.x, y: o.y, w: o.w, h, fontSize: o.fs ?? 12.5, bold: true, color: o.color ?? CON.BLUE, align: "center", valign: "middle" });
}
// 淡蓝信息卡 + 深海军蓝标题（slide9 四联卡；返回内容区）
function infoCard(s, o = {}) {
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.1, fill: { color: o.fill ?? CON.BLUP } });
  txt(s, o.title ?? "", { x: o.x + 0.2, y: o.y + 0.1, w: o.w - 0.4, h: 0.4, fontSize: o.tfs ?? 16, bold: true, color: o.tc ?? CON.DEEP, fontFace: o.tf ?? CF.zsong });
  return { x: o.x + 0.2, y: o.y + 0.56, w: o.w - 0.4, h: o.h - 0.66 };
}
// 白描边小标签行，丨分隔（slide9「电力能耗丨空调能耗丨温湿度丨设备状态」）
function tagRow(s, o = {}) {
  let x = o.x; const fs = o.fs ?? 13, h = o.h ?? 0.34;
  (o.items ?? []).forEach((t, i) => {
    const w = measure(t, fs) + 0.26;
    s.addShape("roundRect", { x, y: o.y, w, h, rectRadius: 0.04, fill: { color: T.WHITE }, line: { color: o.line ?? CON.MUT, width: 1 } });
    txt(s, t, { x, y: o.y, w, h, fontSize: fs, color: CON.INK, align: "center", valign: "middle" });
    x += w;
    if (i < o.items.length - 1) { txt(s, "丨", { x, y: o.y, w: 0.22, h, fontSize: fs, color: CON.INK, align: "center", valign: "middle" }); x += 0.22; }
  });
  return x;
}
// 公式行：楷体斜粗标签 + Times 斜体公式（labelColor 常用 CON.RED/BLUE/NAVY）
function formulaLine(s, o = {}) {
  txt(s, [
    { text: o.label ?? "", options: { fontFace: o.lf ?? CF.kai, italic: true, bold: true, color: o.lc ?? CON.RED } },
    { text: o.formula ? "  " + o.formula : "", options: { fontFace: CF.ft, italic: true, fontSize: (o.fs ?? 13) + 1, color: o.fc ?? CON.INK } },
  ], { x: o.x, y: o.y, w: o.w, h: o.h ?? 0.36, fontSize: o.fs ?? 13, valign: "middle" });
}
// 公式支撑卡：白圆角卡 + 中宋标题 + N 列「标签+公式 + 达到 X% 大数字」（slide10 底条）
function formulaCard(s, o = {}) {
  card(s, o.x, o.y, o.w, o.h, { fill: T.WHITE, line: T.LINE, lw: 0.75, r: 0.1 });
  txt(s, o.title ?? "", { x: o.x + 0.25, y: o.y + 0.08, w: o.w - 0.5, h: 0.4, fontSize: 15, bold: true, color: CON.INK, fontFace: CF.song });
  const cols = o.cols ?? [], n = Math.max(cols.length, 1), cw = (o.w - 0.5) / n;
  cols.forEach((c, i) => {
    const cx = o.x + 0.25 + i * cw;
    formulaLine(s, { x: cx, y: o.y + 0.52, w: cw - 0.12, label: c.label, formula: c.formula, lc: c.lc ?? CON.NAVY, fs: c.fs ?? 12 });
    txt(s, [
      { text: (c.pre ?? "达到 ") + " ", options: { fontSize: o.pfs ?? 14, bold: true, color: CON.INK, fontFace: CF.kai } },
      { text: c.num ?? "", options: { fontSize: o.nfs ?? 26, bold: true, color: c.nc ?? CON.RED, fontFace: T.F } },
    ], { x: cx, y: o.y + 0.9, w: cw - 0.12, h: o.nh ?? 0.5, valign: "middle" });
  });
}
// 侧标签：淡蓝芯片 + 深蓝字 + 右延长细线（slide11/12「系统界面展示/技术原理」）
function sideLabel(s, o = {}) {
  const w = o.w ?? 1.9, h = o.h ?? 0.38;
  s.addShape("rect", { x: o.x, y: o.y, w, h, fill: { color: o.fill ?? "C3D9F0" } });
  txt(s, o.text ?? "", { x: o.x, y: o.y, w, h, fontSize: o.fs ?? 14.5, bold: true, color: o.tc ?? CON.DEEP, align: "center", valign: "middle", charSpacing: 2 });
  if (o.line !== false) s.addShape("line", { x: o.x + w + 0.12, y: o.y + h / 2, w: o.lw ?? 2.2, h: 0, line: { color: lerpColor(CON.NAVY, "FFFFFF", 0.45), width: 1 } });
}
// 截图 + 底部居中说明浮签（slide12「三维设备分布」）
function captionShot(s, o = {}) {
  if (o.img) s.addImage({ path: o.img, x: o.x, y: o.y, w: o.w, h: o.h, sizing: { type: "cover", w: o.w, h: o.h } });
  else imgPlaceholder(s, { x: o.x, y: o.y, w: o.w, h: o.h, caption: "界面截图（替换素材）" });
  const ch = 0.36, cw = o.cw ?? o.w * 0.62;
  s.addShape("roundRect", { x: o.x + (o.w - cw) / 2, y: o.y + o.h - ch - 0.08, w: cw, h: ch, rectRadius: 0.05, fill: { color: o.cfill ?? "D6E4F5", transparency: 12 } });
  txt(s, o.caption ?? "", { x: o.x + (o.w - cw) / 2, y: o.y + o.h - ch - 0.08, w: cw, h: ch, fontSize: 12.5, bold: true, color: CON.DEEP, align: "center", valign: "middle" });
}
// 创新点卡：白圆角卡 + 插图位 + 中宋粗标题 + 居中说明（slide13 六宫格）
function innovCard(s, o = {}) {
  card(s, o.x, o.y, o.w, o.h, { fill: T.WHITE, line: T.LINE, lw: 0.75, r: 0.08 });
  const ih = o.ih ?? o.h - 1.05;
  if (o.img) s.addImage({ path: o.img, x: o.x + 0.15, y: o.y + 0.12, w: o.w - 0.3, h: ih, sizing: { type: "contain", w: o.w - 0.3, h: ih } });
  else imgPlaceholder(s, { x: o.x + 0.15, y: o.y + 0.12, w: o.w - 0.3, h: ih, caption: "示意插图（替换素材）" });
  txt(s, o.title ?? "", { x: o.x + 0.1, y: o.y + ih + 0.16, w: o.w - 0.2, h: 0.36, fontSize: o.tfs ?? 15, bold: true, color: CON.INK, align: "center", fontFace: CF.zsong });
  txt(s, o.text ?? "", { x: o.x + 0.18, y: o.y + ih + 0.54, w: o.w - 0.36, h: Math.max(o.h - ih - 0.62, 0.4), fontSize: o.fs ?? 10.5, color: CON.INK, align: "center", valign: "top", lineSpacingMultiple: 1.2 });
}
// 团队引言带：半透明灰底 + 楷体加粗多行（slide15）
function teamIntro(s, o = {}) {
  const y = o.y ?? 0.95, h = o.h ?? 1.4;
  s.addShape("roundRect", { x: 0.3, y, w: T.W - 0.6, h, rectRadius: 0.08, fill: { color: "E9EBF0", transparency: 18 } });
  txt(s, o.text ?? "", { x: 0.75, y, w: T.W - 1.5, h, fontSize: o.fs ?? 14.5, bold: true, color: CON.INK, fontFace: CF.kai, valign: "middle", lineSpacingMultiple: 1.6 });
}
// 成员卡：彩环头像 + 「名字丨职务」胶囊 + 圆点清单（slide15；avatar 可传圆图）
function memberCard(s, o = {}) {
  const d = o.d ?? 1.15, cx = o.x + o.w / 2;
  s.addShape("ellipse", { x: cx - d / 2 - 0.045, y: o.y - 0.045, w: d + 0.09, h: d + 0.09, fill: { color: T.WHITE }, line: { color: o.color ?? CON.BLUE, width: 1.5 } });
  if (o.avatar) s.addImage({ path: o.avatar, x: cx - d / 2, y: o.y, w: d, h: d, rounding: true, sizing: { type: "cover", w: d, h: d } });
  else {
    s.addShape("ellipse", { x: cx - d * 0.17, y: o.y + d * 0.14, w: d * 0.34, h: d * 0.34, fill: { color: CON.INK } });
    s.addShape("chord", { x: cx - d * 0.3, y: o.y + d * 0.52, w: d * 0.6, h: d * 0.62, angleRange: [200, 340], fill: { color: CON.INK } });
  }
  const py = o.y + d + 0.14;
  s.addShape("rect", { x: o.x, y: py, w: o.w, h: 0.4, fill: { color: T.WHITE }, line: { color: CON.PILL, width: 1 } });
  txt(s, [
    { text: o.name ?? "", options: { fontFace: CF.cal, bold: true, fontSize: 15, color: o.color ?? CON.NAVY } },
    { text: " 丨 ", options: { fontSize: 13, color: CON.MUT } },
    { text: o.role ?? "", options: { fontFace: CF.zsong, bold: true, fontSize: 13, color: "595959" } },
  ], { x: o.x, y: py, w: o.w, h: 0.4, align: "center", valign: "middle", margin: 0 });
  const by = py + 0.52, lh = o.lh ?? 0.34;
  (o.items ?? []).forEach((t, i) => {
    txt(s, [{ text: "● ", options: { fontSize: 7, color: CON.INK } }, { text: t, options: {} }],
      { x: o.x + 0.12, y: by + i * lh, w: o.w - 0.2, h: lh, fontSize: o.fs ?? 11, bold: true, color: CON.INK, valign: "middle", margin: 0 });
  });
}
// 协作流程带：灰蓝底 + 加粗步骤 + →（slide15）
function flowBand(s, o = {}) {
  const h = o.h ?? 0.52;
  s.addShape("roundRect", { x: o.x, y: o.y, w: o.w, h, rectRadius: 0.06, fill: { color: o.fill ?? "C9D3DE" } });
  const steps = o.steps ?? [], n = Math.max(steps.length, 1), cw = o.w / n;
  steps.forEach((t, i) => {
    const sx = o.x + i * cw + (i > 0 ? 0.24 : 0.06), sw = cw - (i > 0 ? 0.24 : 0.06) - (i < n - 1 ? 0.3 : 0.06);
    txt(s, t, { x: sx, y: o.y, w: sw, h, fontSize: o.fs ?? 14.5, bold: true, color: CON.INK, align: "center", valign: "middle" });
    if (i < n - 1) txt(s, "→", { x: o.x + (i + 1) * cw - 0.24, y: o.y, w: 0.26, h, fontSize: o.fs ?? 14.5, color: CON.INK, align: "center", valign: "middle" });
  });
}
// 封面：整幅照片 + 书法主标 + 雅酷黑副标 + 三色条 + 口号 + 奶油胶囊（slide1）
function coverContest(s, o = {}) {
  if (o.photo) s.addImage({ path: o.photo, x: 0, y: 0, w: T.W, h: T.H, sizing: { type: "cover", w: T.W, h: T.H } });
  else gradRect(s, 0, 0, T.W, T.H, "D8E5F5", "F6F9FD");
  logoCorner(s, o);
  txt(s, o.title ?? "", { x: 1.5, y: o.ty ?? 3.1, w: T.W - 3, h: 1.35, fontSize: o.tfs ?? 54, bold: true, color: o.tc ?? CON.INK, fontFace: CF.cal, align: "center", charSpacing: 8 });
  txt(s, o.sub ?? "", { x: 1.2, y: (o.ty ?? 3.1) + 1.42, w: T.W - 2.4, h: 0.55, fontSize: o.sfs ?? 21, bold: true, color: CON.INK, fontFace: CF.disp, align: "center" });
  const sw = (T.W - 2.6) / 3, sy = (o.ty ?? 3.1) + 2.06;
  CON.STRIP.forEach((c, i) => s.addShape("rect", { x: 1.3 + i * sw, y: sy, w: sw - 0.04, h: 0.055, fill: { color: c } }));
  const gy = sy + 0.22;
  s.addShape("rect", { x: T.W / 2 - 1.62, y: gy + 0.05, w: 0.035, h: 0.4, fill: { color: CON.INK } });
  s.addShape("rect", { x: T.W / 2 + 1.59, y: gy + 0.05, w: 0.035, h: 0.4, fill: { color: CON.INK } });
  txt(s, o.slogan ?? "", { x: T.W / 2 - 1.5, y: gy, w: 3.0, h: 0.5, fontSize: o.gfs ?? 22, bold: true, color: CON.INK, fontFace: CF.zong, align: "center", valign: "middle" });
  (o.chips ?? []).forEach((c, i) => {
    const y = (o.ty ?? 3.1) + 2.85 + i * 0.6, w = o.chipW ?? 4.13;
    s.addShape("roundRect", { x: (T.W - w) / 2, y, w, h: 0.42, rectRadius: 0.06, fill: { color: CON.CREAM, transparency: 15 }, line: { color: CON.CREAMLN, width: 1.5 } });
    txt(s, c, { x: (T.W - w) / 2, y, w, h: 0.42, fontSize: 14, bold: true, color: CON.INK, align: "center", valign: "middle" });
  });
}
// 收尾金句页：整幅照片 + 蓝色大字/灰粗副句/橙色行楷三行 + 蓝金箭头饰（slide16）
function closingContest(s, o = {}) {
  if (o.photo) s.addImage({ path: o.photo, x: 0, y: 0, w: T.W, h: T.H, sizing: { type: "cover", w: T.W, h: T.H } });
  else gradRect(s, 0, 0, T.W, T.H, "D8E5F5", "F6F9FD");
  logoCorner(s, o);
  const x = o.x ?? 1.9;
  txt(s, o.t1 ?? "", { x, y: o.y1 ?? 2.0, w: 9.5, h: 0.95, fontSize: o.f1 ?? 40, bold: true, color: CON.BLUE, fontFace: CF.disp, charSpacing: 5 });
  const by = (o.y1 ?? 2.0) + 1.05;
  s.addShape("rect", { x, y: by, w: 6.2, h: 0.16, fill: { color: lerpColor(CON.BLUE, "FFFFFF", 0.45) } });
  [0, 1, 2].forEach(i => s.addShape("rect", { x: x + 4.55 + i * 0.27, y: by - 0.16, w: 0.15, h: 0.48, fill: { color: CON.GOLD } }));
  s.addShape("triangle", { x: x + 5.75, y: by - 0.13, w: 0.42, h: 0.42, rotate: 90, fill: { color: CON.BLUE } });
  txt(s, o.t2 ?? "", { x, y: by + 0.32, w: 9.5, h: 0.8, fontSize: o.f2 ?? 33, bold: true, color: CON.INK, fontFace: CF.zong });
  txt(s, o.t3 ?? "", { x: x + 0.5, y: by + 1.35, w: 9.5, h: 0.8, fontSize: o.f3 ?? 33, bold: true, color: o.c3 ?? lerpColor(CON.ORANGE, "000000", 0.35), fontFace: CF.xk });
}

// ============ 配图生成族（glyph 图标字形 + diagram 图解件） ============
// 学习自 fuwai 参考件：示意图/流程图/迷你表/结构图全部用形状现场绘制，截图/照片/论文/热力图才用占位图。
// 字形双色模式：line=白底描边（ETL 圆底图标风），fill=实色+白细节（柱内白色图标风）。
function _rng(seed) { let s = (seed >>> 0) || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
// 任意两点连线（bbox = 两点外接矩形；flipH/flipV 按象限独立翻转，保证起点→终点方向与箭头位置正确）
function _line(s, x1, y1, x2, y2, st) {
  s.addShape("line", { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1, line: st });
}
// 图标字形：glyph(s,"db",x,y,0.6,CON.BLUE,{mode:"fill"}) —— name 见 GLYPHS
function glyph(s, name, x, y, d, color, o = {}) {
  const line = o.mode === "fill" ? { color: o.lc ?? T.WHITE, width: o.lw ?? 1 } : { color, width: o.lw ?? 1.5 };
  const fillM = o.mode === "fill" ? color : T.WHITE;
  const A = (prst, dx, dy, w, h, ex = {}) => s.addShape(prst, { x: x + dx * d, y: y + dy * d, w: w * d, h: h * d, fill: { color: ex.fillC ?? fillM, transparency: ex.ty ?? 0 }, line: ex.lineless ? undefined : line, ...ex.extra });
  const LN = (dx1, dy1, dx2, dy2) => _line(s, x + dx1 * d, y + dy1 * d, x + dx2 * d, y + dy2 * d, { color: o.mode === "fill" ? (o.lc ?? T.WHITE) : color, width: o.lw ?? 1.5 });
  switch (name) {
    case "user": A("ellipse", 0.32, 0.08, 0.36, 0.36); A("chord", 0.2, 0.5, 0.6, 0.62, { extra: { angleRange: [200, 340] } }); break;
    case "users": A("ellipse", 0.16, 0.12, 0.3, 0.3); A("chord", 0.06, 0.48, 0.5, 0.52, { extra: { angleRange: [200, 340] } }); A("ellipse", 0.56, 0.16, 0.28, 0.28); A("chord", 0.46, 0.5, 0.48, 0.5, { extra: { angleRange: [200, 340] } }); break;
    case "db": A("can", 0.22, 0.12, 0.56, 0.76); LN(0.22, 0.32, 0.78, 0.32); LN(0.22, 0.56, 0.78, 0.56); break;
    case "dbStack": [0.05, 0.33, 0.61].forEach(dy => A("can", 0.26, dy, 0.44, 0.34)); break;
    case "gear": A("gear6", 0.08, 0.08, 0.84, 0.84); break;
    case "sync": A("blockArc", 0.06, 0.1, 0.88, 0.88, { extra: { angleRange: [-40, 140], arcThicknessRatio: 0.22 } }); A("blockArc", 0.06, 0.02, 0.88, 0.88, { extra: { angleRange: [140, 320], arcThicknessRatio: 0.22 } }); A("gear6", 0.36, 0.36, 0.28, 0.28); break;
    case "cloud": A("cloud", 0.06, 0.2, 0.88, 0.62); break;
    case "cloudUp": A("cloud", 0.04, 0.1, 0.92, 0.6); A("upArrow", 0.42, 0.52, 0.16, 0.4, { lineless: true, fillC: color }); break;
    case "server": A("roundRect", 0.16, 0.08, 0.68, 0.84, { extra: { rectRadius: 0.06 } }); [0.2, 0.5, 0.8].forEach(dy => { A("ellipse", 0.24, dy, 0.08, 0.08, { lineless: true, fillC: color }); LN(0.42, dy + 0.04, 0.76, dy + 0.04); }); break;
    case "chat": A("wedgeRoundRectCallout", 0.04, 0.04, 0.92, 0.8); break;
    case "monitor": A("roundRect", 0.04, 0.08, 0.92, 0.62, { extra: { rectRadius: 0.05 } }); A("rect", 0.36, 0.7, 0.28, 0.12, { lineless: true, fillC: o.mode === "fill" ? color : T.WHITE }); A("rect", 0.22, 0.84, 0.56, 0.06, { lineless: true, fillC: color }); break;
    case "doc": A("rect", 0.18, 0.06, 0.64, 0.88); [0.28, 0.44, 0.6].forEach(dy => LN(0.3, dy, 0.7, dy)); break;
    case "search": A("ellipse", 0.1, 0.1, 0.6, 0.6); A("ellipse", 0.24, 0.24, 0.32, 0.32, { lineless: true, fillC: fillM }); LN(0.62, 0.62, 0.86, 0.86); break;
    case "warn": A("triangle", 0.08, 0.12, 0.84, 0.76); LN(0.5, 0.34, 0.5, 0.6); A("ellipse", 0.47, 0.66, 0.06, 0.06, { lineless: true, fillC: color }); break;
    case "bulb": A("ellipse", 0.26, 0.08, 0.48, 0.48); A("rect", 0.4, 0.56, 0.2, 0.12); LN(0.34, 0.16, 0.2, 0.06); LN(0.66, 0.16, 0.8, 0.06); LN(0.5, 0.76, 0.5, 0.9); break;
    case "puzzle": [[0.08, 0.08], [0.52, 0.08], [0.08, 0.52], [0.52, 0.52]].forEach(([px, py], i) => A("roundRect", px, py, 0.4, 0.4, { extra: { rectRadius: 0.08 }, fillC: o.mode === "fill" ? lerpColor(color, "FFFFFF", i * 0.12) : T.WHITE })); break;
    case "robot": A("roundRect", 0.14, 0.22, 0.72, 0.56, { extra: { rectRadius: 0.1 } }); A("ellipse", 0.3, 0.4, 0.12, 0.12, { lineless: true, fillC: color }); A("ellipse", 0.58, 0.4, 0.12, 0.12, { lineless: true, fillC: color }); LN(0.5, 0.08, 0.5, 0.22); A("ellipse", 0.45, 0.02, 0.1, 0.1, { lineless: true, fillC: color }); LN(0.02, 0.4, 0.14, 0.4); LN(0.86, 0.4, 0.98, 0.4); break;
    case "funnel": A("funnel", 0.1, 0.1, 0.8, 0.62); A("rect", 0.42, 0.72, 0.16, 0.2); break;
    case "book": A("rect", 0.14, 0.12, 0.72, 0.76); LN(0.3, 0.12, 0.3, 0.88); LN(0.42, 0.34, 0.74, 0.34); LN(0.42, 0.5, 0.74, 0.5); break;
    case "shield": A("teardrop", 0.14, 0.1, 0.72, 0.72, { extra: { rotate: 135 } }); break;
    case "gauge": A("blockArc", 0.1, 0.1, 0.8, 0.8, { extra: { angleRange: [120, 60], arcThicknessRatio: 0.28 } }); LN(0.5, 0.5, 0.72, 0.3); break;
    case "barMini": [0.5, 0.32, 0.14].forEach((dy, i) => A("rect", 0.2 + i * 0.22, dy + 0.18, 0.14, 0.5 - dy, { lineless: true, fillC: color })); break;
    case "donutI": A("donut", 0.12, 0.12, 0.76, 0.76); break;
    case "ai": A("roundRect", 0.24, 0.24, 0.52, 0.52, { extra: { rectRadius: 0.08 } }); [[0.12, 0.1, 0.24], [0.12, 0.45, 0.24], [0.12, 0.8, 0.24]].forEach(([px, py1, py2]) => { LN(px, py1, 0.24, py1); LN(px, py2, 0.24, py2); }); [[0.88, 0.1, 0.24], [0.88, 0.45, 0.24], [0.88, 0.8, 0.24]].forEach(([px, py1, py2]) => { LN(px, py1, 0.76, py1); LN(px, py2, 0.76, py2); }); break;
    case "building": A("rect", 0.2, 0.14, 0.36, 0.74); A("rect", 0.58, 0.36, 0.24, 0.52, { fillC: o.mode === "fill" ? lerpColor(color, "FFFFFF", 0.3) : T.WHITE }); [0.26, 0.48].forEach(dy => [0.28, 0.42].forEach(dx => A("rect", dx, dy, 0.08, 0.1, { lineless: true, fillC: fillM }))); break;
    case "check": LN(0.2, 0.52, 0.42, 0.74); LN(0.42, 0.74, 0.8, 0.26); break;
    case "cross": LN(0.2, 0.2, 0.8, 0.8); LN(0.2, 0.8, 0.8, 0.2); break;
    case "bell": A("chord", 0.2, 0.14, 0.6, 0.6, { extra: { angleRange: [0, 180] } }); A("ellipse", 0.44, 0.74, 0.12, 0.12, { lineless: true, fillC: color }); break;
    default: A("ellipse", 0.1, 0.1, 0.8, 0.8);
  }
}
const GLYPHS = ["user", "users", "db", "dbStack", "gear", "sync", "cloud", "cloudUp", "server", "chat", "monitor", "doc", "search", "warn", "bulb", "puzzle", "robot", "funnel", "book", "shield", "gauge", "barMini", "donutI", "ai", "building", "check", "cross", "bell"];
// 连接线：elbow(s, x1,y1, x2,y2, {arrow,dash,lw,color,hFirst}) 直线/直角连线
function elbow(s, x1, y1, x2, y2, o = {}) {
  const st = { color: o.color ?? CON.NAVY, width: o.lw ?? 1.25 };
  if (o.dash) st.dashType = "dash";
  if (o.arrow) st.endArrowType = "triangle";
  if (o.hFirst === undefined) o.hFirst = Math.abs(x2 - x1) > Math.abs(y2 - y1);
  if (o.straight) { _line(s, x1, y1, x2, y2, st); return; }
  if (o.hFirst) { _line(s, x1, y1, x2, y1, { ...st, endArrowType: undefined }); _line(s, x2, y1, x2, y2, st); }
  else { _line(s, x1, y1, x1, y2, { ...st, endArrowType: undefined }); _line(s, x1, y2, x2, y2, st); }
}
// 汇聚/分叉：从一点向 targets[] 画直线（dash=虚线汇聚，arrow=箭头分叉）
function forkArrow(s, from, targets, o = {}) {
  const st = { color: o.color ?? CON.INK, width: o.lw ?? 1.25 };
  if (o.dash) st.dashType = "dash";
  if (o.arrow !== false) st.endArrowType = "triangle";
  targets.forEach(t => _line(s, from.x, from.y, t.x, t.y, st));
}
// 迷你数据表图形：彩色表头 + 细网格（可选表头文字/勾章）
function miniTable(s, x, y, w, h, o = {}) {
  const cols = o.cols ?? 3, rows = o.rows ?? 3, hh = o.headH ?? h * 0.2;
  s.addShape("rect", { x, y, w, h: hh, fill: { color: o.head ?? CON.BLUE }, line: { color: o.line ?? CON.INK, width: 1 } });
  s.addShape("rect", { x, y: y + hh, w, h: h - hh, fill: { color: T.WHITE }, line: { color: o.line ?? CON.INK, width: 1 } });
  for (let i = 1; i < cols; i++) _line(s, x + (i * w) / cols, y, x + (i * w) / cols, y + h, { color: o.line ?? CON.INK, width: 1 });
  for (let j = 1; j < rows; j++) _line(s, x, y + hh + ((h - hh) * (j - 1)) / (rows - 1 || 1), x + w, y + hh + ((h - hh) * (j - 1)) / (rows - 1 || 1), { color: o.line ?? CON.INK, width: 1 });
  if (o.headText) txt(s, o.headText, { x, y, w, h: hh, fontSize: 9, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  if (o.badge) badgeCheck(s, x + w - 0.12, y - 0.14, 0.4, o.badge === true ? undefined : o.badge);
}
// 勾章：绿圆/深绿圆 + 白勾（数据达标、检查通过）
function badgeCheck(s, x, y, d, color) {
  s.addShape("ellipse", { x, y, w: d, h: d, fill: { color: color ?? CON.GREEN } });
  txt(s, "✓", { x, y: y - d * 0.04, w: d, h: d, fontSize: d * 26, bold: true, color: T.WHITE, align: "center", valign: "middle" });
}
// 多段渐变条（蓝→紫→橙→金 页脚彩带式）；stops = ["2E54A1","A56FB1","EE822F","F2BA02"]
function gradRectMS(s, x, y, w, h, stops) {
  const seg = w / (stops.length - 1), n = Math.max(4, Math.round(seg / 0.1));
  stops.forEach((c, i) => { if (i < stops.length - 1) gradRect(s, x + i * seg, y, seg, h, c, stops[i + 1], { n }); });
}
// 图标柱状图（项目应用价值式）：圆角升序柱 + 柱内白图标 + 扫升弧箭头 + 多段渐变脚条
function iconBarChart(s, o) {
  const { x, y, w, h } = o, items = o.items ?? [], n = items.length;
  const top = y + 0.62, ah = h - 0.62 - (o.strip ? 0.3 : 0) - 0.36;
  if (o.title) { gradRect(s, x, y, w, 0.44, CON.NAVY, CON.BLUE); txt(s, o.title, { x, y, w, h: 0.44, fontSize: 15, bold: true, color: T.WHITE, align: "center", valign: "middle" }); }
  if (o.strip) gradRectMS(s, x, y + h - 0.14, w, 0.12, o.stops ?? [CON.NAVY, "A56FB1", CON.ORANGE, "F6D671"]);
  const bw = (w - 0.5 - (n - 1) * 0.18) / n, max = o.max ?? 100;
  for (let g = 0; g <= 4; g++) txt(s, `${(max * (4 - g)) / 4}%`, { x, y: top + (ah * g) / 4 - 0.09, w: 0.45, h: 0.2, fontSize: 8.5, color: CON.INK, align: "right" });
  items.forEach((it, i) => {
    const bh = (it.value / max) * ah, bx = x + 0.55 + i * (bw + 0.18), by = top + ah - bh;
    s.addShape("roundRect", { x: bx, y: by, w: bw, h: bh, rectRadius: 0.035, fill: { color: it.color ?? CON.BLUE } });
    if (it.icon) glyph(s, it.icon, bx + bw / 2 - 0.16, by + 0.14, 0.32, T.WHITE, { mode: "fill", lc: it.color ?? CON.BLUE });
    txt(s, it.label, { x: bx - 0.12, y: top + ah + 0.04, w: bw + 0.24, h: 0.3, fontSize: o.fs ?? 10.5, bold: true, color: CON.INK, align: "center" });
  });
  if (o.arrow !== false) s.addShape("arc", { x: x + 0.4, y: top + 0.02, w: w - 1.05, h: ah * 0.85, angleRange: [185, 352], line: { color: CON.BLUE, width: 3, endArrowType: "triangle" }, fill: { color: T.WHITE, transparency: 100 } });
}
// 演示散点图（隔离森林式）：坐标轴 + 密集点云 + 绿色区域框 + 红色离群 ✕
function demoScatter(s, x, y, w, h, o = {}) {
  const rnd = _rng(o.seed ?? 42);
  _line(s, x, y, x, y + h, { color: CON.INK, width: 1.25, endArrowType: "triangle" });
  _line(s, x, y + h, x + w, y + h, { color: CON.INK, width: 1.25, endArrowType: "triangle" });
  if (o.box) s.addShape("rect", { x: x + w * 0.18, y: y + h * 0.3, w: w * 0.55, h: h * 0.5, fill: { color: "D9EAD9", transparency: 35 }, line: { color: CON.GREEN, width: 1.25 } });
  for (let i = 0; i < (o.n ?? 90); i++) {
    const t = rnd(), cx = x + 0.12 + t * w * 0.68, cy = y + h - 0.1 - t * h * 0.72 - (rnd() - 0.5) * h * 0.16;
    s.addShape("ellipse", { x: cx, y: cy, w: 0.035, h: 0.035, fill: { color: o.dotColor ?? CON.BLUE } });
  }
  (o.outX ?? [[0.24, 0.18], [0.62, 0.08], [0.82, 0.3], [0.86, 0.66]]).forEach(([fx, fy]) => txt(s, "✕", { x: x + w * fx - 0.07, y: y + h * fy - 0.08, w: 0.16, h: 0.18, fontSize: 11, bold: true, color: CON.RED, align: "center" }));
}
// 演示划分图（随机隔离线 + 点云）
function demoPartition(s, x, y, w, h, o = {}) {
  const rnd = _rng(o.seed ?? 7);
  for (let i = 0; i < (o.n ?? 14); i++) {
    const vert = rnd() > 0.5;
    if (vert) _line(s, x + rnd() * w, y, x + rnd() * w, y + h, { color: CON.INK, width: 0.75 });
    else _line(s, x, y + rnd() * h, x + w, y + rnd() * h, { color: CON.INK, width: 0.75 });
  }
  for (let i = 0; i < (o.n2 ?? 40); i++)
    s.addShape("ellipse", { x: x + rnd() * w * 0.9 + w * 0.05, y: y + rnd() * h * 0.9 + h * 0.05, w: 0.05, h: 0.05, fill: { color: o.dotColor ?? CON.BLUE } });
}
// 演示二叉树（iTree 隔离树）：3 层圆节点 + 边；highlight=left 红短路径 / right 正常
function iTreeDraw(s, x, y, w, h, o = {}) {
  const d3 = 0.22, pos = [];
  [1, 2, 4].forEach((cnt, lv) => { for (let i = 0; i < cnt; i++) pos.push({ x: x + (w / cnt) * (i + 0.5), y: y + (lv * h) / 2 + d3 / 2, lv, i }); });
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  edges.forEach(([a, b]) => _line(s, pos[a].x, pos[a].y + d3 / 2, pos[b].x, pos[b].y - d3 / 2, { color: CON.MUT, width: 1 }));
  pos.forEach((p, i) => {
    const red = o.highlight === "left" ? [0, 1, 3].includes(i) : false;
    const grn = o.highlight === "left" ? [2, 5, 6].includes(i) : false;
    s.addShape("ellipse", { x: p.x - d3 / 2, y: p.y - d3 / 2, w: d3, h: d3, fill: { color: red ? CON.RED : grn ? CON.GREEN : lerpColor(CON.BLUE, "FFFFFF", 0.25) }, line: { color: CON.INK, width: 0.75 } });
  });
}
// SQL/代码块：浅灰圆角块 + Consolas 等宽
function sqlBlock(s, x, y, w, code, o = {}) {
  const lines = code.split("\n"), h = o.h ?? 0.21 * lines.length + 0.24;
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.05, fill: { color: o.fill ?? "F7F8FA" }, line: { color: o.line ?? T.LINE, width: 0.75 } });
  s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1 } })),
    { x: x + 0.15, y, w: w - 0.3, h, fontSize: o.fs ?? 9.5, fontFace: "Consolas", color: CON.INK, valign: "middle", lineSpacingMultiple: 1.15, margin: 0 });
  return h;
}
// 对话气泡（wedge 圆角气泡；right=尾巴朝右）
function chatBubble(s, x, y, w, h, text, o = {}) {
  s.addShape("wedgeRoundRectCallout", { x, y, w, h, flipH: !!o.right, fill: { color: o.fill ?? CON.BLUP }, line: { color: o.line ?? CON.BLUE, width: 1 } });
  txt(s, text, { x: x + 0.1, y: y - 0.02, w: w - 0.2, h: h - 0.04, fontSize: o.fs ?? 10, bold: true, color: o.tc ?? CON.DEEP, align: "center", valign: "middle", lineSpacingMultiple: 1.1 });
}
// 纠错对比行：红✗错误查询 → 绿✓正确查询
function comparePair(s, x, y, w, bad, good, o = {}) {
  const pw = (w - 0.6) / 2;
  s.addShape("roundRect", { x, y, w: pw, h: o.h ?? 0.36, rectRadius: 0.05, fill: { color: CON.PINK } });
  txt(s, [{ text: "✗ ", options: { color: CON.RED, bold: true } }, { text: bad, options: {} }], { x: x + 0.08, y, w: pw - 0.16, h: o.h ?? 0.36, fontSize: o.fs ?? 11, bold: true, color: CON.RED, valign: "middle", margin: 0 });
  txt(s, "→", { x: x + pw + 0.08, y, w: 0.44, h: o.h ?? 0.36, fontSize: 13, bold: true, color: CON.INK, align: "center", valign: "middle" });
  s.addShape("roundRect", { x: x + pw + 0.6, y, w: pw, h: o.h ?? 0.36, rectRadius: 0.05, fill: { color: CON.BLUP } });
  txt(s, [{ text: "✓ ", options: { color: CON.GREEN, bold: true } }, { text: good, options: {} }], { x: x + pw + 0.68, y, w: pw - 0.16, h: o.h ?? 0.36, fontSize: o.fs ?? 11, bold: true, color: CON.DEEP, valign: "middle", margin: 0 });
}
// 循环流程：n 个深色圆均布 + 相邻圆间弧线箭头（数据→分析→决策→反馈式）
function cycleFlow(s, cx, cy, r, items, o = {}) {
  const n = items.length, d = o.d ?? 0.52;
  const pos = items.map((_, i) => { const a = (-90 + (i * 360) / n) * Math.PI / 180; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a: -90 + (i * 360) / n }; });
  pos.forEach((p, i) => {
    const nxt = pos[(i + 1) % n], a1 = p.a + 90 + 38, a2 = nxt.a + 90 - 38;
    s.addShape("arc", { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, angleRange: [a1, a2], line: { color: o.color ?? CON.NAVY, width: 1.75, endArrowType: "triangle" }, fill: { color: T.WHITE, transparency: 100 } });
  });
  pos.forEach((p, i) => {
    s.addShape("ellipse", { x: p.x - d / 2, y: p.y - d / 2, w: d, h: d, fill: { color: o.color ?? CON.NAVY } });
    txt(s, items[i], { x: p.x - d / 2, y: p.y - d / 2, w: d, h: d, fontSize: o.fs ?? 10, bold: true, color: T.WHITE, align: "center", valign: "middle" });
  });
}
// 竖排文字标签（非标准数据 / 标准数据 式）
function vText(s, x, y, text, o = {}) {
  txt(s, String(text).split("").join("\n"), { x, y, w: o.w ?? 0.3, h: (o.w ?? 0.3) * String(text).length * 1.15, fontSize: o.fs ?? 12, bold: true, color: o.color ?? CON.INK, align: "center", valign: "top", lineSpacingMultiple: 1.12, margin: 0 });
}
// 时代分期折线图（十五五/十一五 式）：原生折线 + 半透明分期带 + 虚线分隔 + 底部标签
function eraLineChart(s, o) {
  const { x, y, w, h } = o, eras = o.eras ?? [];
  s.addChart("line", (o.series ?? []).map(sr => ({ name: sr.name, labels: o.cats ?? [], values: sr.values })), {
    x, y, w, h, ...chartOpts({ showLegend: true, legendPos: "b", legendFontSize: 10,
      catAxisLabelFontSize: 9, valAxisLabelFontSize: 9, lineSize: 2.5, lineSmooth: true,
      chartColors: o.colors ?? [CON.BLUE, CON.ORANGE] }),
  });
  if (!eras.length) return;
  const n = (o.cats ?? []).length, cw = w / n;
  eras.forEach(e => {
    const bx = x + e.from * cw, bw = (e.to - e.from + 1) * cw;
    s.addShape("rect", { x: bx, y: y + 0.12, w: bw, h: h - 0.95, fill: { color: e.color ?? CON.BLUP, transparency: 62 }, line: { color: CON.MUT, width: 0.75, dashType: "dash" } });
    txt(s, e.label, { x: bx + 0.02, y: y + 0.18, w: bw - 0.04, h: 0.5, fontSize: 9, bold: true, color: CON.INK, align: "center", lineSpacingMultiple: 1.05 });
  });
}

module.exports = { T, DIA, lerpColor, CHART_BLUES, init, primary, card, txt, rich, logo, pageNo,
  bottomBands, waveFooter, coverDefense, tocDefense, partDivider, tabNav, pageTitle,
  introBand, navyTag, chipCard, calloutBand, calloutBandRich, sectionSquare,
  bizHeader, bizBanner, statItem, pillRow, imgPlaceholder, table, chartOpts, statNumber,
  vRail, diaNode, dashGroup, blockArrow, chevronChain, circleChain, badgeGrid, noteStack, diaPyramid, diaTitleBar,
  listGroup, headerList, orbitCircles, dualArrowLink, nodeLinkRow, hubSpokes, satelliteRing, cycleHub, curveArrow,
  pageHeader, pillChain, waveRibbon, iconNodeRow, petalHub, cylinderChain, picCard, descCard, headDescCol, gradStripRow, numBandRow, podium,
  arcFooter, navBarText, photoCover, tocFan, sectionGradient, bigStat, photoGrid, honorList, certPodium, spreadTags, kvProfileCard, laurelBadge, JX,
  CON, CF, measure, gradRect, gradPill, bgContest, contestHeader, logoCorner, pageLead, sectionPill, checkPills, dashCallout,
  bottomBanner, bulbCallout, footPills, tagPills, painCard, numCard, tealHeadCard, personaCard, triColHeaders, dashColumn,
  metricPills, bigGold, gradPanel, capBox, hubRadial, archBanner, shotStrip, stepBox, softBox, flowTag, infoCard, tagRow,
  formulaLine, formulaCard, sideLabel, captionShot, innovCard, teamIntro, memberCard, flowBand, coverContest, closingContest, buildingIcon,
  glyph, GLYPHS, elbow, forkArrow, miniTable, badgeCheck, gradRectMS, iconBarChart, demoScatter, demoPartition, iTreeDraw,
  sqlBlock, chatBubble, comparePair, cycleFlow, vText, eraLineChart };
