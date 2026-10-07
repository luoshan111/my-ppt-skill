# 蓝白学术风 · 设计规范与组件手册

来源：用户参考 PPT 的程序化清点 + 渲染对照（`assets/reference/` 存有关键页渲染图）。
- 参考A `yiliao`：蓝白医学商务风（竞赛/项目汇报）
- 参考B `kaiti`：研究生开题答辩（浙大）
- 参考C `shuobo`：硕博答辩通用（浙大）
- 参考D `fuwai`：竞赛路演风（中国大学生服务外包大赛，16 页，2026-10 学习入库）→ 第三变体 `contest`

## 1. 设计常量（scaffold.js 的 T，代码里只准引用这些）

| 常量 | 值 | 用途 |
|---|---|---|
| `NAVY` | 24498F | 答辩风主结构蓝：分节标题、标签、表头、目录侧栏 |
| `NAVYTXT` | 31497A | 页标题、强调文字、胶囊文字（比 NAVY 灰一档） |
| `BIZNAVY` | 0E419C | 商务风主结构蓝 |
| `BLUE` | 2E6BC4 | 图标、次级蓝 |
| `LIGHT` | C7D3E8 | 浅蓝芯片底（对比卡头） |
| `SKY` | B9C9E4 | 底部渐变浅蓝带 |
| `PALE` | E8EEF7 | 极浅蓝（占位图、次底带） |
| `GREY` | F0F1F3 | 灰胶囊（封面信息条、未激活标签） |
| `MIST` | F4F6FA | 引言带/表格斑马纹 |
| `LINE` | D9DFE9 | 细线、卡片描边 |
| `INK/BODY/MUT` | 1A1A1A/333333/5A6472 | 标题黑/正文/弱文字 |
| `GOLD` | FFC000 | 商务风点缀（占位块、强调） |
| `RED` | C00000 | 关键数字（红） |
| `F` / `FL` | Microsoft YaHei / Arial | 中文 / 西文数字 |

图表色系：`CHART_BLUES = [24498F, 4472C4, 8FAADC, C7D3E8]`，红色仅作单点强调。

### 1b. 竞赛路演变体常量（scaffold.js 的 CON / CF，仅 contest 变体引用）

| 常量 | 值 | 用途 |
|---|---|---|
| `BLUE` | 275DF5 | 主结构蓝：渐变主色、卡头、编号方块 |
| `BLUE2` | 0F53E0 | 渐变深端 |
| `NAVY` | 2E54A1 | 藏青：小标签、说明条、公式卡标签 |
| `NAVYBAR` | 0352BF | 分区列深蓝头条 |
| `CYAN` | 4BD1FB | 渐变浅端 / 圆心高光 |
| `TEAL` / `TEALD` | 30C0B4 / 19605C | 主题青绿 / 页眉标题字色（TEAL 压暗） |
| `GREEN` | 75BD42 | 图标、chevron（页眉绿建筑） |
| `ORANGE` / `GOLD` / `GOLDD` / `RED` | EE822F / F2BA02 / D2A517 / E54C5E | 正文橙高亮 / 装饰金 / 大金数字 / 强调红 |
| `INK` | 474747 | 正文深灰（本变体正文**不用** 1A1A1A） |
| `MIST/ARROW/PILL` | E2E4EA / B2CDE2 / C7D8D9 | 灰胶囊 / 浅蓝箭头 / 白胶囊描边 |
| `CREAM/CREAMLN` | FCE6D5 / C8894A | 封面奶油胶囊及描边 |
| `PINK/CYANP/PURP/CREAMP/BLUP/GRNP` | FCE5E8 / 99E6F0 / FEF5FF / FFF4E3 / EDF7FF / F0FAF0 | 步骤盒粉彩底 |
| `DEEP` | 1F4E79 | 信息卡标题深海军蓝 |
| `STRIP` | FF0000/FFC000/92D050 | 封面三色条（大赛红黄绿） |

