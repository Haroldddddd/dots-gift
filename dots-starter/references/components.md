# 点点（Dots）组件库

> 本规则文件包含所有可复用组件的 HTML + CSS 代码片段。
> 在 vibe coding 时，AI 应直接复用这些片段，并根据需要组合。
> 颜色使用 `assets/css/tokens.css` 中定义的 CSS 变量，详见 `references/design-system.md`。

---

## 使用说明

- 所有组件放在 `#content-area` 容器内
- CSS 样式直接写在 `assets/css/content.css` 或页面 `<style>` 标签中
- 图片资源位于 `assets/img/` 目录
- 组件可自由组合，但须遵循 `references/design-system.md` 中的间距与圆角规则

---

## 1. 对话气泡

> 核心对话组件。AI 气泡左对齐、用户气泡右对齐。点点不显示头像。
> 字号 16px，行高 1.69em，字间距 0.06em，padding 12px 20px。

### 2.1 AI 气泡（左对齐，带尾巴）

```html
<div class="msg-row msg-ai has-tail">
  <div class="msg-ai-bubble">
    这里是 AI 回复的文字内容。
    <img class="bubble-tail" src="img/tail-left.png" alt="" draggable="false">
  </div>
</div>
```

### 2.2 用户气泡（右对齐，带尾巴）

```html
<div class="msg-row msg-user has-tail">
  <div class="msg-user-bubble">
    这里是用户输入的内容
    <img class="bubble-tail" src="img/tail-right.png" alt="" draggable="false">
  </div>
</div>
```

### 2.3 连续气泡（无尾巴）

当同一方连续发多条消息时，仅最后一条带尾巴，之前的省略 `has-tail` 和尾巴图片：

```html
<!-- 连续 AI 消息 -->
<div class="msg-row msg-ai">
  <div class="msg-ai-bubble">第一条消息（无尾巴）</div>
</div>
<div class="msg-row msg-ai has-tail">
  <div class="msg-ai-bubble">
    第二条消息（带尾巴）
    <img class="bubble-tail" src="img/tail-left.png" alt="" draggable="false">
  </div>
</div>
```

### 气泡 CSS

```css
/* ---- 消息行容器 ---- */
.msg-row {
  margin-bottom: 20px;
  padding: 0;
}
.msg-row.has-tail {
  margin-bottom: 26px;         /* 不同侧切换时 26px */
}
/* 连续同侧间距：AI 16px，用户 8px */
.msg-row.msg-ai + .msg-row.msg-ai { margin-bottom: 16px; }
.msg-row.msg-user + .msg-row.msg-user { margin-bottom: 8px; }

/* ---- AI 气泡 ---- */
.msg-ai {
  display: flex;
  justify-content: flex-start;
}
.msg-ai-bubble {
  position: relative;
  width: fit-content;
  max-width: 346px;
  padding: 12px 20px;
  background: #FFFFFF;                /* Fill A */
  border-radius: 22px;
  border: .5px solid #E6E6E6;        /* Separator 2 */
  color: #0A0A0A;
  font-size: 16px;
  line-height: 1.69em;
  letter-spacing: 0.06em;
  overflow-wrap: break-word;
}
.msg-ai-bubble .bubble-tail {
  position: absolute;
  left: -1px;
  bottom: -11px;
  width: 24px;
  height: 24px;
  pointer-events: none;
  display: block;
}

/* ---- 用户气泡 ---- */
.msg-user {
  display: flex;
  justify-content: flex-end;
}
.msg-user-bubble {
  position: relative;
  width: fit-content;
  max-width: 346px;
  padding: 12px 20px;
  background: #EBEBEB;               /* Fill B */
  border: .5px solid #DEDEDE;
  border-radius: 22px;
  color: #0A0A0A;
  font-size: 16px;
  line-height: 1.69em;
  letter-spacing: 0.06em;
  overflow-wrap: break-word;
}
.msg-user-bubble .bubble-tail {
  position: absolute;
  right: -1px;
  bottom: -11px;
  width: 24px;
  height: 24px;
  pointer-events: none;
  display: block;
}
```

---

## 2. 思考中状态（Loading）

> 等待 AI 回复时的云朵呼吸动画，使用 Lottie（`lottie/cloud.json`）。
> 需要引入 lottie-web 库。

