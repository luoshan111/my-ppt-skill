// 竞赛路演变体（contest）组件验证页 —— 对照 fuwai-*.png 参考件
const S = require("../scripts/scaffold.js");
const { T, CON, CF } = S;

(async () => {
  const pres = S.init({ variant: "contest", title: "contest 组件验证" });
  const brand = { brand1: "中国大学生服务外包", brand2: "创新创业大赛" }; // logo 由交付时替换

  // ---------- P1 封面（对照 fuwai-01） ----------
  let s = pres.addSlide();
  S.coverContest(s, { ...brand, title: "擎筑驭能", sub: "基于大模型的建筑能耗运营优化与智能决策系统",
    slogan: "让节能先于损耗", chips: ["企业命题类（A08）", "团队成员：洪跃嘉、王沁怡、安达等"] });

  // ---------- P2 痛点分析（对照 fuwai-03） ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "痛点分析" });
  S.pageLead(s, { parts: S.rich(["建筑能源管理核心痛点主要集中在", { t: "“数据、分析、运维、知识”", c: CON.ORANGE, b: true }, "四个层面。"]) });
  const cw = 2.95, gap = 0.22, x0 = (T.W - 4 * cw - 3 * gap) / 2, cy = 1.45, ch = 4.9;
  [
    { title: "数据治理难", tags: ["电力能耗", "环境参数"], parts: S.rich([{ t: "建筑能耗数据来源分散", c: CON.ORANGE, b: true }, "，存在格式不统一、标准不一致、接入复杂等问题。", { t: "\n缺乏统一的数据清洗与标准化机制", c: CON.ORANGE, b: true }, "，难以支撑后续查询分析与精细化管理。"]) },
    { title: "统计分析慢", tags: ["多条件查询", "报表导出"], parts: S.rich(["多条件查询依赖人工筛选与重复统计，", { t: "查询响应慢、分析处理效率低下", c: CON.ORANGE, b: true }, "。", { t: "\n时段汇总、COP 计算和报表生成流程繁琐", c: CON.ORANGE, b: true }, "，难以及时有效支撑管理决策。"]) },
    { title: "运维依赖经验", tags: ["提前告警", "扳手维护"], parts: S.rich([{ t: "故障诊断与异常判断高度依赖人工经验", c: CON.ORANGE, b: true }, "，缺少统一标准与规范流程支撑。复杂场景下问题定位慢、", { t: "处理效率不稳定", c: CON.ORANGE, b: true }, "，难以满足高效智能运维需求。"]) },
    { title: "知识沉复用不足", tags: ["运维手册", "故障案例"], parts: S.rich([{ t: "手册、案例和操作规范分散存储", c: CON.ORANGE, b: true }, "，缺乏统一沉淀与结构化管理机制有效支撑。", { t: "知识调用效率低", c: CON.ORANGE, b: true }, "，经验复用能力弱，难以形成智能问答与运维辅助能力。"]) },
  ].forEach((c, i) => S.painCard(s, { x: x0 + i * (cw + gap), y: cy, w: cw, h: ch, title: c.title, tags: c.tags, parts: c.parts, ih: 1.7 }));
  S.bottomBanner(s, { text: "传统能源管理在数据治理、统计分析、运维响应和知识复用方面均存在明显短板" });

  // ---------- P3 需求分析（对照 fuwai-04） ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "需求分析" });
  S.triColHeaders(s, { y: 0.95, titles: ["业务场景", "核心需求", "系统响应"] });
  ["管理人员|希望快速掌握各建筑能耗变化情况，及时发现异常波动，并形成统计结果与报表输出。",
   "运维人员|希望了解设备当前运行是否正常，异常原因是什么，出现问题后应该如何排查与处理。",
   "平台使用者|希望通过自然语言或多条件方式快速查询能耗数据，不再依赖人工筛选、重复统计和手动整理。"]
    .forEach((t, i) => {
      const [tt, body] = t.split("|");
      S.personaCard(s, { x: 0.42, y: 1.68 + i * 1.92, w: 3.55, h: 1.72, title: tt, text: body, color: i === 0 ? CON.BLUE : i === 1 ? CON.GOLDD : S.lerpColor(CON.ORANGE, "000000", 0.3) });
    });
  [["01", "统一数据治理需求", "系统需实现建筑能耗、环境参数、设备状态和运维文档等多源数据统一接入、清洗处理与标准化存储，为后续分析和问答提供基础支撑。"],
   ["02", "查询统计需求", "系统需支持按建筑、时间、参数和指标等维度进行快速查询，并完成时段汇总、趋势分析、COP 计算、异常分析和报表导出。"],
   ["03", "智慧运维需求", "系统需支持能耗问答、设备状态查询、异常原因分析、故障辅助诊断和运维流程指导，提升问题解释与处置辅助能力。"],
   ["04", "平台集成需求", "系统需将数据管理、查询统计、知识问答与运维辅助统一集成到 Web 平台中，形成完整交互闭环，并兼顾展示与演示需求。"]]
    .forEach((c, i) => S.numCard(s, { x: 4.5, y: 1.68 + i * 1.35, w: 4.3, h: 1.22, no: c[0], title: c[1],
      parts: S.rich([c[2].slice(0, 22), { t: "……", c: CON.ORANGE, b: true }]) }));
  [["数据层响应", "构建标准化能耗数据底座，实现多源数据接入、清洗和统一管理。"],
   ["分析层响应", "提供多条件查询、趋势分析、COP 计算、异常识别和报表导出能力。"],
   ["智能层响应", "构建知识库与大模型问答，支撑异常解释、运维建议与辅助诊断。"],
   ["平台层响应", "搭建统一的建筑能源智能管理系统，实现前后端协同与交互闭环。"]]
    .forEach((c, i) => S.tealHeadCard(s, { x: 9.35, y: 1.68 + i * 1.35, w: 3.6, h: 1.22, head: c[0], text: c[1] }));

  // ---------- P4 核心技术二（对照 fuwai-09） ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "核心技术二 ｜ 基于孤立森林的时序异常检测" });
  let a = S.infoCard(s, { x: 0.4, y: 0.92, w: 6.1, h: 5.7, title: "孤立森林检测流程" });
  S.tagRow(s, { x: a.x, y: a.y, items: ["电力能耗", "空调能耗", "温湿度", "设备状态"] });
  txtA(s, a, "基于滑动窗口样本，孤立森林通过随机划分构建多棵隔离树。异常样本更易被快速隔离，路径更短，进而可通过异常分数与阈值实现异常窗口识别。", { y: a.y + 0.48, h: 1.05, fs: 12 });
  S.formulaLine(s, { x: a.x, y: a.y + 1.62, w: a.w, label: "滑动窗口构造", formula: "Xt = [x(t−w+1), …, xt]", lc: CON.RED, fs: 12.5 });
  S.softBox(s, { x: a.x, y: a.y + 2.06, w: 1.3, h: 0.4, text: "数据集", fill: CON.CREAMP });
  S.softBox(s, { x: a.x + 1.5, y: a.y + 2.06, w: 1.1, h: 0.4, text: "树 1…树 n", fill: CON.PINK });
  S.flowTag(s, { x: a.x, y: a.y + 2.62, w: 1.9, text: "正常数据：长路径", color: CON.BLUE, fs: 11 });
  S.flowTag(s, { x: a.x, y: a.y + 3.12, w: 1.9, text: "异常数据：短路径", color: CON.BLUE, fs: 11 });
  S.flowTag(s, { x: a.x + 2.1, y: a.y + 2.62, w: 1.6, text: "平均路径长度", color: CON.GREEN, fs: 11 });
  S.flowTag(s, { x: a.x + 2.1, y: a.y + 3.12, w: 1.6, text: "异常分数", color: S.DIA.purple.main, fs: 11 });
  S.softBox(s, { x: a.x + 0.35, y: a.y + 3.66, w: 1.2, h: 0.4, text: "异常", fill: CON.CREAMP });
  S.softBox(s, { x: a.x + 1.85, y: a.y + 3.66, w: 1.2, h: 0.4, text: "正常", fill: CON.CREAMP });
  S.softBox(s, { x: a.x + 3.95, y: a.y + 2.62, w: 1.8, h: 1.44, text: "阈值判定\n短路径→异常\n长路径→正常", fill: "FFFFFF", line: CON.MUT, fs: 11, bold: true });
  let b = S.infoCard(s, { x: 6.75, y: 0.92, w: 6.15, h: 2.72, title: "路径长度判别特性" });
  S.formulaLine(s, { x: b.x, y: b.y, w: b.w - 2.4, label: "平均路径长度", formula: "E(h(x)) = (1/T)·Σh(x)", lc: CON.RED, fs: 12.5 });
  txtA(s, b, "正常样本通常分布在密集区域，平均路径较长；异常样本更容易在浅层节点被隔离；多树集成后可获得更稳定的异常判定边界。", { y: b.y + 0.44, h: 1.15, fs: 12, w: b.w - 2.45 });
  S.imgPlaceholder(s, { x: b.x + b.w - 2.3, y: b.y + 0.02, w: 2.3, h: 1.55, caption: "判别边界图" });
  let c2 = S.infoCard(s, { x: 6.75, y: 3.9, w: 6.15, h: 2.72, title: "异常分数分布与 iTree 隔离机理" });
  S.formulaLine(s, { x: c2.x, y: c2.y, w: c2.w - 2.2, label: "异常分数", formula: "s(x,n) = 2^[E(h(x))/c(n)]", lc: CON.RED, fs: 12.5 });
  txtA(s, c2, "模型输出异常分数，并通过阈值区分正常与异常；阈值右侧样本越多，异常程度越高。异常样本通常在更少的划分步骤内被隔离，因此对应更短的树路径和更高的异常分数。", { y: c2.y + 0.44, h: 1.2, fs: 12, w: c2.w - 2.2 });
  S.imgPlaceholder(s, { x: c2.x + c2.w - 2.1, y: c2.y + 0.02, w: 2.1, h: 1.6, caption: "分数直方图" });
  s.addShape("rect", { x: 0.4, y: 6.78, w: T.W - 0.8, h: 0.55, fill: { color: T.GREY } });
  S.txt(s, [{ text: "系统采用基于滑动窗口的孤立森林时序异常检测方法，在测试数据集上取得 ", options: {} },
    { text: "94.1%", options: { color: CON.RED, bold: true, fontSize: 16 } },
    { text: " 的识别准确率，具备较好的异常区分能力与工程应用可行性。", options: {} }],
    { x: 0.6, y: 6.78, w: T.W - 1.2, h: 0.55, fontSize: 13, bold: true, color: CON.INK, align: "center", valign: "middle" });

  // ---------- P5 团队介绍（对照 fuwai-15） ----------
  s = pres.addSlide();
  S.bgContest(s);
  S.contestHeader(s, { ...brand, title: "团队介绍" });
  S.teamIntro(s, { text: "我们是一支融合算法研发、系统开发、产品设计与项目协同能力的跨专业团队，具备从需求分析、方案设计到系统实现的完整实践能力，聚焦建筑能源管理场景，开展系统设计、模型实现与平台开发。" });
  [["小洪", "项目负责人", CON.BLUE, ["项目管理、规划", "团队协作沟通", "核心技术实现"]],
   ["小王", "算法研发", CON.GOLD, ["核心技术实现", "关键大模型研究", "PPT 制作"]],
   ["小王", "前端开发", CON.GREEN, ["前端开发设计", "详细文档编写", "数据集构建"]],
   ["小安", "测试与文档", CON.CYAN, ["系统测试", "视频剪辑", "技术文档编写"]],
   ["小方", "产品与运营", CON.RED, ["相关模型开发", "客户沟通", "产品推广"]]]
    .forEach((m, i) => S.memberCard(s, { x: 0.5 + i * 2.52, y: 2.75, w: 2.3, name: m[0], role: m[1], color: m[2], items: m[3] }));
  S.txt(s, "团队协作流程", { x: 0.5, y: 5.95, w: 3, h: 0.4, fontSize: 17, bold: true, color: CON.BLUE, fontFace: CF.disp });
  S.flowBand(s, { x: 0.5, y: 6.45, w: T.W - 1.0, steps: ["需求分析", "方案设计", "算法研发", "系统实现", "测试优化", "成果展示"] });

  // ---------- P6 收尾（对照 fuwai-16） ----------
  s = pres.addSlide();
  S.closingContest(s, { ...brand, t1: "擎 筑 驭 能", t2: "异常早识别，决策早响应", t3: "让节能真正跑在损耗前" });

  await pres.writeFile({ fileName: "test_contest.pptx" });
  console.log("OK test_contest.pptx");
})().catch(e => { console.error(e); process.exit(1); });

// 卡内正文助手（绝对坐标）
function txtA(s, area, text, o = {}) {
  S.txt(s, text, { x: o.x ?? area.x, y: o.y ?? area.y, w: o.w ?? area.w, h: o.h ?? 0.8, fontSize: o.fs ?? 12, bold: true, color: CON.INK, valign: "top", lineSpacingMultiple: 1.25 });
}