| `CF` 字体 | 值 | 用途（机器缺字体自动回退，交付时提醒） |
|---|---|---|
| `disp` | 汉仪雅酷黑 65W | 大副标题、能力盒标题（回退微软雅黑粗） |
| `zong` | 汉仪综艺体简 | 封面口号、收尾副句 |
| `cal` / `xk` | 汉仪尚巍手书W / 华文行楷 | 封面书法主标 / 收尾行楷金句 |
| `song` / `zsong` | 方正小标宋简体 / 华文中宋 | 公文宋标题（引导句、创新点卡标题） |
| `kai` | 华文楷体 | 团队引言、公式标签（斜粗） |
| `ft` | Times New Roman | 公式、Step 编号 |

实现注记：pptxgenjs 不支持渐变填充与文字内阴影/倒影。渐变一律用 `gradRect/gradPill`（lerpColor 竖切片，宽件无色带感）；页眉 WordArt 用粗体+外阴影近似（还原度约 90%，可接受）。

## 2. 字号体系（16:9 画布）

| 角色 | 字号 | 样式 |
|---|---|---|
| 封面主标题 | 40 bold | NAVY 居中 |
| 封面英文副题 | 13 bold | NAVYTXT，charSpacing 2 |
| 分节标题（PART） | 40 bold | NAVY 居中；幽灵编号 66 Arial 白字+NAVYTXT 描边 |
| 页标题（X.Y） | 24 bold | NAVYTXT |
| 章节标签/横幅 | 13.5-18 bold | 标签白字 |
| 卡片头/芯片 | 16 bold | NAVYTXT |
| 正文 | 13-14 常规 | BODY，行距 1.2-1.3 |
| 表格 | 表头 13 bold / 单元 12.5 | |
| 页码/脚注 | 10-11 | MUT |

## 3. 组件清单（scaffold.js 全部导出）

### 答辩变体 defense
| 组件 | 参数 | 说明 |
|---|---|---|
| `coverDefense(s,o)` | kicker, title, en, info[{label,value}], summary, logo | 白底封面：汉堡标 + 居中标题系 + 灰胶囊信息条 + 底部双带 |
| `tocDefense(s,o)` | chapters[{no,title}] | navy 左侧栏（竖排目录/CONTENTS）+ 白胶囊章节行 |
| `partDivider(s,o)` | no, en, title, enSub, points[], summary, logo | 幽灵编号 + PART X 灰胶囊 + 大标题 + 小节预览 |
| `tabNav(s,o)` | tabs[], active, tabW, logo | 顶部章节标签导航：当前 navy 实心白字，未激活灰底蓝字，下衬细线 |
| `pageTitle(s,o)` | no, text | "1.1 研究背景"，24 bold NAVYTXT |
| `introBand(s,o)` | text, y, h | 灰底引言带，正文 14 |
| `navyTag(s,o)` | x, y, w, text | navy 实心小标签（结论/要点头） |
| `chipCard(s,o)` | x, y, w, h, chip, chipW, text, align, dash | 浅蓝芯片头 + 虚线/实线卡片（对比卡、要点卡） |
| `calloutBand(s,o)` | y, text, h | 全宽 navy 结论带，白字居中（页首结论/页尾小结） |
| `sectionSquare(s,o)` | no, title, logo | kaiti 式页眉：navy 方块章节号 + 黑标题 + 细线 |
| `bottomBands(s,summary)` | summary | 签名页脚：SKY 浅蓝带 + NAVY 实带 + 白字摘要 |

### 商务变体 business
| 组件 | 参数 | 说明 |
|---|---|---|
| `bizHeader(s,o)` | title, nav[], active | 图标位 + 蓝标题（下衬短横线）+ 右侧描边导航胶囊 |
| `bizBanner(s,o)` | x, y, w, text, fs | 圆角缺口横幅（右端有台阶缺角） |
| `statItem(s,o)` | x, y, w, value, label, icon | navy 圆图标 + 大数字 + 黑标签（数据统计行） |
| `pillRow(s,o)` | x, y, items[], w, h | 描边胶囊一行（流程/要点词） |
| `waveFooter(s)` | — | 签名页脚：浅蓝弧 + 白弧 + navy 底条的波浪 |

### 图解族（架构图/技术路线页，参考 assets/reference/jiagou-*.png）
五色族 `DIA`：blue 466AB2/E9EEF7 · red BE4343/F7E9E9 · amber F0A40C/FCF8E4 · purple A56FB1/F3ECF4 · teal 449387/EBF5F4（饱和主色/粉彩底）。一页 1-2 个色族为骨架，辅色 ≤3；同行节点同色族。

