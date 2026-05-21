/* ============================================================
   礼物推荐经验包 demo — 状态机
   阶段 0 引导 → 1 召唤 → 2 预告 → 3 表单 → 4 画像 + 礼物卡
   ============================================================ */

(function () {
  'use strict';

  const state = {
    stage: 0,
    form: { relation: '恋人', budget: '¥1000-2000', occasion: '生日' },
    lottieInstances: [],
    selectedGift: null,
  };

  // ── 通用占位主图 SVG（gallery 横划用，统一审美）
  function galleryImg(label, fromColor, toColor, textColor) {
    const tc = textColor || '#F5F5F7';
    return `
      <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gg-${label}-${fromColor.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${fromColor}"/>
            <stop offset="100%" stop-color="${toColor}"/>
          </linearGradient>
        </defs>
        <rect width="240" height="280" fill="url(#gg-${label}-${fromColor.replace('#','')})"/>
        <text x="120" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="34" font-weight="700" fill="${tc}" letter-spacing="2">${label}</text>
      </svg>`;
  }

  // ── 5 件礼物的详情数据（推荐理由 + 用户口碑 + 横划图廊 + 联想问题）
  const GIFTS = {
    '1': {
      name: 'Keychron Q1 Pro 75% 茶轴',
      price: '¥1,499',
      channel: '京东自营 · 1-3 天达',
      gallery: [
        galleryImg('Q1 PRO', '#3B3B3D', '#1F1F21'),
        galleryImg('75%', '#5A5A5C', '#2F2F31'),
        galleryImg('GASKET', '#2A2A2C', '#0F0F11'),
      ],
      reason: 'TA 在《我的工位 setup》里说过"原装键盘打 8 小时手腕酸"，还晒过想换 75% 配列。Q1 Pro 茶轴段落感清脆又不吵同事，铝合金 Gasket 结构敲感扎实，恰好戳中 TA 一直没动手换的痛点。',
      quotes: [
        { text: '茶轴真的太合适了，办公室同事完全不嫌吵，回家打游戏也够爽。', author: '小红书用户 @机械键盘控' },
        { text: '从原装键盘换过来，手腕酸的问题一周就缓解了，这把就是为程序员做的。', author: '小红书用户 @深夜码农' },
        { text: '颜值在线，做工没得挑，配 Mac 一桌一秒变高级。', author: '小红书用户 @极简工位' },
      ],
      followups: [
        { q: '适合搭配什么其他小礼物？', a: '配一只无印良品的木质护腕垫（¥99）刚刚好——TA 在意手腕，护腕垫是「天天用得上」的细节关心。再加一杯 TA 平时点的瑞幸美式 + 手写小卡，整体压在 ¥1,650 内，不破功不油腻。' },
        { q: '礼物卡片写什么合适？', a: '建议哑光黑卡 + 银墨，4 行就够：「送你一把不会让手腕喊累的键盘 / 往后写代码的每个深夜 / 都希望你听见的 / 是它脆而稳的回响。」呼应 TA 在《工位 setup》里说过的"打 8 小时手腕酸"。' },
        { q: '就要这个，给我购买地址', a: '帮你拉到了小红书电商的官方采购卡，点开就能直接下单：' },
      ],
    },
    '2': {
      name: 'Theragun Mini 第二代 深空灰',
      price: '¥1,290',
      channel: '天猫旗舰店 · 1-3 天达',
      gallery: [
        galleryImg('MINI 2', '#2C2C2E', '#1A1A1C'),
        galleryImg('DEEP', '#46464A', '#202024'),
        galleryImg('120MIN', '#3A3A3D', '#161618'),
      ],
      reason: 'TA 在《练腿日记》里写过"深蹲完第二天爬不起来"，评论区还在问怎么放松。Mini 二代足够便携，办公室和健身房都能塞进包里，每天 5 分钟就能解决延迟性酸痛。',
      quotes: [
        { text: '深蹲完用 10 分钟，第二天爬楼梯不再像行刑，强烈推荐给有健身习惯的人。', author: '小红书用户 @铁姐健身日记' },
        { text: '比一代轻一半，办公室抽屉里就能放，午休放松肩颈贼舒服。', author: '小红书用户 @久坐打工人' },
      ],
      followups: [
        { q: '配套放松流程怎么设计？', a: '附一张小卡写「3 分钟放松流程」就行：练完先用大圆头放松股四头肌 60 秒 → 锥形头压腘绳肌 60 秒 → 球形头滚小腿 60 秒。比硬塞说明书更走心，TA 会觉得你真的研究过。' },
        { q: '送筋膜枪卡片怎么写不油腻？', a: '别写"心疼你训练辛苦"这种话，TA 会觉得装。试试：「练腿日的第二天，本应该爬楼梯像行刑——以后不会了。」点到痛点就收，留白比煽情更打动人。' },
        { q: '就要这个，给我购买地址', a: '帮你拉到了小红书电商的官方采购卡，点开就能直接下单：' },
      ],
    },
    '3': {
      name: 'Lululemon ABC 通勤长裤 28 寸',
      price: '¥980',
      channel: '天猫官方店 · 2-4 天达',
      gallery: [
        galleryImg('ABC', '#5C5C5E', '#2E2E30'),
        galleryImg('28W', '#7A7A7C', '#3D3D3F'),
        galleryImg('STRETCH', '#48484A', '#202022'),
      ],
      reason: 'TA 在《通勤穿搭》里晒过同品牌 T 恤，配文"版型真的舒服"。ABC 长裤工装位特别预留了空间，健身房 → 通勤 → 周末出街一条裤子全搞定，正好契合 TA 的极简穿搭。',
      quotes: [
        { text: '直男友好版型，腿粗也能穿，弹力面料是真的舒服。', author: '小红书用户 @极简男装' },
        { text: '每周穿 5 天的程度，建议直接囤 2 条不同色。', author: '小红书用户 @通勤搭子' },
        { text: '版型挺括但完全不勒，健身完直接套上去开会都没问题。', author: '小红书用户 @CityWalk老张' },
      ],
      followups: [
        { q: '搭一双什么鞋显腿长？', a: '直接配 ON Cloud 5 全黑款（¥1,290）或 Salomon XT-6（¥1,580）—— TA 主页的穿搭里出现过低帮厚底鞋型，腿线被切得高，配 ABC 长裤显腿长一档。也可以兜底无印素白板鞋，安全不踩雷。' },
        { q: '送裤装的卡片文案怎么写？', a: '不要写"祝你越穿越帅"这种空话。试试：「不挑场合的裤子，配你不挑日子的好状态。」一语双关，TA 会会心一笑——这是你对 TA「健身房 → 通勤 → 街拍」生活节奏的洞察。' },
        { q: '就要这个，给我购买地址', a: '帮你拉到了小红书电商的官方采购卡，点开就能直接下单：' },
      ],
    },
    '4': {
      name: 'AirPods Pro 2 USB-C',
      price: '¥1,899',
      channel: 'Apple 官网 · 次日达',
      gallery: [
        galleryImg('PRO 2', '#F5F5F7', '#D5D5D7', '#1A1A1C'),
        galleryImg('USB-C', '#FFFFFF', '#E0E0E2', '#1A1A1C'),
        galleryImg('ANC', '#F0F0F2', '#C5C5C7', '#1A1A1C'),
      ],
      reason: 'TA 在《通勤无声指南》里说过"地铁太吵根本没法看代码"。Pro 2 的降噪深度刚好补上 TA 旧版老款的痛点，自适应通透模式还能护听力，是 TA 不会主动给自己买、但会真心感谢的礼物。',
      quotes: [
        { text: '降噪比一代提升肉眼可见，地铁里几乎听不到外界。', author: '小红书用户 @Apple 全家桶' },
        { text: '通话降噪也很猛，远程会议不用再喊"等我换个地方"。', author: '小红书用户 @远程工位' },
      ],
      followups: [
        { q: '配什么周边一起送更体面？', a: '加一只 BELLROY 真皮耳机收纳壳（¥299），TA 主页里出现过这个品牌的卡包，审美对得上。再附一张 NFC 标签（¥30）贴在 TA 工位上，碰一下自动播放最近常听的歌单——是「我懂你日常」的细节。' },
        { q: '送 AirPods 的卡片怎么写？', a: '试试：「地铁太吵也别紧张，把世界关掉的开关 / 这次我帮你按下了。」呼应 TA《通勤无声指南》里那句"地铁太吵根本没法看代码"，不刻意但句句在点上。' },
        { q: '就要这个，给我购买地址', a: '帮你拉到了小红书电商的官方采购卡，点开就能直接下单：' },
      ],
    },
    '5': {
      name: 'ON Cloudmonster 跑鞋 42 黑白',
      price: '¥1,580',
      channel: 'ON 官方旗舰店 · 2-4 天达',
      gallery: [
        galleryImg('CLOUDM', '#FAFAFC', '#D8D8DA', '#1A1A1C'),
        galleryImg('42 BLK', '#2A2A2C', '#0F0F11'),
        galleryImg('CLOUDTEC', '#EDEDEF', '#BFBFC1', '#1A1A1C'),
      ],
      reason: 'TA 关注了 ON 官方账号，还点赞过《跑鞋种草》合集。Cloudmonster 厚底缓震系列恰好适合 TA 这种力量型选手，黑白配色也是 TA 一贯的极简审美，跑步通勤两用。',
      quotes: [
        { text: '70kg 体重穿 5 公里完全没压力，缓震是真厚。', author: '小红书用户 @跑步小白成长记' },
        { text: '颜值是 ON 一贯的水准，配运动卫衣就是街头氛围。', author: '小红书用户 @穿搭日记' },
        { text: '健身房深蹲完去跑机也很顶，包裹感比 Cloud 5 好太多。', author: '小红书用户 @力量训练党' },
      ],
      followups: [
        { q: '配什么袜子或鞋垫一起送？', a: '搭 Stance Run 中筒袜 3 双装（¥159）—— TA 关注过的跑步博主出镜常穿。如果想加码，再加一副 Currex RunPro 中足弓鞋垫（¥299），ON 厚底鞋款配它能进一步缓解力量训练后的足弓压力。' },
        { q: '送跑鞋的祝福语怎么写？', a: '试试：「祝你下一次 PB / 不在配速里 / 在每一步落地的踏实里。」健身爱好者会懂——比起「祝身体健康」，TA 更需要「我尊重你的训练态度」。' },
        { q: '就要这个，给我购买地址', a: '帮你拉到了小红书电商的官方采购卡，点开就能直接下单：' },
      ],
    },
  };

  // ── DOM 引用
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const contentArea = $('#content-area');

  // ── 阶段切换
  function showStage(n) {
    $$('.stage').forEach((el) => {
      const idx = parseInt(el.dataset.stage, 10);
      if (idx <= n) el.classList.add('active');
    });
    state.stage = n;
    requestAnimationFrame(() => {
      contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
    });
  }

  // ── Lottie 思考态
  function mountLottie(container) {
    if (!window.lottie || !container) return null;
    return window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lottie/cloud.json',
    });
  }

  function showThinking(text, ms) {
    return new Promise((resolve) => {
      const node = document.createElement('div');
      node.className = 'dd-loading show stage-block';
      node.innerHTML = `
        <div class="loading-container">
          <div class="loading-lottie"></div>
          <span class="loading-text">${text}</span>
        </div>`;
      const stage = $('.stage[data-stage="4"]') || contentArea;
      stage.appendChild(node);
      const inst = mountLottie(node.querySelector('.loading-lottie'));
      if (inst) state.lottieInstances.push(inst);
      contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
      setTimeout(() => {
        node.style.transition = 'opacity .25s ease';
        node.style.opacity = '0';
        setTimeout(() => {
          if (inst && inst.destroy) inst.destroy();
          node.remove();
          resolve();
        }, 250);
      }, ms);
    });
  }

  // ── Toast
  function toast(msg) {
    let t = $('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  // ── 阶段 0：推荐词点击
  $$('.stage[data-stage="0"] .kw-item').forEach((el) => {
    el.addEventListener('click', () => {
      if (state.stage !== 0) return;
      const text = el.querySelector('.kw-text').textContent.trim();
      if (text.includes('男朋友')) {
        triggerStage1();
      } else {
        toast('当前 demo 仅演示「男朋友」场景');
      }
    });
  });

  function triggerStage1() {
    showStage(1);
  }

  // ── 阶段 1：经验包"使用"按钮
  $('.btn-skill-use').addEventListener('click', () => {
    if (state.stage !== 1) return;
    const btn = $('.btn-skill-use');
    btn.classList.add('activated');
    btn.textContent = '已接入';
    setTimeout(triggerStage2, 350);
  });

  function triggerStage2() {
    showStage(2);
    setTimeout(triggerStage3, 1100);
  }

  // ── 阶段 3：表单
  function triggerStage3() {
    showStage(3);
    bindFormChips();
    syncSubmitState();
  }

  function bindFormChips() {
    $$('.tag-row').forEach((row) => {
      const group = row.dataset.group;
      $$('.tag', row).forEach((tag) => {
        tag.addEventListener('click', () => {
          if (state.stage !== 3) return;
          $$('.tag', row).forEach((t) => t.classList.remove('tag-selected'));
          tag.classList.add('tag-selected');
          state.form[group] = tag.dataset.value;
          syncSubmitState();
        });
      });
    });
  }

  function syncSubmitState() {
    const ok = state.form.relation && state.form.budget && state.form.occasion;
    const btn = $('.btn-submit');
    if (ok) btn.classList.add('ready');
    else btn.classList.remove('ready');
  }

  $('.btn-submit').addEventListener('click', async () => {
    if (state.stage !== 3) return;
    if (!$('.btn-submit').classList.contains('ready')) return;
    // 用户点确定 → 立刻发选择摘要气泡
    const summary = `${state.form.relation} · ${state.form.budget} · ${state.form.occasion}`;
    appendUserBubble(summary);
    const xhsLink = ($('.form-input') && $('.form-input').value || '').trim();
    if (!xhsLink) {
      revealFallback();
      return;
    }
    triggerStage4();
  });

  function revealFallback() {
    // 把兜底气泡移动到 stage-3 末尾（user 气泡之后），再 reveal
    const stage = $('.stage[data-stage="3"]');
    const fallback = $('.fallback-line');
    if (stage && fallback) stage.appendChild(fallback);
    revealBlock('.fallback-line');
    state.awaitingFallbackInput = true;
    const inputEl = $('.dd-input-field');
    if (inputEl) {
      inputEl.placeholder = '聊聊 TA 是个怎样的人…';
      inputEl.focus();
    }
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  // 底部输入栏：兜底阶段接收用户文字描述
  (function bindBottomInput() {
    const inputEl = $('.dd-input-field');
    if (!inputEl) return;
    const submit = () => {
      if (!state.awaitingFallbackInput) return;
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      inputEl.placeholder = '给点点发消息...';
      state.awaitingFallbackInput = false;
      state.fallbackProvided = 'describe';
      appendUserBubble(text);
      setTimeout(() => triggerStage4(), 300);
    };
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
  })();

  // ── 阶段 4：画像卡 + 5 礼物卡
  async function triggerStage4() {
    showStage(4);

    await showThinking('正在分析 TA 的主页…', 1300);
    revealBlock('.persona-intro-bubble');
    revealBlock('.persona-card');
    revealBlock('.persona-insights-bubble');

    await showThinking('为 TA 挑选 5 件礼物…', 1300);
    revealBlock('.gift-intro-bubble');
    revealBlock('.gift-list');

    bindGiftCards();
  }

  // ── 商品卡点击 → 拉起详情浮层
  function bindGiftCards() {
    $$('.gift-list .gift-card').forEach((card) => {
      if (card.dataset.bound) return;
      card.dataset.bound = '1';
      card.addEventListener('click', () => openGiftDetail(card.dataset.giftId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGiftDetail(card.dataset.giftId);
        }
      });
    });
  }

  function openGiftDetail(id) {
    const data = GIFTS[id];
    if (!data) return;
    state.selectedGift = id;

    $('#gd-title').textContent = data.name;
    $('#gd-price').textContent = data.price;
    $('#gd-channel').textContent = data.channel;
    $('#gd-reason').textContent = data.reason;

    // 横划商品图廊：fallback 用商品卡的内联 SVG
    const galleryEl = $('#gd-gallery');
    const card = $(`.gift-list .gift-card[data-gift-id="${id}"]`);
    const fallbackThumb = card ? card.querySelector('.content-card-thumb').innerHTML : '';
    const items = (data.gallery && data.gallery.length ? data.gallery : [fallbackThumb]);
    galleryEl.innerHTML = items
      .map((svg) => `<div class="gift-detail-gallery-item">${svg}</div>`)
      .join('');
    galleryEl.scrollLeft = 0;

    const quotesEl = $('#gd-quotes');
    quotesEl.innerHTML = data.quotes
      .map(
        (q) => `
        <div class="gift-detail-quote">
          ${q.text}
          <div class="gift-detail-quote-author">${q.author}</div>
        </div>`
      )
      .join('');

    // 继续了解：联想问题
    const followupsEl = $('#gd-followups');
    const followups = data.followups || [];
    followupsEl.innerHTML = followups
      .map(
        (item, i) => `
        <button class="gift-detail-followup" type="button" data-index="${i}">
          <span>${item.q}</span>
          <span class="gift-detail-followup-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </button>`
      )
      .join('');

    const mask = $('.gift-detail-mask');
    mask.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeGiftDetail() {
    const mask = $('.gift-detail-mask');
    mask.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // 浮层关闭 + 「继续了解」联想问题委托
  function bindGiftDetailPanel() {
    const mask = $('.gift-detail-mask');
    if (!mask || mask.dataset.bound) return;
    mask.dataset.bound = '1';
    $('.gift-detail-close').addEventListener('click', closeGiftDetail);
    mask.addEventListener('click', (e) => {
      if (e.target === mask) closeGiftDetail();
    });

    const followupsEl = $('#gd-followups');
    followupsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.gift-detail-followup');
      if (!btn) return;
      const id = state.selectedGift;
      const data = id && GIFTS[id];
      if (!data) return;
      const idx = parseInt(btn.dataset.index, 10);
      const item = data.followups && data.followups[idx];
      if (!item) return;
      closeGiftDetail();
      askFollowup(idx);
    });
  }

  // ── 商品详情联想问题 → 用户气泡 + 思考态 + AI 回复 + 剩余联想 chip
  async function askFollowup(askedIdx) {
    const id = state.selectedGift;
    const data = id && GIFTS[id];
    const item = data && data.followups && data.followups[askedIdx];
    if (!item) return;

    // 清掉上一轮的联想 chip / 已发出的购买卡 / 收下气泡，避免堆积
    $$('.stage[data-stage="4"] .followup-chips, .stage[data-stage="4"] .purchase-card-row, .stage[data-stage="4"] .claim-bubble-row').forEach((el) => el.remove());

    appendUserBubbleStage4(item.q);
    await showThinking('小礼正在思考…', 900);

    // 第三条「就要这个，给我购买地址」：把回复文字与采购卡合并到同一气泡，再追加收下经验包气泡
    if (askedIdx === 2) {
      appendPurchaseCard(data, item.a);
      appendClaimBubble();
      return;
    }

    appendAiBubbleStage4(item.a);

    // 其他条目：展示后续联想问题（始终保留「就要这个，给我购买地址」）
    const remaining = data.followups
      .map((it, i) => ({ q: it.q, idx: i }))
      .filter((it) => it.idx !== askedIdx || it.idx === 2);
    if (remaining.length) appendFollowupChips(remaining);
  }

  // 商品采购卡（小红书电商样式）— 内嵌进 AI 气泡（复用组件库 .content-card 规范，44px 缩略图）
  function appendPurchaseCard(data, replyText) {
    const stage = $('.stage[data-stage="4"]');
    const card = data && state.selectedGift ? $(`.gift-list .gift-card[data-gift-id="${state.selectedGift}"]`) : null;
    const thumbHtml = card ? card.querySelector('.content-card-thumb').innerHTML : '';
    const row = document.createElement('div');
    row.className = 'msg-row msg-ai has-tail stage-block reveal purchase-card-row';
    row.innerHTML = `
      <div class="msg-ai-bubble">
        ${replyText}
        <div class="content-card purchase-content-card" role="button" tabindex="0">
          <div class="content-card-body">
            <div class="content-card-title">${data.name}</div>
            <div class="content-card-desc"><span class="purchase-price">${data.price}</span> · 平均 28 小时发货 · 7 天无理由退货</div>
            <div class="content-card-source">
              <span class="content-card-source-icon purchase-xhs-icon">小</span>
              <span class="content-card-source-label">小红书电商 · 点击下单</span>
            </div>
          </div>
          <div class="content-card-thumb">${thumbHtml}</div>
        </div>
        <img class="bubble-tail" src="img/tail-left.png" alt="" draggable="false">
      </div>`;
    stage.appendChild(row);
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  // 收下经验包：AI 气泡 + 内嵌品牌绿按钮（参照截图，按钮走规范 .btn .btn-green .btn-lg）
  function appendClaimBubble() {
    const stage = $('.stage[data-stage="4"]');
    const row = document.createElement('div');
    row.className = 'msg-row msg-ai has-tail stage-block reveal claim-bubble-row';
    row.innerHTML = `
      <div class="msg-ai-bubble claim-skill-bubble">
        <p class="claim-skill-text">看完有啥不清楚的随时问小礼~ 收下这条经验包，下次随时回来，不怕找不到。</p>
        <button class="btn-claim-skill" type="button">收下经验包</button>
        <img class="bubble-tail" src="img/tail-left.png" alt="" draggable="false">
      </div>`;
    stage.appendChild(row);

    const btn = row.querySelector('.btn-claim-skill');
    btn.addEventListener('click', () => {
      if (btn.classList.contains('claimed')) return;
      btn.classList.add('claimed');
      btn.textContent = '已收下';
      toast('经验包已收入你的工具箱');
    });

    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  function appendFollowupChips(items) {
    const stage = $('.stage[data-stage="4"]');
    const wrap = document.createElement('div');
    wrap.className = 'keyword-list followup-chips stage-block reveal';
    wrap.innerHTML = items
      .map(
        (it) => `
        <div class="kw-item" data-followup-idx="${it.idx}" role="button" tabindex="0">
          <span class="kw-text">${it.q}</span>
          <span class="kw-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>`
      )
      .join('');
    stage.appendChild(wrap);
    wrap.addEventListener('click', (e) => {
      const chip = e.target.closest('.kw-item');
      if (!chip) return;
      const idx = parseInt(chip.dataset.followupIdx, 10);
      askFollowup(idx);
    });
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  function appendAiBubbleStage4(text) {
    const stage = $('.stage[data-stage="4"]');
    const row = document.createElement('div');
    row.className = 'msg-row msg-ai has-tail stage-block';
    row.innerHTML = `
      <div class="msg-ai-bubble">
        ${text}
        <img class="bubble-tail" src="img/tail-left.png" alt="" draggable="false">
      </div>`;
    stage.appendChild(row);
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  function appendUserBubbleStage4(text) {
    const stage = $('.stage[data-stage="4"]');
    const row = document.createElement('div');
    row.className = 'msg-row msg-user has-tail stage-block';
    row.innerHTML = `
      <div class="msg-user-bubble">
        ${text}
        <img class="bubble-tail" src="img/tail-right.png" alt="" draggable="false">
      </div>`;
    stage.appendChild(row);
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }
  bindGiftDetailPanel();

  function appendUserBubble(text) {
    const stage = $('.stage[data-stage="3"]');
    const row = document.createElement('div');
    row.className = 'msg-row msg-user has-tail stage-block';
    row.innerHTML = `
      <div class="msg-user-bubble">
        ${text}
        <img class="bubble-tail" src="img/tail-right.png" alt="" draggable="false">
      </div>`;
    stage.appendChild(row);
    contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
  }

  function revealBlock(sel) {
    const el = $(sel);
    if (!el) return;
    el.classList.remove('hidden-block');
    el.classList.add('reveal');
    requestAnimationFrame(() => {
      contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
    });
  }

  // ── 小红书发布笔记浮层
  function openXhsOverlay() {
    const mask = $('.xhs-mask');
    if (!mask) return;
    mask.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeXhsOverlay() {
    const mask = $('.xhs-mask');
    if (!mask) return;
    mask.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
  function bindXhsOverlay() {
    const mask = $('.xhs-mask');
    if (!mask || mask.dataset.bound) return;
    mask.dataset.bound = '1';
    $('.xhs-back').addEventListener('click', closeXhsOverlay);
    $('.xhs-publish').addEventListener('click', () => {
      closeXhsOverlay();
      toast('已发布到小红书，等大家来 pick~');
    });
  }
  bindXhsOverlay();

  // ── 初始化
  // 通过 #stage=N 参数快进到指定阶段（供 prototype 外壳调用）
  async function fastForwardTo(target) {
    if (target <= 0) return;
    showStage(0);
    if (target >= 1) {
      // 阶段 1：经验包卡
      triggerStage1();
      const useBtn = $('.btn-skill-use');
      if (useBtn) {
        useBtn.classList.add('activated');
        useBtn.textContent = '已接入';
      }
    }
    if (target >= 3) {
      // 阶段 3：表单
      showStage(3);
      bindFormChips();
      syncSubmitState();
    }
    if (target >= 4) {
      // 阶段 4：画像 + 礼物卡（直接呈现，跳过思考态）
      const summary = `${state.form.relation} · ${state.form.budget} · ${state.form.occasion}`;
      appendUserBubble(summary);
      showStage(4);
      revealBlock('.persona-intro-bubble');
      revealBlock('.persona-card');
      revealBlock('.persona-insights-bubble');
      revealBlock('.gift-intro-bubble');
      revealBlock('.gift-list');
      bindGiftCards();
    }
  }

  function readStageFromHash() {
    const m = (window.location.hash || '').match(/stage=(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const target = readStageFromHash();
    if (target > 0) {
      fastForwardTo(target);
      return;
    }
    showStage(0);
  });
})();
