/* ============================================================
 * blue-academic-ppt 组件库 scaffold.js
 * 风格：蓝白学术风（答辩 defense / 蓝白商务 business 双变体）
 * 用法：const S = require("<本文件路径>");
 *       const pres = S.init({ variant: "defense" });
 *       const s = pres.addSlide(); S.coverDefense(s, {...});
 * 规则：所有颜色/字体一律引用 S.T 常量，禁止手写新色值。
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

module.exports = { T, DIA, lerpColor, CHART_BLUES, init, primary, card, txt, rich, logo, pageNo,
  bottomBands, waveFooter, coverDefense, tocDefense, partDivider, tabNav, pageTitle,
  introBand, navyTag, chipCard, calloutBand, calloutBandRich, sectionSquare,
  bizHeader, bizBanner, statItem, pillRow, imgPlaceholder, table, chartOpts, statNumber,
  vRail, diaNode, dashGroup, blockArrow, chevronChain, circleChain, badgeGrid, noteStack, diaPyramid, diaTitleBar,
  listGroup, headerList, orbitCircles, dualArrowLink, nodeLinkRow, hubSpokes, satelliteRing, cycleHub, curveArrow,
  pageHeader, pillChain, waveRibbon, iconNodeRow, petalHub, cylinderChain, picCard, descCard, headDescCol, gradStripRow, numBandRow, podium,
  arcFooter, navBarText, photoCover, tocFan, sectionGradient, bigStat, photoGrid, honorList, certPodium, spreadTags, kvProfileCard, laurelBadge, JX };