| 组件 | 参数 | 说明 |
|---|---|---|
| `vRail` | x, y, w, h, blocks[{text,color}] | 竖排文字色块导轨（泳道头） |
| `diaNode` | x, y, w, h, color, text, sub, solid, fs | 粉彩节点（solid=实心白字；sub=第二行小字） |
| `dashGroup` | x, y, w, h, color, label, lineColor | 虚线分组框，圈出一层/一组 |
| `blockArrow` | x, y, dir, len/w, h, color | 块状粗箭头（down/right/left/up） |
| `chevronChain` | x, y, w, h, items[{text,color}], fs | chevron 流程链（首节点平头） |
| `circleChain` | cx, cy, d, gap, items[{text,color}] | 圆形节点闭环（双向箭头） |
| `badgeGrid` | x, y, w, color, title, items[], cols, th | 色块头 + 标签网格，返回底部 y |
| `noteStack` | x, y, w, h, color, title, items[] | 便签卡（关键指标/成果清单） |
| `diaPyramid` | cx, y, w, h, levels[], color | 金字塔 |
| `diaTitleBar` | x, y, w, text, fs | 整页架构图标题横幅 |

### 图解族 II（环形体系/中心循环/对称列，参考 jiagou-03/06/07/08/11/12）
| 组件 | 参数 | 说明 |
|---|---|---|
| `listGroup` | x, y, w, h, color, title, items[](字符串或{k,v}), fs | 虚线列表框（{k,v} 时 k 为粗体色字） |
| `headerList` | x, y, w, h, color, title, sub, items[], fs | 实心色块头 + 虚线列表卡（专题列式） |
| `orbitCircles` | cx, cy, d, gap, items[{text,color,double}], center{text,color}, fs | 水平轨道圆点链 + 中央强调字（知情意行式） |
| `dualArrowLink` | x, y, nodeW, nodeH, gapW, l, r, top, bottom | 双节点双向箭头 + 上/下标签（持续赋能/驱动参与式） |
| `nodeLinkRow` | cx, cy, w, h, gap, items[{text,color}] | 方节点双向粗箭头行（企业师傅↔工匠式） |
| `hubSpokes` | cx, cy, hub{text,color,d,fs}, spokes[{text,color,angle,dist,d,fs}] | 中心圆+卫星圆+虚线连线（角度：90=正上，顺时针） |
| `satelliteRing` | cx, cy, r, d, items[], fs, lineColor | 大虚线圆轨道 + 均布卫星节点（自正点顺时针） |
| `cycleHub` | cx, cy, d, color, text | 淡外圈+环形箭头+实心内圆（四大层次式中心） |
| `curveArrow` | x, y, w, h, dir(up/down/left/right), color | 大弧形箭头（双循环外环） |
| `calloutBandRich` | y, parts(rich 数组), h, fs | 底条富文本，支持金色强调词（学校+企业"双元"式） |

更多构图骨架：
- **环形体系**：satelliteRing 外圈要素 + hubSpokes 内圈（中心红圆 + 卫星 teal 圆）（业态创新式）
- **四列对称**：orbitCircles 顶部 + headerList ×4 + calloutBandRich（知情意行四专题式）
- **双循环**：中央横幅 + 入口端竖标签 + 内外环 curveArrow + 上/下三组 headerList（培养共同体式）
- **中心循环联动**：cycleHub 中心 + 四角标注 + 左右对称 listGroup/sideTag（数字乡村式）

典型构图骨架（信息密度 15-30 单元/页）：
- **分层矩阵**：vRail + 每行 dashGroup + 行内 diaNode ×3（研究背景/痛点/价值）
- **流程链**：chevronChain → blockArrow↓ → diaNode 细节行 → dashGroup 实验设计 + noteStack 指标（技术路线）
- **三列递进**：badgeGrid ×3 + blockArrow→ + 产出 diaNode + 底部递进链（研究内容）
- **对比双列**：chipCard ×6 + 中缝国外VS国内 + 研究空白 dashGroup（现状对比）

### 图解族 III（图解集页框/花瓣中心/圆柱链，参考 cailiao-*.png）
新增色族：`coral` FF4C6D/FDE7EB · `steel` 5290C0/E3EEF7（珊瑚红+钢蓝暖色系）。图解集页底可用极浅蓝白 F3F5FD。

