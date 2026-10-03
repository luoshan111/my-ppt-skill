# 蓝白学术风 · 设计规范与组件手册

来源：用户三份参考 PPT 的程序化清点 + 渲染对照（`assets/reference/` 存有关键页渲染图）。
- 参考A `yiliao`：蓝白医学商务风（竞赛/项目汇报）
- 参考B `kaiti`：研究生开题答辩（浙大）
- 参考C `shuobo`：硕博答辩通用（浙大）

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

### 共用
`rich(parts)` 关键词高亮富文本（必须配 fix_ppr.py）· `table(s,rows,o)` · `chartOpts()` 图表蓝系 · `statNumber` 红/蓝大数字 · `imgPlaceholder` 图片占位 · `pageNo` · `logo` · `card/txt` 基元

## 4. 版式骨架（典型内容页）

- **答辩·研究背景页**：tabNav → pageTitle(1.1) → introBand（现状数据）→ 左列 navyTag+卡片 ×2 / 右列图片占位 → calloutBand（页尾小结，可选）
- **答辩·对比页（国内外现状）**：tabNav → pageTitle(1.2) → 左右两列 chipCard ×3（研究方向/热点/应用），中缝 "国外 VS 国内" → 页码
- **答辩·进度页**：tabNav → pageTitle(4.1) → `table` 甘特/阶段表
- **商务·数据页**：bizHeader → bizBanner（板块标题）→ 白卡内 statItem ×4 → pillRow → rich 正文（关键词蓝标）

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
