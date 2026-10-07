---
name: blue-academic-ppt
description: 用户的个人 PPT 风格——蓝白学术风（研究生开题/答辩/学术汇报 + 蓝白商务汇报 + 竞赛路演三变体）。凡用户要求制作 PPT、幻灯片、答辩 PPT、开题报告、结题汇报、竞赛路演、项目汇报、大赛答辩（服务外包/互联网+/挑战杯等），或提到"按我的风格/我的模板做 PPT"，一律用本 skill 以重画方式生成：从组件库选版式、填内容、走统一质检。不要做模板克隆。
---

# 蓝白学术风 PPT · 个人风格组件库

用户的设计语言已从其参考 PPT 拆解为组件代码。**双模式**：
- **模式 A 重画**（默认）：用组件库重画，任意新内容/新构图，风格还原度约 90-95%
- **模式 B 模板克隆**：在 XML 层克隆原版页面、预算内替换文字，视觉与原版 **100% 一致**，但版式受限于原文件已有页面

**选模式**：内容结构与某份模板的已有版式高度吻合（只需换字换图）→ 模式 B；需要模板没有的构图或页数 → 模式 A；两者混用（克隆固定页 + 重画新页）时注意同 deck 内会有可感知的风格差异，尽量整份走一条路线。模板清单见 `assets/templates/manifest.json`（竞赛路演参考件 fuwai 无克隆模板——原文件 155MB 嵌字体，竞赛 deck 一律走模式 A）。

## 工作流（每次都完整走一遍）

1. **读设计规范**：先读 `references/style-guide.md`（设计常量、字号体系、版式规格、禁忌）。不读就动手必然风格漂移。
2. **选变体**：
   - `defense`（答辩）：开题/答辩/结题/学术汇报 → 白底、顶部章节标签导航、PART 分节、X.Y 编号
   - `business`（蓝白商务）：企业向项目/产品汇报 → 白底 + 深蓝、图标统计项、胶囊导航、波浪页脚
   - `contest`（竞赛路演）：服务外包/互联网+/挑战杯等**大赛答辩、路演** → 竞赛 logo 右上角、绿建筑图标+青绿大字页眉、亮蓝渐变、藏青卡头、正文深灰+橙金高亮、粉彩步骤盒、公式大数字（参考 `assets/reference/fuwai-*.png`）
   - 拿不准时问一句；defense/business 共享同一套 tokens，允许混用个别组件；contest 有独立 tokens（`S.CON`）与字体（`S.CF`），不要与 defense/business 混排。
3. **写构建脚本**：require 组件库（路径 = ZCode 加载本技能时显示的 Base directory，下文以 `$SKILL` 指代），选组件、填内容：
   ```js
   const S = require("C:/Users/<用户名>/.agents/skills/blue-academic-ppt/scripts/scaffold.js");
   const pres = S.init({ variant: "defense", title: "研究生开题报告" });
   let s = pres.addSlide();
   S.coverDefense(s, { title: "...", info: [{ label: "答辩人", value: "..." }], ... });
   await pres.writeFile({ fileName: "out.pptx" });
   ```
   组件清单与参数见 `references/style-guide.md` 第 3 节；本文件只列高频件：
   `coverDefense / tocDefense / partDivider / tabNav + pageTitle + introBand + navyTag + chipCard + calloutBand / bizHeader + bizBanner + statItem + pillRow / table / rich`
   图解页（架构图/技术路线，学术内容页的主力）：`vRail + diaNode + dashGroup + blockArrow + chevronChain + circleChain + badgeGrid + noteStack + diaPyramid + diaTitleBar`，配色用 `S.DIA` 七色族（blue/red/amber/purple/teal/coral/steel）
   图解集页（整页图解，参考 cailiao-*.png）：`pageHeader + petalHub + pillChain + waveRibbon + cylinderChain + iconNodeRow + picCard + headDescCol + gradStripRow + numBandRow + podium`
   竞选/个人答辩风（参考 jxjiang-*.png）：`arcFooter + navBarText + photoCover + tocFan + sectionGradient + bigStat + photoGrid + honorList + certPodium + spreadTags + kvProfileCard + laurelBadge`，配色用 `S.DIA` 的 royal/peri/sun 族与 `S.JX`
   竞赛路演风（参考 fuwai-*.png）：框架 `contestHeader + logoCorner + bgContest + pageLead + coverContest + closingContest`；块件 `sectionPill + checkPills + dashCallout + bottomBanner + bulbCallout + footPills`；卡片 `painCard + numCard + tealHeadCard + personaCard + innovCard + capBox + gradPanel + dashColumn + infoCard + tagPills/tagRow/metricPills/flowTag/softBox`；图解 `triColHeaders + hubRadial + archBanner + shotStrip + stepBox + captionShot + sideLabel`；数据 `bigGold + formulaLine + formulaCard`；团队 `teamIntro + memberCard + flowBand`；配色用 `S.CON`，字体用 `S.CF`，渐变只走 `gradRect/gradPill`
   配图生成族（同参考件的插图逻辑）：`glyph` 图标字形 28 种（`GLYPHS` 清单，line/fill 双模式）+ 图解件 `elbow/forkArrow/miniTable/badgeCheck/vText/gradRectMS` + 演示件 `iconBarChart/eraLineChart/demoScatter/demoPartition/iTreeDraw/sqlBlock/chatBubble/comparePair/cycleFlow`——示意图/流程图/迷你表/结构图一律现场绘制，截图/照片/论文/热力图才用 `imgPlaceholder`；构图骨架见 style-guide「配图生成族」节