| 组件 | 参数 | 说明 |
|---|---|---|
| `pageHeader` | title, brand, color | 图解集页框：左上主题色标题 + 全宽细线 + 右上角标 |
| `pillChain` | x, y, w, h, items[{text,color}], fs | 实心胶囊链，节点间「>」分隔 |
| `waveRibbon` | x, y, w, h, colorA, colorB | 双色波浪飘带 + 右端箭头（近似参考件丝带流） |
| `iconNodeRow` | cx, cy, d, gap, items[{text,color}], link | 双环圆图标节点行，节点间双向箭头 |
| `petalHub` | cx, cy, hubD, text, color, petals[{text,no,color,d}], shape, petalShape | 花瓣/六边形中心图（shape=hexagon、petalShape=diamond 为蜂窝变体） |
| `cylinderChain` | cx, cy, w, h, gap, items[{no,text,color}] | 3D 圆柱编号节点链（can 竖排字，节间波浪） |
| `picCard` | x, y, w, h, color, title, img? | 图片卡：顶部叠加色块标题 + 图片/占位 |
| `descCard` | x, y, w, h, color, title, text | 色字标题 + 黑正文描述卡 |
| `headDescCol` | x, y, w, h, color, head, title, text | 色头 + 下箭头 + 描述卡 竖列三件套 |
| `gradStripRow` | x, y, w, h, color, items[] | 渐变分段横条（由浅到深，lerpColor 插值） |
| `numBandRow` | x, cy, w, color, no, text, textR | 编号圆 + 淡色长带 + 左右文字行 |
| `podium` | x, y, w, h, color | 圆台底座（圆节点行「站台」用） |
| `vRail` 新增 `soft` | blocks[{text,color,soft}] | soft:true 时浅底深字变体（竖排字条） |

### 图解族 IV（竞选/个人答辩风，参考 jxjiang-*.png）
新增色族：`royal` 3944C9/E3E7FA（宝蓝主色）· `peri` A5AAE9/EDF0FB（浅藤紫）· `sun` F6D671/FCF3DC（金黄点缀）；强调文字用 `JX.vivid` 000DB8。签名母题 = 底部蓝金双层大弧（每页）。

| 组件 | 参数 | 说明 |
|---|---|---|
| `arcFooter` | y, royal, gold | 底部蓝金双层大弧（竞选风每页签名） |
| `navBarText` | items[], active | 章节文字导航条 + 左上角标（当前章深蓝粗体，浅蓝竖线分隔） |
| `photoCover` | quote[]或title, sub, info[{label,value}], photo?, photoW, quoteY, fs | 照片封面/金句页：右侧照片位 + 宝蓝底 + 米金大字 + 白色副题 + 信息三列 + 金弧 |
| `tocFan` | items[{title,en,no}], title, en, cw | 扇形渐变卡目录（卡片交错微旋转 + 编号圆 + 倒影条） |
| `sectionGradient` | no, title, en, quote, lineX | 渐变大数字分节页（数字双色错位 + 竖线 + 双色横线 + 蓝色金句） |
| `bigStat` | x, y, w, label, number, desc, nfs | 大数字强调（标签 20pt + 数字 58pt 同行 + 描述段） |
| `photoGrid` | cells[{x,y,w,h,img}], deco[{x,y,s,c,t}] | 圆角照片网格（真图或占位）+ 装饰方块 |
| `honorList` | x, y, items[], cols, colW, rowH, fs | 荣誉列表（红方块 bullet，两列） |
| `certPodium` | x, y, w, h, title, fs | 荣誉证书展台（倒梯形台 + 金边证书卡 + 桂冠弧标签） |
| `spreadTags` | cx, topY, titleY, pre, number, items[], w, h, gap | 证书放射散布（中央大标题 + 左右错层圆角块） |
| `kvProfileCard` | x, y, w, h, name, rows[{k,v}] | 个人简介卡（蓝标签块两列 + 姓名大字） |
| `laurelBadge` | x, y, w, h, top, bottom | 桂冠徽章（上下弧线夹两行字） |