### 依赖

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
```

### HTML

```html
<div class="dd-loading show">
  <div class="loading-container">
    <div class="loading-lottie" id="loadingLottie"></div>
    <span class="loading-text">思考中...</span>
  </div>
</div>
```

### 初始化 JS

```js
// 在 DOM 就绪后调用
lottie.loadAnimation({
  container: document.getElementById('loadingLottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'lottie/cloud.json'
});
```

### CSS

```css
.dd-loading {
  align-self: flex-start;
  display: none;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin: 0;
  padding: 0;
}
.dd-loading.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
  margin-bottom: 12px;
}
.loading-container {
  display: inline-flex;
  align-items: center;
  height: 54px;
  border-radius: 24px;
  background: radial-gradient(
    ellipse at center,
    rgba(255,255,255,0.85) 30%,
    rgba(255,255,255,0.4) 70%,
    rgba(255,255,255,0) 100%
  );
  border: none;
  padding: 0 18px;
}
.loading-lottie {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.loading-text {
  font-size: 14px;
  color: var(--placeholder);
  white-space: nowrap;
  margin-left: 4px;
}
```

---

## 3. 推荐词

> 对话开始时的引导文案，点击触发对话。灰色文字 + 箭头。

### HTML

```html
<div class="keyword-list">
  <div class="kw-item">
    <span class="kw-text">帮我整理收藏的笔记</span>
    <span class="kw-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
  </div>
  <div class="kw-item">
    <span class="kw-text">推荐周末去哪玩</span>
    <span class="kw-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
  </div>
  <div class="kw-item">
    <span class="kw-text">最近有什么好物值得买</span>
    <span class="kw-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
  </div>
</div>
```

### CSS

```css
.keyword-list {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 0;
  margin-bottom: 60px;
  padding: 0 16px;
}
.kw-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  background: transparent;
  font-size: 15px;
  color: rgba(20,20,20,.6);          /* Description */
  cursor: pointer;
  align-self: flex-start;
  -webkit-user-select: none;
  user-select: none;
  transition: color 0.2s;
}
.kw-item:active { opacity: .5; }
.kw-arrow {
  flex-shrink: 0;
  color: rgba(20,20,20,.4);          /* Description Lighter */
  display: flex;
  align-items: center;
  justify-content: center;
}
.kw-arrow svg { width: 12px; height: 12px; }
```

---

## 4. 时间标签

> 对话流中的时间分隔。

### HTML

```html
<div class="time-label">刚刚</div>
```

### CSS

```css
.time-label {
  text-align: center;
  font-size: 13px;
  color: var(--placeholder);
  margin: 0 0 26px;
  align-self: center;
}
```

---

## 5. AI 富文本卡片

> 用于 AI 输出结构化内容。圆角 36px，间距遵循富文本规范：32→22→16。
> 字体 PingFang SC，行高 ×1.7，字距 +6%。

### HTML

```html
<div class="ai-card">
  <div class="ai-card-body">
    <h2>一级模块标题 (H2, 18pt)</h2>
    <h3>二级模块标题 (H3, 17pt)</h3>
    <p>正文段落。黑绷带面霜含有高浓度活性成分，适合干性至混合性肌肤。</p>
    <h3>另一个二级模块</h3>
    <p>取黄豆大小用量，以指腹轻轻按压的方式涂抹于面部。</p>
  </div>