4. **构建三连**（顺序固定，缺一不可；`$SKILL` = 本技能目录）：
   ```bash
   NODE_PATH="$(npm root -g)" node build.js
   python "$SKILL/scripts/fix_ppr.py" "out.pptx"   # 富文本混排必须
   python "$SKILL/scripts/check.py" "out.pptx"     # 溢出/越界/重叠
   ```
   `fix_ppr.py` 清除同段落重复 `<a:pPr>`——凡用过 `S.rich()` 关键词高亮，跳过这步会导致 PowerPoint 打开后行序错乱。
5. **渲染 + 视觉验收**：写 `render_jobs.txt`（UTF-8 带 BOM，每行 `pptx绝对路径|PNG输出目录`），然后
   `powershell -NoProfile -ExecutionPolicy Bypass -File ".../scripts/render.ps1"`，
   渲染后派 judge 子代理逐页验收，并把渲染图与 `assets/reference/` 里的原版风格页对照。检查通过才算完成。
6. **发现问题回到第 3 步修文案/布局**，直到验收通过。孤字换行（行尾单字成行）一律通过增删 2-3 字或显式 `breakLine` 修复。

## 模式 B：模板克隆（100% 保真路线）

适用：新内容能装进模板已有版式（开题→开题、答辩→答辩、同主题换数据）。

1. **选模板与页面**：查 `assets/templates/manifest.json` 确认模板路径可访问（模板在 G 盘，外接盘可能离线）；对照 `assets/reference/` 渲染图或提取脚本确定要克隆的源页序号（1-based）。
2. **提取原文**：目标页的段落原文必须逐字精确（含全半角与空格）。用 zipfile+regex 或 python-pptx 提取，禁止凭渲染图目测拼写。
3. **写 plan.json 并克隆**：
   ```json
   { "pages": [
     {"src": 1, "texts": {"2025相关论文答辩通用PPT模板": "新课题名称", "答辩人：本本": "答辩人：张三"}},
     {"src": 4, "texts": {"1.1 研究背景": "1.1 研究背景", "原文段落": "新段落"}},
     {"src": 4, "texts": {"1.1 研究背景": "1.2 研究现状"}}
   ] }
   ```
   ```bash
   python "$SKILL/scripts/clone_deck.py" <模板.pptx> <输出.pptx> <plan.json>
   python "$SKILL/scripts/check.py" <输出.pptx>
   ```
   同一源页可克隆多次；未引用的模板页自动删除；文本框与表格单元格都可替换。