竞选叙事骨架：photoCover 封面 → photoCover 金句页 → tocFan 目录 → sectionGradient 分节 ×N → 内容页（navBarText + bigStat/photoGrid/honorList/certPodium/spreadTags/kvProfileCard）→ photoCover 金句收尾。人物照片为用户素材，组件留占位。

### 竞赛路演变体 contest（参考 fuwai-*.png，服务外包/互联网+/挑战杯类大赛）
签名母题：右上角大赛 logo+两行品牌字；绿建筑图标+青绿大字+双 chevron 页眉；亮蓝渐变结构色；正文 474747 + 橙/金关键词高亮；虚线分区框与粉彩步骤盒。

| 组件 | 参数 | 说明 |
|---|---|---|
| `contestHeader(s,o)` | title, icon?, fs, tc, logo, brand1, brand2 | 页眉：绿建筑图标 + 青绿大字（外阴影）+ 双 chevron；title 支持「核心技术一｜xxx」 |
| `logoCorner(s,o)` | logo, brand1, brand2, lx, ly | 右上角 logo + 两行品牌字（各页复用） |
| `bgContest(s)` | — | 极浅灰底 + 淡蓝几何碎片（模拟原版建筑线稿水印） |
| `pageLead(s,o)` | text/parts, fs | 页引导句（居中加粗，rich 高亮） |
| `coverContest(s,o)` | photo?, title, sub, slogan, chips[], ty | 封面：整幅照片 + 书法主标 + 雅酷黑副标 + 三色条 + 竖线口号 + 奶油胶囊 |
| `closingContest(s,o)` | photo?, t1, t2, t3, x | 收尾金句：蓝大字 + 长条金块箭头饰 + 灰粗副句 + 橙行楷 |
| `sectionPill(s,o)` | x, y, w, text, fs | 小节胶囊：浅渐变条 + 白方块 bullet + 藏青粗体 |
| `checkPills(s,o)` | x, y, items[], pw, dy | 勾选胶囊行：白勾选框 + 渐变蓝胶囊 + 斜粗（政策清单） |
| `dashCallout(s,o)` | x, y, w, h, text/parts, color, fs | 虚线圆角引言框（页顶导语/结论，默认蓝虚线） |
| `bottomBanner(s,o)` | text/parts, y, h, c1, c2 | 全宽渐变横幅 + 白粗体（页底结论） |
| `bulbCallout(s,o)` | text, y, h | 页底淡蓝结论条 + 青绿圆灯泡 |
| `footPills(s,o)` | items[], y, h | 页底淡紫渐变标签行（四段脚标） |
| `painCard(s,o)` | x, y, w, h, title, img?, tags[], parts | 痛点/特性卡：渐变藏青卡头 + 图位 + 标签行 + rich 正文 |
| `tagPills(s,o)` | x, y, w, items[], fs | 灰胶囊行（等宽，返回行尾） |
| `numCard(s,o)` | x, y, w, h, no, title, parts | 编号卡：渐变蓝方块 01 + 藏青标题 + rich 正文（粉描边） |
| `tealHeadCard(s,o)` | x, y, w, h, head, parts, color | 青绿片头卡：居中芯片头 + 正文 |
| `personaCard(s,o)` | x, y, w, h, title, color, text, icon? | 角色卡：图标位 + 彩色标题 + 正文 |
| `triColHeaders(s,o)` | titles[], y, gap | 三段式灰渐变栏头 + 浅蓝箭头（返回列宽） |
| `dashColumn(s,o)` | x, y, w, h, title, bw, hc | 虚线分区列 + 深蓝头条（返回内容区） |
| `metricPills(s,o)` | x, y, w, items[], cols | 白描边指标胶囊网格（返回底部 y） |
| `bigGold(s,o)` | x, y, caption, number, fs | 藏青说明胶囊 + 44pt 金色大数字 |
| `gradPanel(s,o)` | x, y, w, h, lines[], caption | 淡蓝渐变纵板 + 编号粗体行 + 藏青圆角说明条 |
| `capBox(s,o)` | x, y, w, h, title, text | 能力盒：渐变蓝标题条 + 白色内卡 |
| `hubRadial(s,o)` | cx, cy, title, sats[{x,y,lines,d}], product, pX, pw | 辐射中心：白环渐变圆 + 卫星圆组 + 产品胶囊 + 箭头 |
| `archBanner(s,o)` | x, y, w, text, fs | 架构横幅：渐变带 + 两侧燕尾翼（分层架构页） |
| `shotStrip(s,o)` | x, y, w, captions[], imgs[], ih | 字距拉开标题行（丨分隔）+ 截图横排（返回底部 y） |
| `stepBox(s,o)` | x, y, w, h, step, title, fill, lc | 步骤虚线盒「StepN:标题」（返回内容区；fill 传 CON 粉彩底） |
| `softBox(s,o)` | x, y, w, h, text, fill, line, bold | 粉彩软色块（步骤盒内小底块） |
| `flowTag(s,o)` | x, y, w, text, color, fs | 彩边白底胶囊（流程支线标签） |
| `infoCard(s,o)` | x, y, w, h, title, tf | 淡蓝信息卡 + 深蓝中宋标题（返回内容区） |
| `tagRow(s,o)` | x, y, items[], fs | 白描边小标签行，丨分隔（自适应宽度，返回行尾 x） |
| `formulaLine(s,o)` | x, y, w, label, formula, lc | 楷体斜粗标签 + Times 斜体公式 |
| `formulaCard(s,o)` | x, y, w, h, title, cols[{label,formula,num,nc}] | 公式支撑卡：N 列标签公式 + 「达到 X%」彩色大数字 |
| `sideLabel(s,o)` | x, y, text, fill | 侧标签芯片 + 右延长线（系统界面展示/技术原理式） |
| `captionShot(s,o)` | x, y, w, h, img?, caption | 截图 + 底部居中说明浮签 |
| `innovCard(s,o)` | x, y, w, h, img?, title, text | 创新点卡：插图位 + 中宋粗标题 + 居中说明 |
| `teamIntro(s,o)` | text, y, h | 团队引言带：半透明灰底 + 楷体加粗 |
| `memberCard(s,o)` | x, y, w, name, role, color, items[], avatar? | 成员卡：彩环头像 + 「名丨职务」胶囊 + 圆点清单 |
| `flowBand(s,o)` | x, y, w, steps[], fs | 灰蓝流程带 + 加粗步骤 + → |
| 基元 | `gradRect/gradPill/buildingIcon/measure` | 渐变矩形/胶囊、绿建筑图标、中西文估宽 |

