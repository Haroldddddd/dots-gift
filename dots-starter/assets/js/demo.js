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

  // ── 5 件礼物的详情数据（推荐理由 + 用户口碑）
  const GIFTS = {
    '1': {
      name: 'Keychron Q1 Pro 75% 茶轴',
      price: '¥1,499',
      channel: '京东自营 · 1-3 天达',
      reason: 'TA 在《我的工位 setup》里说过"原装键盘打 8 小时手腕酸"，还晒过想换 75% 配列。Q1 Pro 茶轴段落感清脆又不吵同事，铝合金 Gasket 结构敲感扎实，恰好戳中 TA 一直没动手换的痛点。',
      quotes: [
        { text: '茶轴真的太合适了，办公室同事完全不嫌吵，回家打游戏也够爽。', author: '小红书用户 @机械键盘控' },
        { text: '从原装键盘换过来，手腕酸的问题一周就缓解了，这把就是为程序员做的。', author: '小红书用户 @深夜码农' },
        { text: '颜值在线，做工没得挑，配 Mac 一桌一秒变高级。', author: '小红书用户 @极简工位' },
      ],
    },
    '2': {
      name: 'Theragun Mini 第二代 深空灰',
      price: '¥1,290',
      channel: '天猫旗舰店 · 1-3 天达',
      reason: 'TA 在《练腿日记》里写过"深蹲完第二天爬不起来"，评论区还在问怎么放松。Mini 二代足够便携，办公室和健身房都能塞进包里，每天 5 分钟就能解决延迟性酸痛。',
      quotes: [
        { text: '深蹲完用 10 分钟，第二天爬楼梯不再像行刑，强烈推荐给有健身习惯的人。', author: '小红书用户 @铁姐健身日记' },
        { text: '比一代轻一半，办公室抽屉里就能放，午休放松肩颈贼舒服。', author: '小红书用户 @久坐打工人' },
      ],
    },
    '3': {
      name: 'Lululemon ABC 通勤长裤 28 寸',
      price: '¥980',
      channel: '天猫官方店 · 2-4 天达',
      reason: 'TA 在《通勤穿搭》里晒过同品牌 T 恤，配文"版型真的舒服"。ABC 长裤工装位特别预留了空间，健身房 → 通勤 → 周末出街一条裤子全搞定，正好契合 TA 的极简穿搭。',
      quotes: [
        { text: '直男友好版型，腿粗也能穿，弹力面料是真的舒服。', author: '小红书用户 @极简男装' },
        { text: '每周穿 5 天的程度，建议直接囤 2 条不同色。', author: '小红书用户 @通勤搭子' },
        { text: '版型挺括但完全不勒，健身完直接套上去开会都没问题。', author: '小红书用户 @CityWalk老张' },
      ],
    },
    '4': {
      name: 'AirPods Pro 2 USB-C',
      price: '¥1,899',
      channel: 'Apple 官网 · 次日达',
      reason: 'TA 在《通勤无声指南》里说过"地铁太吵根本没法看代码"。Pro 2 的降噪深度刚好补上 TA 旧版老款的痛点，自适应通透模式还能护听力，是 TA 不会主动给自己买、但会真心感谢的礼物。',
      quotes: [
        { text: '降噪比一代提升肉眼可见，地铁里几乎听不到外界。', author: '小红书用户 @Apple 全家桶' },
        { text: '通话降噪也很猛，远程会议不用再喊"等我换个地方"。', author: '小红书用户 @远程工位' },
      ],
    },
    '5': {
      name: 'ON Cloudmonster 跑鞋 42 黑白',
      price: '¥1,580',
      channel: 'ON 官方旗舰店 · 2-4 天达',
      reason: 'TA 关注了 ON 官方账号，还点赞过《跑鞋种草》合集。Cloudmonster 厚底缓震系列恰好适合 TA 这种力量型选手，黑白配色也是 TA 一贯的极简审美，跑步通勤两用。',
      quotes: [
        { text: '70kg 体重穿 5 公里完全没压力，缓震是真厚。', author: '小红书用户 @跑步小白成长记' },
        { text: '颜值是 ON 一贯的水准，配运动卫衣就是街头氛围。', author: '小红书用户 @穿搭日记' },
        { text: '健身房深蹲完去跑机也很顶，包裹感比 Cloud 5 好太多。', author: '小红书用户 @力量训练党' },
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
    revealBlock('.stage[data-stage="4"] .followup-line');
    revealBlock('.stage[data-stage="4"] .followup-keywords');

    bindFollowups();
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

    // 复用商品卡的内联 SVG 作为浮层主图
    const card = $(`.gift-list .gift-card[data-gift-id="${id}"]`);
    const thumbHtml = card ? card.querySelector('.content-card-thumb').innerHTML : '';
    $('#gd-thumb').innerHTML = thumbHtml;
    $('#gd-title').textContent = data.name;
    $('#gd-price').textContent = data.price;
    $('#gd-channel').textContent = data.channel;
    $('#gd-reason').textContent = data.reason;

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

    const mask = $('.gift-detail-mask');
    mask.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeGiftDetail() {
    const mask = $('.gift-detail-mask');
    mask.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // 浮层关闭/CTA 绑定（demo.js 在 body 末尾，DOM 已就绪）
  function bindGiftDetailPanel() {
    const mask = $('.gift-detail-mask');
    if (!mask || mask.dataset.bound) return;
    mask.dataset.bound = '1';
    $('.gift-detail-close').addEventListener('click', closeGiftDetail);
    mask.addEventListener('click', (e) => {
      if (e.target === mask) closeGiftDetail();
    });
    $('.gift-detail-cta').addEventListener('click', () => {
      const id = state.selectedGift;
      const data = id && GIFTS[id];
      // 卡片高亮选中态
      $$('.gift-list .gift-card').forEach((c) => c.classList.remove('selected'));
      const card = id && $(`.gift-list .gift-card[data-gift-id="${id}"]`);
      if (card) card.classList.add('selected');
      closeGiftDetail();
      if (!data) return;
      triggerStage5(data.name);
    });
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

  function bindFollowups() {
    $$('.followup-keywords .kw-item').forEach((el) => {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';
      el.addEventListener('click', () => {
        const action = el.dataset.action;
        const text = el.querySelector('.kw-text').textContent.trim();
        appendUserBubbleStage4(text);
        if (action === 'plan') {
          // 用第一件作为默认主礼物（若用户没在浮层里点过「就选这个」）
          const fallback = state.selectedGift && GIFTS[state.selectedGift]
            ? GIFTS[state.selectedGift].name
            : null;
          setTimeout(() => triggerStage5(fallback), 300);
        } else if (action === 'askcommunity') {
          setTimeout(openXhsOverlay, 300);
        } else {
          toast('小礼正在为你换一批…');
        }
      });
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

  // ── 阶段 5：完整送礼方案
  async function triggerStage5(giftName) {
    if (state.stage >= 5) return;
    const pick = giftName || 'Keychron Q1 Pro 75% 茶轴';
    appendUserBubbleStage4(`就选「${pick}」，帮我出完整方案`);
    showStage(5);
    await showThinking('正在为你定制送礼方案…', 1500);
    revealBlock('.plan-bubble');
    revealBlock('.plan-claim-bubble');
    bindClaimSkill();
  }

  function bindClaimSkill() {
    const btn = $('.btn-claim-skill');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      btn.classList.add('claimed');
      btn.textContent = '已收下';
      toast('经验包已收入你的工具箱');
    });
  }

  function appendUserBubbleStage5(text) {
    const stage = $('.stage[data-stage="5"]');
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
      revealBlock('.stage[data-stage="4"] .followup-line');
      revealBlock('.stage[data-stage="4"] .followup-keywords');
      bindFollowups();
      bindGiftCards();
    }
    if (target >= 5) {
      // 阶段 5：完整方案 + 收下经验包
      appendUserBubbleStage4('就选「Keychron Q1 Pro 75% 茶轴」，帮我出完整方案');
      showStage(5);
      revealBlock('.plan-bubble');
      revealBlock('.plan-claim-bubble');
      bindClaimSkill();
      state.stage = 5;
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