4. **规则与坑**：
   - 文字预算 = 原文 ×1.15，超长必溢出（原文本框不可调整），文案按预算裁剪；段中换行位置要按原段落边界对齐，避免孤字悬行
   - pptxgenjs/python-pptx 对换行的表示不同（多段落 vs 单段内 \x0b）——替换键从**提取脚本的真实输出**复制，不要手打
   - 整框替换键 = 全部段落以 \n 连接；新文本行数多于原段落时尾部行自动并入软换行
   - **嵌入字体子集陷阱**：模板嵌字体子集时（如 OPPOSans/思源黑体），替换后的新字符不在子集里会回退成异样字体（实测：R/9/XX 等字符变体或缺失）。对策：加 `--strip-fonts` 移除嵌入字体清单，全文统一回退本机字体（布局不变，字貌略变）；或在演示机上安装原字体。模板清单里标注了各模板是否嵌子集
   - 图片替换：把同尺寸新图字节写回 media 部件（v1 仅文本替换，图片需手工或后续版本）
5. **质检**：check.py + 渲染后与 `assets/reference/` 对照——克隆页应与原版逐像素一致（文字内容除外）。

## 硬规则

- **学术内容页必须丰富紧凑（核心！）**：封面/目录/分节页简约，但内容页要有料——单页信息单元（节点/标签/卡片/箭头/表元）≥8，常规 15-30；主体图解区占版面 ≥60%；禁止 >1.2in 的无内容竖向空隙。用 `vRail + diaNode + dashGroup + blockArrow + chevronChain + badgeGrid + noteStack + circleChain` 组织矩阵/泳道/流程链，而不是摆 2-4 张大卡片。
- **只用 tokens**：颜色/字体一律 `S.T.*` 与 `S.DIA.*` 常量，禁止手写新色值；确需新色先加进 `scaffold.js`。
- **中文排版禁则**：标点不得悬于行首（行首禁则）；「4%」这类短 token 不得单独成行。渲染后逐页检查，靠增删字数或显式 `\n` 断行消灭，不要指望自动换行。
- **卡片填充率**：卡片内文字垂直居中（valign middle），卡片高度贴合内容量；下半部大面积空置 = 缺陷。
- **跨页一致性**：日期、数字、人名、章节名全 deck 一致（尤其进度表 vs 封面日期）；生成后通读一遍自查。
- **画布 16:9（13.33×7.5）**：参考件是 7.82 高（WPS 遗留），一律标准化为 7.5。
- **字体**：中文微软雅黑，西文/数字 Arial（`S.T.F / S.T.FL`）；每个文本都显式设 fontFace。
- **加粗层级**：标题/卡片头/关键词加粗，正文常规——参考件全篇加粗，重画时正文用常规保证可读。
- **学术编号**：章节 `01/PART ONE`，小节 `X.Y`，编号一律 Arial。
- **结构完整**：答辩 deck 必有 封面→目录→各章 PART 分节页→内容页→致谢页；每章一个分节页。
- **logo**：用户提供 logo 路径就传给组件的 `logo` 参数；没有就留白，不要画假 logo。
- **不用 emoji**；图片位用 `imgPlaceholder` 占位并在交付说明中提醒替换。
- **不要全篇居中**：卡片内正文可居中（对比卡），段落性文字左对齐。
- **contest 变体专属**：正文色用 `CON.INK`（474747）；渐变一律 `gradRect/gradPill`（pptxgenjs 无渐变，勿手拼）；CF 里的汉仪/方正字体在无字体机器上会回退，交付说明必须提醒「装字体或接受回退」；大赛 deck 常有「功能演示」占位页（仅页眉+留白现场演示，参考 fuwai-14），不算缺陷。
- **配图优先画出来**（contest 及所有图解页通用）：技术/创新/架构页里的小示意图（漏斗汇聚、看板、机器人问答、循环、迷你表、演示散点/树）用 `glyph`+图解件画，不要拿占位框糊弄——占位只留给截图/照片/热力图等真素材。字形全部预设几何拼成，颜色只传 tokens；楔形气泡不可传 rectRadius（产坏 XML）。

## 维护

- 新版式需求 → 在 `scaffold.js` 里新增函数并同步 `references/style-guide.md`，不要在使用处临时拼形状。
- 用户对风格的新要求（换色、换母题）→ 改 `scaffold.js` 的 tokens/组件，一次生效。