**布局 tokens（S.CLT）与自动撑满——「紧凑、丰富」的机制化**：卡片族组件的间距/边距/字号一律引用 `S.CLT`，禁止手写新值：
`MX 0.45`（页边距）· `TOP 0.95`（内容区起点）· `GAP 0.2`（卡片间距）· `INSET 0.15`（内容边距）· `HINSET 0.12`（卡头边距）· `HEAD 0.42`（卡头高）· `R 0.06`（圆角）· `T 15`（卡标题字号）· `B 11`（正文字号）· `LH 1.22`（行距）

整页排布用两个布局件把参考件的撑满逻辑变成机制：
- `fillStack(s,{x,y,w,h,items[{draw|fn(area,i)}],gap})`：区域高度等分排 N 张卡——**卡高随区域算，底部永不留白**
- `gridAreas({x,y,w,h,cols,rows,gap})`：切分网格返回格子数组，组件只管往格子里画
- 标准页面配方：页眉(0.1~0.67) → 引导句(0.8) → 内容区(CLT.TOP~6.5) → 底条(6.6+)；先 `gridAreas` 分栏/分格，栏内再 `fillStack` 堆卡；文案长度按格高预算裁剪（约 = 格高-卡头-图位，每行 ≈ 格宽/字号×1.02 字）
- 验收：`check.py out.pptx --min-units 8` 报 [密度]（封面/分节/收尾等疏朗页豁免，人工判断）

### 竞赛路演变体配图生成族（glyph 图标 + diagram 图解件，参考 fuwai-08/05/13）
**画图判定**：示意图/流程图/结构图/迷你表/演示图形 → 用本族**现场绘制**（矢量、可改、风格统一）；截图/照片/论文/仪表盘实拍/复杂统计图（热力图、直方图）→ `imgPlaceholder` 占位等用户素材。

