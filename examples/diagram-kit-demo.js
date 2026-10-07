// 配图生成族（glyph + diagram kit）验证页 —— 对照 fuwai 参考件复刻
const S = require("../scripts/scaffold.js");
const { T, CON, CF, DIA } = S;

(async () => {
  const pres = S.init({ variant: "contest", title: "配图生成族验证" });
  const brand = { brand1: "中国大学生服务外包", brand2: "创新创业大赛" };

  // ---------- P1 字形样表（line / fill 两种模式） ----------
  let s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "配图字形库 glyph" });
  S.pageLead(s, { text: "示意图/流程图/结构图用形状现场绘制；截图/照片/论文/热力图才用占位图", fs: 13 });
  const names = S.GLYPHS, cols = 7;
  names.forEach((nm, i) => {
    const gx = 0.75 + (i % cols) * 1.75, gy = 1.4 + Math.floor(i / cols) * 1.42;
    S.txt(s, nm, { x: gx, y: gy + 1.06, w: 1.4, h: 0.22, fontSize: 9, color: CON.MUT, align: "center" });
    s.addShape("ellipse", { x: gx + 0.16, y: gy - 0.04, w: 0.98, h: 0.98, fill: { color: CON.BLUP } });
    S.glyph(s, nm, gx + 0.34, gy + 0.1, 0.62, CON.BLUE);
    S.glyph(s, nm, gx + 0.98, gy + 0.3, 0.32, CON.BLUE, { mode: "fill" });
  });

  // ---------- P2 复刻 fuwai-08 技术五步页的配图 ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "核心技术一 ｜ 数据清洗与质量治理" });
  // 顶部 ETL 圆底图标行（Extract/Transform/Load）
  const ey = 1.0, ed = 1.05;
  [["Extract", "dbStack"], ["Transform", "sync"], ["Load", "cloudUp"]].forEach(([cap, gl], i) => {
    const ex = 0.8 + i * 2.0;
    s.addShape("ellipse", { x: ex, y: ey, w: ed, h: ed, fill: { color: CON.BLUP } });
    S.glyph(s, gl, ex + 0.2, ey + 0.2, 0.65, CON.BLUE);
    S.txt(s, cap, { x: ex - 0.2, y: ey + ed + 0.05, w: ed + 0.4, h: 0.26, fontSize: 10.5, bold: true, color: CON.INK, align: "center" });
    if (i < 2) S.elbow(s, ex + ed + 0.08, ey + ed / 2, ex + 2.0 - 0.08, ey + ed / 2, { arrow: true, color: CON.BLUE, lw: 1.75 });
  });
  S.dashCallout(s, { x: 6.6, y: 0.95, w: 6.3, h: 1.45, fs: 13,
    parts: S.rich(["系统面向建筑能耗场景，构建了", { t: "“规则清洗＋异常校验＋标准转换”", c: CON.NAVY, b: true }, "一体化数据治理流程，实现了从原始多源数据到高质量标准化数据的高效转化。"]) });
  // Step3 演示图形：散点 + 划分 + 孤立树
  let a3 = S.stepBox(s, { x: 0.45, y: 2.75, w: 4.1, h: 2.5, step: "Step3", title: "异常检测", fill: CON.CREAMP });
  S.demoScatter(s, a3.x + 0.1, a3.y + 0.15, 1.7, 1.6, { seed: 11 });
  S.demoPartition(s, a3.x + 2.2, a3.y + 0.15, 1.7, 1.6, { seed: 5 });
  let a3b = S.stepBox(s, { x: 0.45, y: 5.45, w: 4.1, h: 1.85, step: "Step5", title: "孤立树路径结构", fill: CON.BLUP });
  S.iTreeDraw(s, a3b.x + 0.5, a3b.y + 0.15, 3.0, 1.1, { highlight: "left" });
  // Step4：分支箭头 + 迷你表对比 + 勾章 + 竖排标签
  let a4 = S.stepBox(s, { x: 4.85, y: 2.75, w: 4.0, h: 4.55, step: "Step4", title: "数据转换", fill: CON.BLUP });
  S.softBox(s, { x: a4.x + 0.85, y: a4.y + 0.05, w: 2.3, h: 0.44, text: "单位统一为标准能耗指标", fill: CON.PINK, fs: 11 });
  S.forkArrow(s, { x: a4.x + 2.0, y: a4.y + 0.49 }, [{ x: a4.x + 0.75, y: a4.y + 0.98 }, { x: a4.x + 3.25, y: a4.y + 0.98 }]);
  S.softBox(s, { x: a4.x + 0.1, y: a4.y + 0.98, w: 1.4, h: 0.44, text: "时间粒度统一", fill: CON.PINK, fs: 10.5 });
  S.softBox(s, { x: a4.x + 2.5, y: a4.y + 0.98, w: 1.5, h: 0.44, text: "字段映射标准化", fill: CON.PINK, fs: 10.5 });
  S.vText(s, a4.x + 0.02, a4.y + 2.2, "非标准数据", { fs: 11 });
  S.miniTable(s, a4.x + 0.4, a4.y + 2.15, 1.25, 1.15, { cols: 3, rows: 4, head: CON.BLUE });
  s.addShape("rightArrow", { x: a4.x + 1.78, y: a4.y + 2.6, w: 0.5, h: 0.26, fill: { color: CON.BLUP } });
  S.miniTable(s, a4.x + 2.4, a4.y + 2.15, 1.25, 1.15, { cols: 3, rows: 4, head: CON.GREEN, badge: true });
  S.vText(s, a4.x + 3.78, a4.y + 2.2, "标准数据", { fs: 11, color: CON.GREEN });
  // Step5：SQL 代码块 + 对话气泡 + 纠错对
  let a5 = S.stepBox(s, { x: 9.15, y: 2.75, w: 3.75, h: 4.55, step: "Step5", title: "查询编排示例", fill: CON.GRNP });
  S.chatBubble(s, a5.x + 0.1, a5.y + 0.05, 2.9, 0.55, "查询1号楼上周空调能耗趋势？", { fs: 10 });
  S.sqlBlock(s, a5.x + 0.1, a5.y + 0.75, 3.2,
    "SELECT time, energy\nFROM building_energy\nWHERE building_id=1\n  AND date BETWEEN ...");
  S.comparePair(s, a5.x + 0.1, a5.y + 1.85, 3.2, "冷机cop偏低", "冷机 COP 偏低", { fs: 10, h: 0.34 });
  S.comparePair(s, a5.x + 0.1, a5.y + 2.3, 3.2, "B区空调耗能高", "B区空调能耗偏高", { fs: 10, h: 0.34 });
  S.txt(s, [{ text: "流程闭环：", options: { bold: true } }, { text: "从自然语言提问到可执行查询，再到图表生成与结果回写。", options: {} }],
    { x: a5.x + 0.1, y: a5.y + 2.85, w: 3.2, h: 0.8, fontSize: 10.5, color: CON.INK, lineSpacingMultiple: 1.25, valign: "top" });

  // ---------- P3 数据配图：图标柱状图 + 分期折线 ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "数据配图生成" });
  S.iconBarChart(s, { x: 0.5, y: 1.0, w: 5.7, h: 5.9, title: "项目应用价值", strip: true,
    items: [
      { label: "能耗监测", value: 20, icon: "gauge" },
      { label: "异常告警", value: 34, icon: "bell" },
      { label: "数据分析", value: 50, icon: "barMini" },
      { label: "报表中心", value: 72, icon: "doc" },
      { label: "AI 运维助手", value: 96, icon: "robot" },
    ] });
  S.eraLineChart(s, { x: 6.7, y: 1.15, w: 6.2, h: 4.9, cats: ["2000", "2005", "2010", "2015", "2020", "2024"],
    series: [
      { name: "能耗（亿 tce）", values: [3.5, 5.2, 7.2, 8.9, 10.2, 11.1] },
      { name: "碳排放（亿 tCO2）", values: [5, 8, 12, 16, 20, 23] },
    ],
    eras: [
      { from: 1, to: 1, label: "“十一五”\n时期", color: CON.BLUP },
      { from: 2, to: 2, label: "“十二五”\n时期", color: CON.CREAMP },
      { from: 3, to: 3, label: "“十三五”\n时期", color: CON.GRNP },
      { from: 4, to: 5, label: "“十四五”时期", color: CON.PURP },
    ] });
  S.txt(s, "数据来源：《中国城乡建设领域碳排放研究报告（2025）》", { x: 6.7, y: 6.15, w: 6.2, h: 0.3, fontSize: 10, color: CON.MUT, align: "center" });

  // ---------- P4 创新点插图复刻（漏斗汇聚 / 看板 / RAG / 循环） ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "插图构图骨架" });
  // ① 多源汇聚 ETL：标签 → 虚线汇聚 → 漏斗 → 库+盾
  let i1x = 0.5, i1y = 1.3;
  S.txt(s, "① 多源数据统一治理", { x: i1x, y: i1y - 0.35, w: 3.4, h: 0.3, fontSize: 12.5, bold: true, color: CON.NAVY });
  ["能耗数据", "环境数据", "设备数据", "文档数据"].forEach((t, i) => {
    S.flowTag(s, { x: i1x, y: i1y + i * 0.52, w: 1.15, h: 0.36, text: t, color: CON.MUT, fs: 10 });
    S.elbow(s, i1x + 1.2, i1y + i * 0.52 + 0.18, i1x + 2.1, i1y + 1.2, { dash: true, color: CON.MUT, lw: 1, hFirst: true });
  });
  S.glyph(s, "funnel", i1x + 2.05, i1y + 0.7, 0.95, CON.BLUE);
  S.txt(s, "ETL", { x: i1x + 2.05, y: i1y + 1.62, w: 0.95, h: 0.24, fontSize: 10.5, bold: true, color: CON.INK, align: "center" });
  S.elbow(s, i1x + 3.0, i1y + 1.2, i1x + 3.4, i1y + 1.2, { arrow: true, color: CON.BLUE, lw: 1.75 });
  S.glyph(s, "db", i1x + 3.5, i1y + 0.75, 0.85, CON.BLUE);
  S.glyph(s, "shield", i1x + 3.98, i1y + 1.28, 0.4, CON.GREEN, { mode: "fill" });
  // ② 多条件看板：标签汇聚 → 显示器 + 迷你图表
  let i2x = 5.0, i2y = 1.3;
  S.txt(s, "② 多条件查询与统计分析", { x: i2x, y: i2y - 0.35, w: 3.6, h: 0.3, fontSize: 12.5, bold: true, color: CON.NAVY });
  ["楼宇", "时间", "设备", "指标"].forEach((t, i) => {
    S.flowTag(s, { x: i2x, y: i2y + i * 0.52, w: 0.85, h: 0.36, text: t, color: CON.BLUE, fs: 10 });
    S.elbow(s, i2x + 0.9, i2y + i * 0.52 + 0.18, i2x + 1.55, i2y + 1.25, { color: CON.MUT, lw: 1, hFirst: true });
  });
  S.glyph(s, "monitor", i2x + 1.6, i2y + 0.35, 1.7, CON.BLUE);
  [0, 1, 2].forEach(i => s.addShape("rect", { x: i2x + 1.85 + i * 0.14, y: i2y + 1.35 - i * 0.12, w: 0.09, h: 0.3 + i * 0.12, fill: { color: CON.BLUE } }));
  s.addShape("donut", { x: i2x + 2.42, y: i2y + 0.95, w: 0.42, h: 0.42, fill: { color: CON.ORANGE } });
  S.glyph(s, "barMini", i2x + 2.92, i2y + 0.62, 0.4, CON.GREEN, { mode: "fill" });
  // ③ 大模型+RAG：知识库书 + 气泡提问 + 机器人 + 右侧结果标签
  let i3x = 9.3, i3y = 1.3;
  S.txt(s, "③ 大模型＋RAG 智能问答", { x: i3x, y: i3y - 0.35, w: 3.5, h: 0.3, fontSize: 12.5, bold: true, color: CON.NAVY });
  S.glyph(s, "book", i3x, i3y + 0.5, 0.72, CON.BLUE);
  S.txt(s, "建筑能耗\n知识库", { x: i3x - 0.06, y: i3y + 1.28, w: 0.85, h: 0.5, fontSize: 8.5, bold: true, color: CON.INK, align: "center" });
  S.chatBubble(s, i3x + 0.95, i3y + 0.02, 2.0, 0.5, "本月A楼能耗异常原因是什么？", { fs: 9 });
  s.addShape("ellipse", { x: i3x + 1.5, y: i3y + 0.65, w: 0.95, h: 0.95, fill: { color: CON.BLUP } });
  S.glyph(s, "robot", i3x + 1.66, i3y + 0.83, 0.62, CON.BLUE);
  S.txt(s, "AI", { x: i3x + 1.5, y: i3y + 1.28, w: 0.95, h: 0.26, fontSize: 11, bold: true, color: CON.BLUE, align: "center" });
  ["语义检索", "知识来源", "精准回答"].forEach((t, i) => {
    S.flowTag(s, { x: i3x + 2.7, y: i3y + 0.35 + i * 0.52, w: 1.0, h: 0.36, text: t, color: CON.RED, fs: 9.5 });
    S.elbow(s, i3x + 2.5, i3y + 1.1, i3x + 2.68, i3y + 0.53 + i * 0.52, { dash: true, color: CON.MUT, lw: 1 });
  });
  // ④ 多角色协同 + ⑤ 模块化循环（底部一行）
  let i4y = 4.7;
  S.txt(s, "④ 一体化平台与多角色协同", { x: 0.5, y: i4y - 0.35, w: 4.5, h: 0.3, fontSize: 12.5, bold: true, color: CON.NAVY });
  ["管理端", "运维端", "分析端"].forEach((t, i) => {
    const px = 0.75 + i * 1.35;
    s.addShape("ellipse", { x: px, y: i4y + 0.05, w: 0.75, h: 0.75, fill: { color: CON.BLUP }, line: { color: CON.BLUE, width: 1 } });
    S.glyph(s, "user", px + 0.16, i4y + 0.2, 0.44, CON.BLUE);
    S.txt(s, t, { x: px - 0.15, y: i4y + 0.84, w: 1.05, h: 0.26, fontSize: 10, bold: true, color: CON.INK, align: "center" });
    if (i < 2) S.elbow(s, px + 0.78, i4y + 0.42, px + 1.32, i4y + 0.42, { dash: true, color: CON.MUT, lw: 1 });
  });
  S.glyph(s, "building", 4.35, i4y + 0.25, 0.9, CON.TEAL, { mode: "fill" });
  S.txt(s, "⑤ 模块化拓展与持续优化", { x: 6.0, y: i4y - 0.35, w: 3.4, h: 0.3, fontSize: 12.5, bold: true, color: CON.NAVY });
  ["设备接入", "模型接入", "知识接入"].forEach((t, i) => S.flowTag(s, { x: 6.0, y: i4y + i * 0.42, w: 1.0, h: 0.34, text: t, color: CON.NAVY, fs: 9.5 }));
  S.glyph(s, "puzzle", 7.3, i4y + 0.15, 0.85, CON.GREEN, { mode: "fill" });
  S.txt(s, "模块化平台", { x: 7.22, y: i4y + 1.02, w: 1.0, h: 0.24, fontSize: 9, bold: true, color: CON.INK, align: "center" });
  S.elbow(s, 8.15, i4y + 0.55, 8.85, i4y + 0.62, { arrow: true, color: CON.BLUE, lw: 2 });
  S.cycleFlow(s, 10.55, i4y + 0.72, 0.66, ["数据", "分析", "决策", "反馈"], { d: 0.48, fs: 9.5 });
  S.txt(s, "拓展循环", { x: 9.85, y: i4y + 1.74, w: 1.4, h: 0.22, fontSize: 9, bold: true, color: CON.INK, align: "center" });
  S.bulbCallout(s, { text: "示意图全部由组件绘制：glyph 图标 + elbow/forkArrow 连线 + miniTable + cycleFlow + 演示散点/划分/树", y: 6.9, h: 0.45 });

  await pres.writeFile({ fileName: "test_diagram.pptx" });
  console.log("OK test_diagram.pptx");
})().catch(e => { console.error(e); process.exit(1); });
