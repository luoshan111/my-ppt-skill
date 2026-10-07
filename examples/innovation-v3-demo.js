// 创新组件族 v3 验证页：numBadge / softCard / colHeader 与原版 PNG 对照
const S = require("../scripts/scaffold.js");
const { T, CON } = S;

(async () => {
  const pres = S.init({ variant: "contest", title: "创新组件族 v3" });
  const s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { brand1: "中国大学生服务外包", brand2: "创新创业大赛", title: "数字徽章与软卡片" });

  // 六枚徽章（与原版 PNG 并排：左画右原）
  for (let i = 1; i <= 6; i++) {
    const no = String(i).padStart(2, "0"), bx = 0.55 + (i - 1) * 1.15;
    S.numBadge(s, bx, 1.15, 0.72, no);
    s.addImage({ path: `../assets/reference/innovation-v3/${no}-badge.png`, x: bx + 0.06, y: 2.05, w: 0.6, h: 0.6 });
    S.txt(s, no + " 画/原", { x: bx - 0.1, y: 2.72, w: 1.0, h: 0.24, fontSize: 8.5, color: CON.MUT, align: "center" });
  }
  S.numBadge(s, 7.6, 1.15, 0.5, "07"); S.numBadge(s, 8.3, 1.05, 0.9, "08"); S.numBadge(s, 9.4, 1.15, 0.72, "09", { color: CON.NAVY, fill: "FFFFFF" });

  // 软卡片壳：带头部分隔线 + 内容
  const a1 = S.softCard(s, 0.55, 3.3, 4.2, 3.1, { headH: 0.6 });
  S.txt(s, "卡片标题", { x: 0.85, y: 3.42, w: 3.6, h: 0.36, fontSize: 14, bold: true, color: CON.DEEP });
  S.txt(s, "白底圆角壳 + C9DDF0 细环 + 头部分隔线，返回线下内容区。适合做要点卡、清单卡的统一外壳。",
    { x: a1.x, y: a1.y, w: a1.w, h: 1.0, fontSize: CLTB(), bold: true, color: CON.INK, valign: "top", lineSpacingMultiple: 1.25 });
  S.numBadge(s, a1.x, a1.y + 1.5, 0.5, "01"); S.numBadge(s, a1.x + 0.7, a1.y + 1.5, 0.5, "02"); S.numBadge(s, a1.x + 1.4, a1.y + 1.5, 0.5, "03");
  S.txt(s, "徽章 + 清单组合示例：三步流程要点可由徽章行 + 短句行堆叠。", { x: a1.x, y: a1.y + 2.1, w: a1.w, h: 0.6, fontSize: 10.5, color: CON.INK, valign: "top", lineSpacingMultiple: 1.25 });

  // 栏头条 + 编号卡圆徽章变体
  S.colHeader(s, 5.15, 3.3, 3.6, 0.5, "栏头头条（实心主蓝）");
  const a2 = S.softCard(s, 5.15, 4.0, 3.6, 2.4, {});
  S.txt(s, "无头模式示例（divider 默认开）", { x: a2.x, y: a2.y, w: a2.w, h: 0.5, fontSize: 11.5, bold: true, color: CON.INK });
  S.numBadge(s, a2.x, a2.y + 0.55, 0.56, "A1", { color: "2F6FB2" });
  S.txt(s, "徽章色可通过 o.color / o.fill / o.ring 覆盖，默认取 NB tokens。", { x: a2.x + 0.72, y: a2.y + 0.6, w: a2.w - 0.8, h: 0.6, fontSize: 10.5, color: CON.INK, valign: "top", lineSpacingMultiple: 1.25 });

  // numCard 圆徽章变体
  S.numCard(s, { x: 9.15, y: 3.3, w: 3.7, h: 1.45, no: "01", title: "圆徽章编号卡", badge: "circle",
    text: "numCard 传 badge:'circle' 即把渐变方块编号换成圆徽章。" });
  S.numCard(s, { x: 9.15, y: 4.95, w: 3.7, h: 1.45, no: "02", title: "原方块编号卡",
    text: "默认仍是渐变蓝方块编号，两种可混排。" });

  S.bulbCallout(s, { text: "沉淀自 innovation-components-v3：numBadge / softCard / colHeader，tokens 收敛于 S.NB（EAF5FC / C9DDF0 / 4A98D5）", y: 6.95, h: 0.42, fs: 12 });

  await pres.writeFile({ fileName: "test_badge.pptx" });
  console.log("OK test_badge.pptx");
  function CLTB() { return 11; }
})().catch(e => { console.error(e); process.exit(1); });