**图标字形 `glyph(s, name, x, y, d, color, o)`**：`o.mode` = `line`（默认，白底描边，ETL 圆底图标风）/ `fill`（实色主体+`o.lc` 色细节线，柱内白色图标风）。字形清单（GLYPHS，28 种）：
`user users db dbStack gear sync cloud cloudUp server chat monitor doc search warn bulb puzzle robot funnel book shield gauge barMini donutI ai building check cross bell`
——全由预设几何拼成（can/cloud/gear6/funnel/donut/blockArc/chord/teardrop/wedgeRoundRectCallout…），改色即换主题。常见组合：淡蓝圆底（BLUP 圆）+ line 字形 = 原版 ETL 步骤图标。

**图解连接件**：
| 组件 | 参数 | 说明 |
|---|---|---|
| `elbow(s,…)` | x1,y1,x2,y2,{arrow,dash,lw,color,hFirst,straight} | 直线/直角连线（象限翻转已处理，箭头恒在终点） |
| `forkArrow(s,…)` | from{x,y}, targets[{x,y}], {dash,arrow,color} | 一点向多点的汇聚（虚线）/分叉（实线箭头） |
| `miniTable(s,…)` | x,y,w,h,{cols,rows,head,headText,badge,line} | 迷你数据表：彩色表头+细网格+可选勾章（非标准→标准对比式） |
| `badgeCheck(s,…)` | x, y, d, color | 绿色勾章（达标/通过） |
| `vText(s,…)` | x, y, text, {fs,color} | 竖排一字一行标签（非标准数据/标准数据式） |
| `gradRectMS(s,…)` | x, y, w, h, stops[] | 多段渐变条（蓝→紫→橙→金页脚彩带） |

**数据演示件**：
| 组件 | 参数 | 说明 |
|---|---|---|
| `iconBarChart(s,o)` | x,y,w,h, title, items[{label,value,icon}], max, strip, stops | 图标柱状图（项目应用价值式）：渐变标题条+升序圆角柱+柱内白图标+扫升弧箭头+多段渐变脚条 |
| `eraLineChart(s,o)` | x,y,w,h, cats[], series[{name,values}], eras[{from,to,label,color}] | 分期折线图（十五五时期式）：原生折线+半透明分期带+带内标签 |
| `demoScatter(s,o)` | x,y,w,h,{seed,n,box,outX,dotColor} | 演示散点：坐标轴+种子随机点云+绿色区域框+红色离群✕ |
| `demoPartition(s,o)` | x,y,w,h,{seed,n,n2} | 演示划分图：随机隔离线+点云（孤立森林式） |
| `iTreeDraw(s,o)` | x,y,w,h,{highlight:left} | 3 层二叉树圆节点+边；highlight=left 左路径标红（短路径=异常） |

**文本/交互演示件**：
| 组件 | 参数 | 说明 |
|---|---|---|
| `sqlBlock(s,…)` | x, y, w, code, {fs,fill,h} | 代码块：浅灰圆角+Consolas 等宽（返回高度） |
| `chatBubble(s,…)` | x, y, w, h, text, {right,fill} | 对话气泡（用户提问/AI 回答式） |
| `comparePair(s,…)` | x, y, w, bad, good, {fs,h} | 纠错对比行：红✗错误 → 绿✓正确（查询纠错式） |
| `cycleFlow(s,…)` | cx, cy, r, items[], {d,fs,color} | 循环流程：n 个深色圆+顺时针弧箭头（数据→分析→决策→反馈式） |

**插图构图骨架**（创新点卡/技术页内的整幅小配图，全部由上述件拼装）：
- **多源汇聚**：flowTag ×N → forkArrow(dash) → glyph(funnel)+ETL 字 → elbow(arrow) → glyph(db)+glyph(shield fill)
- **监控看板**：glyph(monitor) 大尺寸 + 屏内 barMini/donutI/折线小件 + 底座
- **RAG 问答**：glyph(book)+知识库字 → chatBubble(提问) → glyph(robot)+AI 圆底 → flowTag ×3(红描边结果) + forkArrow(dash) 连接
- **多角色协同**：user glyph 圆底 ×3 + elbow(dash) 相连 + glyph(building fill) 城市底景
- **模块化循环**：flowTag ×3 → glyph(puzzle fill)+标签 → elbow(arrow) → cycleFlow(数据/分析/决策/反馈)
- **数据转换树**：softBox 父 → forkArrow → softBox 子 ×2 → miniTable 对比（蓝头/绿头）+ vText 两侧 + badgeCheck
- **画图坑**：`_line` 已处理象限翻转（箭头恒在终点，勿再手写 flip）；弧线 angleRange 顺时针、0°=3 点钟（扫升箭头用 [185,352]）；楔形气泡不要传 rectRadius（会产出 PowerPoint 判坏的 XML）；pptxgenjs 图表 series 必须自带 labels 数组。

