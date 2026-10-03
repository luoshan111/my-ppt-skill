# 蓝白学术风 PPT 技能包 · 安装说明（给接收方）

## 这是什么

一个 ZCode 技能包，封装了个人「蓝白学术风」PPT 设计系统，含两种工作模式：

- **模式 A 重画**：组件库（40+ 个版式组件）按你的内容重画生成 PPT，风格统一、可任意扩展。需要 Node.js + pptxgenjs
- **模式 B 模板克隆**：在 XML 层克隆原有 .pptx 模板页面、只替换文字，视觉与原版 100% 一致。需要 Python + python-pptx

## 安装步骤

1. **解压位置**（二选一，保持文件夹名 `blue-academic-ppt`）：
   - `C:\Users\<你的用户名>\.agents\skills\blue-academic-ppt\`
   - 或 `C:\Users\<你的用户名>\.zcode\skills\blue-academic-ppt\`
2. **安装依赖**：
   - [Node.js](https://nodejs.org)（LTS 版）→ 终端执行 `npm install -g pptxgenjs`
   - [Python](https://www.python.org) 3.10+ → 终端执行 `pip install python-pptx`（lxml 会一并装上）
   - 想用「模板克隆」模式：把可克隆的 .pptx 模板放入 `assets\templates\`，并按 `assets\templates\manifest.json` 的格式登记路径
3. **重启 ZCode**，直接说「用我的风格做个开题答辩 PPT」即可触发；也可以说「按蓝白学术风做一份项目汇报」。

## 注意事项

- `SKILL.md` 示例代码里的 `C:\Users\<用户名>\...` 记得换成你自己的路径（ZCode 加载技能时也会显示实际 Base directory，照着填即可）
- 模式 B 的质检渲染（scripts/render.ps1）依赖本机安装 Microsoft PowerPoint；没有 PowerPoint 也不影响生成，只是跳过视觉质检环节
- `assets\reference\` 里的图片是版式参考样例；`assets\templates\` 若缺失，克隆模式不可用，但重画模式完全不受影响
- 依赖的模板 pptx 版权归原作者/平台所有，请遵守其授权范围使用

## 文件结构

```
blue-academic-ppt/
├── SKILL.md            # 工作流与硬规则（ZCode 自动读取的入口）
├── INSTALL-好友安装说明.md
├── references/style-guide.md   # 设计规范 + 全组件参数手册
├── scripts/            # scaffold.js 组件库、clone_deck.py 克隆、check.py、render.ps1、fix_ppr.py
└── assets/reference/   # 版式参考渲染图
```
