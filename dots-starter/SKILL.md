# 点点（Dots）设计规范 Skill

> **名称**：Dots Design System  
> **版本**：1.0.0  
> **作者**：赵川（米芾）  
> **更新**：2026-04-02  
> **标签**：design-system, components, vibe-coding, iOS

## 概述

为"点点"（Dots）AI 助手产品提供完整的设计规范和组件库。让非设计师（PM、运营、开发等）能通过 **vibe coding**（在 Cursor 中用自然语言描述需求，AI 自动生成代码）产出符合点点设计标准的 demo。

## 快速开始

1. 在 Cursor 中打开 `dots-starter` 文件夹
2. 浏览器打开 `assets/preview.html` 查看所有组件的渲染效果
3. 在 Cursor AI 对话框里描述你想做的功能
4. AI 会自动参考本规范和组件库生成代码

## 文件导航

```
dots-starter/
├── SKILL.md                          ← 本文件（技能入口）
├── references/
│   ├── design-system.md              ← 完整设计规范（颜色/字号/间距/圆角/动画/富文本）
│   └── components.md                 ← 组件库（14 个组件的 HTML + CSS 代码片段）
├── assets/
│   ├── css/
│   │   ├── tokens.css                ← CSS 变量定义（颜色/间距/圆角，含暗色模式）
│   │   ├── reset.css                 ← iOS 模拟重置
│   │   ├── app-shell.css             ← 框架层样式（状态栏/导航/输入栏）
│   │   └── content.css               ← 内容区样式（AI 按需生成写入此处）
│   ├── img/                          ← 图片资源（气泡尾巴/图标/状态栏等）
│   ├── lottie/
│   │   └── cloud.json                ← 思考中云朵呼吸动画
│   ├── index.html                    ← 主页面模板（框架已搭好）
│   └── preview.html                  ← 组件预览页（浏览器打开查看效果）
└── README.md                         ← 使用者入门指南
```

## 核心规范速查

### 设备画布
- 430 × 932px（iOS 大屏），圆角 54px，PingFang SC 字体

### 颜色 Token（亮色模式）

| 用途 | Token | 值 |
|------|-------|----|
| 页面背景 | `--bg` | `#F3F3F3` |
| 底栏背景 | `--bg1` | `#F7F7F7` |
| 弹出层背景 | `--bg3` | `#FFFFFF` |
| AI 气泡 | `--fillA` | `#FFFFFF` |
| 用户气泡 | `--fillB` | `#E6E6E6` |
| 卡片背景 | `--fill5` | `rgba(255,255,255,.8)` |
| 标题文字 | `--title` | `#141414 100%` |
| 段落文字 | `--paragraph` | `#141414 80%` |
| 描述文字 | `--description` | `#141414 60%` |
| 占位文字 | `--placeholder` | `#141414 16%` |
| 品牌绿 | `--info5` | `#6FD2BD` |
| 分割线 | `--separator2` | `rgba(20,20,20,.08)` |

### 圆角嵌套体系

```
设备外壳 54px → 富文本卡片 36px → 气泡/内容卡 22px → 输入框 16px → 标签 12px → 内部元素 8px
```

### 间距节奏

```
一级模块 32px → 二级模块 22px → 三级内容 16px → 行内 8px
```

### 富文本排版

| 级别 | 字号 | 字重 |
|------|------|------|
| H1 总标题 | 20pt | Semibold 600 |
| H2 一级模块 | 18pt | Semibold 600 |
| H3 二级模块 | 17pt | Semibold 600 |
| H4 三级模块 | 16pt | Semibold 600 |
| 正文段落 | 16pt | Regular 400 |

- 行高 ×1.7，字间距 +6%

### 气泡规范

| 属性 | AI 气泡 | 用户气泡 |
|------|---------|---------|
| 背景 | `#FFFFFF` | `#EBEBEB` |
| 边框 | 0.5px `#E6E6E6` | 0.5px `#DEDEDE` |
| 圆角 | 22px | 22px |
| 对齐 | 左对齐 | 右对齐 |
| 尾巴 | `tail-left.png` | `tail-right.png` |
| 字号 | 16px, 行高 1.69em, 字距 0.06em | 同左 |
| padding | 12px 20px | 12px 20px |

## 14 个组件

| # | 组件 | 关键规格 |
|---|------|---------|
| 1 | 对话气泡 | AI 白色左对齐 / 用户灰色右对齐，带尾巴图片 |
| 2 | 思考中状态 | Lottie 云朵呼吸动画（`lottie/cloud.json`） |
| 3 | 推荐词 | 灰色文字 + 右箭头 SVG |
| 4 | 时间标签 | 13px，居中，`--placeholder` 色 |
| 5 | AI 富文本卡片 | 圆角 36px，H1-H4 + 段落 + 列表 + 引用 + 分割线 |
| 6 | 内容卡片 | 毛玻璃背景，左文右图，标题单行截断，5 种变体 |
| 7 | 按钮 | 填充色仅品牌绿 `#6FD2BD`，三尺寸 48/36/28 |
| 8 | 标签 | 默认/选中(品牌绿)/禁用，圆角 12px |
| 9 | 输入框 | 聚焦态边框变品牌绿 |
| 10 | 圆形复选框 | `border-radius: 50%`，选中色品牌绿 |
| 11 | 分割线 | 0.5px，通栏/缩进 |
| 12 | 底部弹窗 | 遮罩 40% + 白色面板，红色仅用于危险操作文字 |
| 13 | 兜底卡片 | 不支持消息类型占位 |
| 14 | 对话流卡片 | 引用笔记评论的卡片，带来源信息 |

> 所有组件的完整 HTML + CSS 代码见 `references/components.md`

## 禁止清单

| 禁止项 | 正确做法 |
|--------|---------|
| ❌ 黑色填充按钮 | 填充按钮仅用品牌绿 `#6FD2BD` |
| ❌ 红色按钮 | 红色 `#FF2442` 仅用于 Bottom Sheet 危险操作文字 |
| ❌ 方形复选框 | 统一圆形 `border-radius: 50%` |
| ❌ 点点回复带头像 | AI 回复不带头像 |
| ❌ CSS 三点跳动动画 | 思考中用 Lottie 云朵动画 `cloud.json` |
| ❌ 内容卡片标题多行 | 标题单行截断 `white-space: nowrap` |
| ❌ 规范外间距值 | 只用 32 / 22 / 16 / 8 |
| ❌ 规范外圆角值 | 只用 54 / 36 / 22 / 16 / 12 / 8 |

## 详细文档

| 文档 | 说明 |
|------|------|
| `references/design-system.md` | 完整设计规范（14 章节，覆盖颜色/字体/间距/圆角/动画/组件/富文本/暗色模式） |
| `references/components.md` | 14 个组件的 HTML + CSS 代码片段，拿来即用 |

## 技术备忘

- **iOS 模拟**：430×932px，安全区 top 59px / bottom 34px
- **缩放适配**：`index.html` 头部 JS 根据窗口自动 scale
- **暗色模式**：`tokens.css` 通过 `@media (prefers-color-scheme: dark)` 实现
- **Lottie 依赖**：`lottie-web` CDN（5.12.2），`cloud.json` 内联 base64 图片无外部依赖
- **毛玻璃效果**：`backdrop-filter: blur(40px) saturate(180%)`，需 `-webkit-` 前缀

## 支持

问题或建议请联系 zhaochuan@xiaohongshu.com