### 共用
`rich(parts)` 关键词高亮富文本（必须配 fix_ppr.py）· `table(s,rows,o)` · `chartOpts()` 图表蓝系 · `statNumber` 红/蓝大数字 · `imgPlaceholder` 图片占位 · `pageNo` · `logo` · `card/txt` 基元

## 4. 版式骨架（典型内容页）

- **答辩·研究背景页**：tabNav → pageTitle(1.1) → introBand（现状数据）→ 左列 navyTag+卡片 ×2 / 右列图片占位 → calloutBand（页尾小结，可选）
- **答辩·对比页（国内外现状）**：tabNav → pageTitle(1.2) → 左右两列 chipCard ×3（研究方向/热点/应用），中缝 "国外 VS 国内" → 页码
- **答辩·进度页**：tabNav → pageTitle(4.1) → `table` 甘特/阶段表
- **商务·数据页**：bizHeader → bizBanner（板块标题）→ 白卡内 statItem ×4 → pillRow → rich 正文（关键词蓝标）
- **竞赛·痛点页**：contestHeader + logoCorner → pageLead → painCard ×4（渐变卡头+图位+标签+橙高亮正文）→ bottomBanner
- **竞赛·需求三栏**：triColHeaders（业务场景→核心需求→系统响应）→ personaCard ×3 / numCard ×4 / tealHeadCard ×4 三列对齐
- **竞赛·技术页（学术型）**：contestHeader「核心技术N｜名称」→ dashCallout 导语 → stepBox/softBox/flowTag 五步流程 或 infoCard ×4（tagRow + formulaLine + 图位）→ 公式支撑条/底带大数字
- **竞赛·五列管线**：dashCallout 导语 → pipeCol ×5（淡蓝头条+softBox/flowTag 内容+块箭头）→ sideLabel 应用实例条
- **竞赛·创新点**：pageLead → innovCard ×6（2 行 3 列）
- **竞赛·团队页**：contestHeader → teamIntro → memberCard ×5 → 团队协作流程 flowBand
- **竞赛·业务模式**：footPills 四段脚标 + gradPanel ×3 左列 + capBox ×2 + hubRadial（中心圆+卫星圆+产品胶囊）+ 右列说明卡 ×4

## 5. 禁忌（从参考件反推 + 通用好品味）

1. 不引入 tokens 之外的颜色；红/金只作数字与点缀，占比 <5%
2. 正文不滥用加粗；不整段居中（对比卡除外）
3. 一页只讲一件事；单页正文 ≤120 字，多了拆页
4. 虚线边框只用于对比卡/占位；实线卡不混虚线
5. 分节页不放正文；目录行数 = 章数（4-6）
6. 底部双带/波浪是签名母题，内容页二选一，不得都不加（除目录/分节页按规格）
7. 孤字换行 = 缺陷：通过增删字数或显式 breakLine 消灭
8. 行首禁则：全角标点不得出现在行首；长句用 \n 在句界显式断行更稳
9. 卡片高度贴合内容、文字垂直居中；跨页数据（日期/数字/人名）必须一致
10. **密度分层**：封面/目录/分节页简约；学术内容页必须丰富紧凑——信息单元 ≥8（常规 15-30），图解区占版面 ≥60%，禁止大留白。「看着很有料」是这类 PPT 的评价标准
11. **contest 专属**：正文用 `CON.INK`（474747）而非纯黑；关键词高亮用 ORANGE/GOLDD/RED，一页 ≤3 处主强调；渐变只走 `gradRect/gradPill`（现成的 lerp 切片），不要再造；布局尺寸一律走 `CLT` tokens，区域排布用 `fillStack/gridAreas` 撑满——手工算卡高导致底部留白 = 缺陷；文案按格高预算裁剪；中宋/楷体/书法字体缺失会回退，交付说明必须提醒（原版嵌入了汉仪/方正字体子集）。