</div>
```

### CSS

```css
.ai-card {
  width: 100%;
  max-width: 406px;
  background: rgba(255,255,255,.80);       /* Fill 5 */
  border-radius: 36px;                     /* 富文本卡片圆角 */
  border: .5px solid rgba(162,162,162,.24); /* Separator 2 */
  box-shadow: 0 4px 10px rgba(20,20,20,.04);
  overflow: hidden;
}
.ai-card-body {
  padding: 28px 24px;
  color: #0A0A0A;
  font-size: 16px;
  line-height: 1.69em;
  letter-spacing: 0.06em;
}
/* 富文本排版层级 — 字号遵循富文本规范 */
.ai-card-body h1 {
  font-size: 20px; line-height: 1.7; font-weight: 600;
  margin-bottom: 32px;   /* 总标题与一级模块间距 */
}
.ai-card-body h2 {
  font-size: 18px; line-height: 1.7; font-weight: 600;
  margin-bottom: 22px;   /* 一级模块标题 → 子内容 */
}
.ai-card-body h3 {
  font-size: 17px; line-height: 1.7; font-weight: 600;
  margin-bottom: 16px;   /* 二级模块标题 → 子内容 */
}
.ai-card-body h4 {
  font-size: 16px; line-height: 1.7; font-weight: 600;
  margin-bottom: 16px;   /* 三级模块标题 → 原子 */
}
.ai-card-body p {
  font-size: 16px; line-height: 1.7; letter-spacing: 0.06em;
  color: var(--paragraph);
  margin-bottom: 16px;
}
.ai-card-body p:last-child { margin-bottom: 0; }
/* 无序列表 */
.ai-card-body ul {
  padding-left: 14px;
  margin-bottom: 16px;
}
.ai-card-body ul li {
  font-size: 16px; line-height: 1.7; letter-spacing: 0.06em;
  color: var(--paragraph);
  margin-bottom: 4px;
}
/* 有序列表 */
.ai-card-body ol {
  padding-left: 14px;
  margin-bottom: 16px;
}
.ai-card-body ol li {
  font-size: 16px; line-height: 1.7; letter-spacing: 0.06em;
  color: var(--paragraph);
  margin-bottom: 4px;
}
/* 引用块 */
.ai-card-body blockquote {
  border-left: 3px solid var(--info5);
  padding-left: 14px;
  margin: 0 0 16px;
  color: var(--description);
  font-size: 16px;
  line-height: 1.7;
}
/* 分割线 */
.ai-card-body hr {
  border: none;
  height: 0.5px;
  background: rgba(20,20,20,.08);
  margin: 22px 0;
}
/* 行内元素 */
.ai-card-body strong { font-weight: 600; color: var(--title); }
.ai-card-body em { font-style: italic; }
.ai-card-body a { color: #0D4087; text-decoration: none; }
.ai-card-body a:hover { text-decoration: underline; }
.ai-card-body code {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  background: rgba(20,20,20,.05);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## 6. 内容卡片

> 所有内容引用统一使用同一卡片结构：「左文字 + 右缩略图」，毛玻璃背景。
> 支持笔记、个人页、POI、商品、外链 5 种内容类型。
> 右侧缩略图与卡片底部对齐。来源信息展示在副文案下方。

### 6.1 基础结构（笔记卡）

```html
<div class="content-card">
  <div class="content-card-body">
    <div class="content-card-title">笔记标题（单行截断）</div>
    <div class="content-card-desc">笔记正文内容摘要（最多两行截断）</div>
    <div class="content-card-source">
      <div class="content-card-source-icon">
        <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF2442"/></svg>
      </div>
      <span class="content-card-source-label">小红书</span>
    </div>
  </div>
  <img class="content-card-thumb" src="缩略图URL" alt="">
</div>
```

### 6.2 个人页卡（圆形头像）

副文案展示笔记数和粉丝数，缩略图改为圆形：

```html
<div class="content-card">
  <div class="content-card-body">
    <div class="content-card-title">用户昵称</div>
    <div class="content-card-desc">128篇笔记 · 2.3万粉丝</div>
    <div class="content-card-source">
      <div class="content-card-source-icon">
        <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF2442"/></svg>
      </div>
      <span class="content-card-source-label">小红书</span>
    </div>
  </div>
  <img class="content-card-thumb content-card-thumb-round" src="头像URL" alt="">
</div>
```

### 6.3 POI 地点卡

副文案展示区域、菜系和人均价格等标签信息：

```html
<div class="content-card">
  <div class="content-card-body">
    <div class="content-card-title">TRINE</div>
    <div class="content-card-desc">徐家汇 · 法餐 · ¥139/人</div>
    <div class="content-card-source">
      <div class="content-card-source-icon">
        <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF2442"/></svg>
      </div>
      <span class="content-card-source-label">小红书</span>
    </div>
  </div>
  <img class="content-card-thumb" src="封面URL" alt="">
</div>
```

### 6.4 商品卡

副文案展示价格和销量：

```html
<div class="content-card">
  <div class="content-card-body">
    <div class="content-card-title">蓝歧170克棉抓绒primaloft轻薄户外抓绒...</div>
    <div class="content-card-desc">¥169.9 &nbsp; 已售200+</div>
    <div class="content-card-source">
      <div class="content-card-source-icon">
        <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF2442"/></svg>
      </div>
      <span class="content-card-source-label">小红书</span>
    </div>
  </div>
  <img class="content-card-thumb" src="商品图URL" alt="">
</div>
```

### 6.5 外链卡

来源图标改为紫色，来源文案改为"链接网页"：

```html
<div class="content-card">
  <div class="content-card-body">
    <div class="content-card-title">黑绷带到底什么样？全网探店第一视角</div>
    <div class="content-card-desc">环黑五系列，即将上线</div>
    <div class="content-card-source">
      <div class="content-card-source-icon">
        <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#7B68EE"/></svg>
      </div>
      <span class="content-card-source-label">链接网页</span>
    </div>
  </div>
  <img class="content-card-thumb" src="页面截图URL" alt="">
</div>
```

### 6.6 各类型变体速查

| 类型 | 标题 | 副文案（desc） | 来源 | 缩略图 |
|------|------|----------------|------|--------|
| **笔记** | 笔记标题 | 笔记正文摘要 | 小红书（红色图标） | 方形 12px 圆角 |
| **个人页** | 用户昵称 | N篇笔记 · N万粉丝 | 小红书 | 圆形（`.content-card-thumb-round`） |
| **POI 地点** | 店名 | 区域 · 菜系 · ¥人均 | 小红书 | 方形 12px 圆角 |
| **商品** | 商品名 | ¥价格 · 已售N+ | 小红书 | 方形 12px 圆角 |
| **外链** | 页面标题 | 页面摘要 | 链接网页（紫色图标 #7B68EE） | 方形 12px 圆角 |

### 内容卡片 CSS

```css
.content-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 22px;
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08),
              0 1px 2px rgba(0,0,0,0.04);
  display: flex;
  align-items: flex-end;              /* 缩略图与底部对齐 */
  padding: 13px 13px 13px 18px;
  max-width: 280px;
}
.content-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
}
.content-card-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 24px;
  color: var(--title);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content-card-desc {
  font-size: 12px;
  line-height: 20px;
  color: var(--paragraph);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 来源信息 */
.content-card-source {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
.content-card-source-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.content-card-source-icon svg {
  width: 16px;
  height: 16px;
}
.content-card-source-label {
  font-size: 11px;
  color: var(--desc-lighter);
}
/* 缩略图 */
.content-card-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  margin-left: 10px;
  border-radius: 12px;
}
/* 个人页圆形头像 */
.content-card-thumb-round {
  border-radius: 50%;
}
```

---

## 7. 按钮

> 填充色仅用**品牌绿 #6FD2BD**，**禁止黑色和红色按钮**。
> 三种尺寸：Large (48px) / Medium (36px) / Mini (28px)。

### HTML

```html
<!-- 填充按钮 -->
<button class="btn btn-green btn-lg">品牌绿按钮</button>

<!-- 描边按钮 -->
<button class="btn btn-outline btn-md">描边按钮</button>

<!-- Ghost 和文本按钮 -->
<button class="btn btn-ghost btn-md">Ghost</button>
<button class="btn btn-text btn-md">文本按钮</button>

<!-- 禁用态 -->
<button class="btn btn-green btn-lg btn-disabled">禁用按钮</button>

<!-- 双按钮组合（常用于确认/取消） -->
<div class="btn-row btn-pair">
  <button class="btn btn-outline btn-lg">取消</button>
  <button class="btn btn-green btn-lg">确认</button>
</div>
```

### CSS

```css
.btn-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.btn-pair { width: 100%; }
.btn-pair .btn { flex: 1; }
.btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  border-radius: 24px;
  transition: all .15s;
}
.btn:active { transform: scale(.97); opacity: .6; }
/* 尺寸 */
.btn-lg { height: 48px; padding: 0 24px; font-size: 16px; }
.btn-md { height: 36px; padding: 0 16px; font-size: 14px; }
.btn-sm { height: 28px; padding: 0 12px; font-size: 12px; }
/* 颜色 — 仅品牌绿 */
.btn-green { background: var(--info5); color: #fff; }
.btn-outline {
  background: transparent;
  color: var(--title);
  border: 1px solid rgba(20,20,20,.08);
}
.btn-ghost { background: transparent; color: var(--title); }
.btn-text { background: transparent; color: var(--info5); border-radius: 0; }
.btn-disabled { opacity: .4; pointer-events: none; }
```

---

## 8. 标签

> 圆角 12px。三种状态：默认 / 选中（品牌绿） / 禁用。

### HTML

```html
<div class="tag-row">
  <div class="tag">默认标签</div>
  <div class="tag">美食</div>
  <div class="tag tag-selected">已选中</div>
  <div class="tag tag-disabled">禁用</div>
</div>
```

### CSS

```css
.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tag {
  height: 28px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  background: rgba(50,50,50,.05);      /* Inverted Fill 1 */
  color: var(--paragraph);
  border: 0.5px solid rgba(20,20,20,.08);
}
.tag-selected {
  background: rgba(111,210,189,.1);
  color: #2A8E74;
  border: 1px solid var(--info5);
}
.tag-disabled {
  background: rgba(20,20,20,.09);
  color: var(--desc-lighter);
  border: none;
}
```

---

## 9. 输入框

> 圆角 8px，聚焦时边框变品牌绿。

### HTML

```html
<div class="input-group">
  <label class="input-label">标签文字</label>
  <input class="input-field" type="text" placeholder="请输入内容...">
</div>
```

### CSS

```css
.input-group { width: 100%; }
.input-label {
  display: block;
  font-size: 14px;
  color: var(--paragraph);
  margin-bottom: 8px;
}
.input-field {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(20,20,20,.08);
  background: #FFFFFF;
  font-size: 16px;
  color: var(--title);
  font-family: inherit;
  outline: none;
  transition: border-color .2s;
}
.input-field::placeholder { color: var(--placeholder); }
.input-field:focus { border-color: var(--info5); }
```

---

## 10. 圆形复选框

> 全部使用圆形（border-radius: 50%），选中色为品牌绿。

### HTML

```html
<div class="checkbox-row">
  <label class="checkbox-item">
    <div class="checkbox"></div>
    <span class="checkbox-label">未选中</span>
  </label>
  <label class="checkbox-item">
    <div class="checkbox checkbox-checked">✓</div>
    <span class="checkbox-label">已选中</span>
  </label>
  <label class="checkbox-item">
    <div class="checkbox checkbox-disabled"></div>
    <span class="checkbox-label checkbox-label-disabled">禁用</span>
  </label>
</div>
```

### CSS

```css
.checkbox-row {
  display: flex;
  gap: 20px;
  align-items: center;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;                 /* 必须圆形 */
  border: 1.5px solid rgba(20,20,20,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all .15s;
}
.checkbox-checked {
  background: var(--info5);
  border-color: var(--info5);
  color: #fff;
  font-size: 14px;
}
.checkbox-disabled {
  border-color: rgba(20,20,20,.09);
}
.checkbox-label {
  font-size: 14px;
  color: var(--title);
}
.checkbox-label-disabled {
  color: var(--desc-lighter);
}
```

---

## 11. 分割线

> 高度 0.5px，颜色 Separator 2。支持通栏和缩进两种。

### HTML

```html
<!-- 通栏分割线 -->
<div class="divider"></div>

<!-- 缩进分割线（左缩进 16px） -->
<div class="divider divider-inset"></div>
```

### CSS

```css
.divider {
  height: 0.5px;
  background: rgba(20,20,20,.08);     /* Separator 2 */
  margin: 12px 0;
}
.divider-inset {
  margin-left: 16px;
}
```

---

## 12. 底部弹窗（Bottom Sheet）

> 遮罩 Mask Bg 2 + 白色面板 Bg 3 + 圆角 20px。

### HTML

```html
<!-- 遮罩层 -->
<div class="sheet-mask">
  <!-- 弹窗面板 -->
  <div class="sheet-panel">
    <div class="sheet-handle"></div>
    <div class="sheet-item">分享给好友</div>
    <div class="sheet-item">收藏</div>
    <div class="sheet-item sheet-danger">删除对话</div>
    <div class="sheet-item sheet-cancel">取消</div>
  </div>
</div>
```

### CSS

```css
.sheet-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.4);         /* Mask Bg 2 */
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet-panel {
  width: 100%;
  max-width: 430px;
  background: #FFFFFF;                /* Bg 3 */
  border-radius: 20px 20px 0 0;
  padding: 12px 0 20px;
}
.sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(20,20,20,.09);     /* Disabled */
  margin: 0 auto 16px;
}
.sheet-item {
  padding: 16px 20px;
  font-size: 16px;
  color: var(--title);
  text-align: center;
  cursor: pointer;
  transition: background .15s;
}
.sheet-item:active {
  background: rgba(20,20,20,.04);
}
.sheet-danger {
  color: #FF2442;                     /* 小红书红（仅用于危险操作文字） */
}
.sheet-cancel {
  color: var(--description);
  border-top: 0.5px solid rgba(20,20,20,.08);
}
```

---

## 13. 兜底卡片

> 不支持的消息类型展示的兜底提示。

### HTML

```html
<div class="fallback-card">
  <div class="fallback-text">当前暂不支持显示的消息类型</div>
</div>
```

### CSS

```css
.fallback-card {
  background: rgba(255,255,255,.80);
  border-radius: 22px;
  box-shadow: 0 4px 10px rgba(20,20,20,.04);
  padding: 20px 24px;
  width: 100%;
  max-width: 300px;
}
.fallback-text {
  font-size: 14px;
  color: var(--title);
  opacity: .4;
}
```

---

## 14. 对话流卡片（评论/图片卡）

> 对话流中引用笔记评论或分享图片的卡片。圆角 22px。

### HTML

```html
<div class="chat-card">
  <div class="chat-card-header">分享 @自由的风 的评论</div>
  <div class="chat-card-body">
    <div class="chat-card-title">这个真的好吃，算得上特色</div>
  </div>
  <div class="divider" style="margin: 12px 20px;"></div>
  <div class="chat-card-source">
    <div class="chat-card-source-thumb"></div>
    <div>
      <div class="chat-card-source-label">来自笔记</div>
      <div class="chat-card-source-text">求一些西双版纳的特色美食</div>
    </div>
  </div>
</div>
```

### CSS

```css
.chat-card {
  background: rgba(255,255,255,.80);
  border-radius: 22px;
  box-shadow: 0 4px 10px rgba(20,20,20,.04);
  overflow: hidden;
  width: 100%;
  max-width: 320px;
}
.chat-card-header {
  padding: 14px 20px 8px;
  font-size: 13px;
  color: var(--description);
}
.chat-card-body {
  padding: 0 20px 16px;
}
.chat-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--title);
  line-height: 1.5;
}
.chat-card-source {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 16px;
}
.chat-card-source-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #D4D4D4;
  border: 0.5px solid rgba(20,20,20,.08);
  flex-shrink: 0;
  overflow: hidden;
}
.chat-card-source-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.chat-card-source-label {
  font-size: 13px;
  color: var(--description);
}
.chat-card-source-text {
  font-size: 13px;
  color: var(--title);
  margin-top: 2px;
}
```

---

## 附录：组件间距速查

| 场景 | 间距 |
|------|------|
| 不同侧气泡切换（带尾巴） | 26px |
| 连续 AI 气泡 | 16px |
| 连续用户气泡 | 8px |
| AI 问候气泡 → 推荐词 | 12px |
| 推荐词 → 底部 | 60px |
| 时间标签 → 下方气泡 | 26px |
| 富文本一级模块间 | 32px |
| 富文本二级模块间 | 22px |
| 富文本三级模块间 | 16px |
| 按钮间 | 12px |
| 标签间 | 8px |

## 附录：禁止清单

- ❌ 黑色按钮和红色按钮（填充按钮仅用品牌绿，红色仅用于 Bottom Sheet 的危险操作文字）
- ❌ 方形复选框（必须圆形 border-radius: 50%）
- ❌ 点点头像（AI 回复不带头像）
- ❌ 间距使用规范外数值（只用 32 / 22 / 16 / 8）
- ❌ 圆角使用规范外数值（只用 54 / 36 / 22 / 16 / 12 / 8）
