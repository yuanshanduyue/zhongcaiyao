(() => {
  'use strict';

  const allHerbs = Array.isArray(window.HERBS) ? window.HERBS : [];
  const categoryOrder = Array.isArray(window.CATEGORY_ORDER) ? window.CATEGORY_ORDER : [];
  const natureOptions = Array.isArray(window.NATURE_OPTIONS) ? window.NATURE_OPTIONS : [];
  const curatedImages = window.HERB_IMAGE_MAP || {};
  const STORAGE_KEY = 'bencao-favorites-v1';
  const PAGE_SIZE = 24;

  const state = {
    view: 'all',
    query: '',
    category: '全部',
    natures: new Set(),
    verifiedOnly: false,
    sort: 'default',
    visible: PAGE_SIZE,
    favorites: readFavorites(),
    daily: null,
    selected: null,
    quiz: { correct: 0, total: 1, herb: null, options: [], answered: false },
  };

  const dom = {
    categoryList: document.querySelector('#categoryList'),
    natureOptions: document.querySelector('#natureOptions'),
    verifiedOnly: document.querySelector('#verifiedOnly'),
    searchInput: document.querySelector('#searchInput'),
    searchClear: document.querySelector('#searchClear'),
    clearFilters: document.querySelector('#clearFilters'),
    resultCount: document.querySelector('#resultCount'),
    resultContext: document.querySelector('#resultContext'),
    herbGrid: document.querySelector('#herbGrid'),
    emptyState: document.querySelector('#emptyState'),
    loadMoreWrap: document.querySelector('#loadMoreWrap'),
    loadMore: document.querySelector('#loadMore'),
    sortSelect: document.querySelector('#sortSelect'),
    favoriteCount: document.querySelector('#favoriteCount'),
    activeFilters: document.querySelector('#activeFilters'),
    detailDialog: document.querySelector('#detailDialog'),
    detailPanel: document.querySelector('#detailPanel'),
    quizDialog: document.querySelector('#quizDialog'),
    quizContent: document.querySelector('#quizContent'),
    quizScore: document.querySelector('#quizScore'),
    quizTotal: document.querySelector('#quizTotal'),
    filtersPanel: document.querySelector('#filtersPanel'),
    filterBackdrop: document.querySelector('#filterBackdrop'),
    mobileViewButton: document.querySelector('#mobileViewButton'),
    toast: document.querySelector('#toast'),
  };

  let toastTimer;
  const imageCache = new Map();
  let cardImageObserver;

  function readFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.favorites]));
    } catch {
      // 收藏仍保留在当前会话，浏览器禁用存储时不阻塞页面。
    }
    dom.favoriteCount.textContent = String(state.favorites.size);
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[char]);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => dom.toast.classList.remove('is-visible'), 1800);
  }

  function deterministicDaily() {
    const now = new Date();
    const seed = Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
    const detailed = allHerbs.filter(herb => herb.verified);
    return detailed[seed % detailed.length] || allHerbs[seed % allHerbs.length];
  }

  async function getImage(herb) {
    if (imageCache.has(herb.name)) return imageCache.get(herb.name);
    const curated = curatedImages[herb.name];
    if (curated?.src) {
      const result = { ...curated, kind: 'specimen' };
      imageCache.set(herb.name, Promise.resolve(result));
      return result;
    }
    const request = fetch(herb.image, { headers: { Accept: 'application/json' } })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('image unavailable')))
      .then(data => {
        const source = data?.thumbnail?.source || data?.originalimage?.source || '';
        return source ? { src: source, page: `https://zh.wikipedia.org/wiki/${encodeURIComponent(herb.name)}`, source: '维基百科 / Wikimedia Commons', kind: 'wiki' } : null;
      })
      .catch(() => null);
    imageCache.set(herb.name, request);
    return request;
  }

  function imageAttribution(herb) {
    const curated = curatedImages[herb.name];
    return curated || {
      page: `https://zh.wikipedia.org/wiki/${encodeURIComponent(herb.name)}`,
      source: '维基百科 / Wikimedia Commons',
    };
  }

  async function setHerbImage(imageElement, herb) {
    const image = await getImage(herb);
    if (!image?.src || !imageElement.isConnected) return;
    imageElement.onload = () => imageElement.classList.add('is-loaded');
    imageElement.onerror = () => imageElement.removeAttribute('src');
    imageElement.src = image.src;
  }

  async function loadCardImage(container) {
    if (!container || container.dataset.imageState !== 'pending') return;
    const herb = allHerbs.find(item => item.id === container.dataset.herbId);
    const imageElement = container.querySelector('.herb-thumb-image');
    if (!herb || !imageElement) return;
    container.dataset.imageState = 'loading';
    const imageData = await getImage(herb);
    if (!container.isConnected) return;
    if (!imageData?.src) {
      container.dataset.imageState = 'fallback';
      return;
    }
    imageElement.addEventListener('load', () => {
      container.dataset.imageState = 'loaded';
      imageElement.classList.add('is-loaded');
    }, { once: true });
    imageElement.addEventListener('error', () => {
      container.dataset.imageState = 'fallback';
      imageElement.removeAttribute('src');
    }, { once: true });
    imageElement.src = imageData.src;
  }

  function hydrateCardImages() {
    const containers = [...document.querySelectorAll('.herb-thumb[data-herb-id]')];
    if (!containers.length) return;
    if (!cardImageObserver && 'IntersectionObserver' in window) {
      cardImageObserver = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach(entry => {
          loadCardImage(entry.target);
          cardImageObserver.unobserve(entry.target);
        });
      }, { rootMargin: '280px 0px' });
    }
    containers.forEach(container => {
      if (cardImageObserver) cardImageObserver.observe(container);
      else loadCardImage(container);
    });
  }

  function renderDaily() {
    const herb = state.daily;
    if (!herb) return;
    document.querySelector('#dailyTitle').textContent = herb.name;
    document.querySelector('#dailyPinyin').textContent = herb.pinyin;
    document.querySelector('#dailyEfficacy').textContent = herb.efficacy;
    document.querySelector('#dailyFallback').textContent = herb.name.slice(0, 1);
    document.querySelector('#dailyMeta').innerHTML = [herb.category, `${herb.nature}性`, herb.channels]
      .map(item => `<span>${escapeHtml(item)}</span>`).join('');
    const image = document.querySelector('#dailyImage');
    image.alt = `${herb.name}药材图片`;
    setHerbImage(image, herb);
  }

  function renderFilterControls() {
    const counts = new Map(categoryOrder.map(category => [
      category,
      allHerbs.filter(herb => herb.category === category).length,
    ]));
    dom.categoryList.innerHTML = [
      `<button class="category-button is-active" type="button" data-category="全部"><span>全部药材</span><span class="count">${allHerbs.length}</span></button>`,
      ...categoryOrder.map(category => `
        <button class="category-button" type="button" data-category="${escapeHtml(category)}">
          <span>${escapeHtml(category)}</span><span class="count">${counts.get(category)}</span>
        </button>`),
    ].join('');

    dom.natureOptions.innerHTML = natureOptions.map(nature => `
      <label class="nature-chip">
        <input type="checkbox" value="${escapeHtml(nature)}">
        <span>${escapeHtml(nature)}</span>
      </label>`).join('');
  }

  function filteredHerbs() {
    const terms = state.query.toLocaleLowerCase('zh-CN').split(/\s+/).filter(Boolean);
    const indexed = allHerbs.map((herb, index) => ({ herb, index }));
    const results = indexed.filter(({ herb }) => {
      if (state.view === 'favorites' && !state.favorites.has(herb.id)) return false;
      if (state.category !== '全部' && herb.category !== state.category) return false;
      if (state.natures.size && !state.natures.has(herb.nature)) return false;
      if (state.verifiedOnly && !herb.verified) return false;
      if (!terms.length) return true;
      const haystack = [herb.name, herb.pinyin, herb.category, herb.nature, herb.taste, herb.channels, herb.efficacy, herb.indications]
        .join(' ').toLocaleLowerCase('zh-CN');
      return terms.every(term => haystack.includes(term));
    });

    results.sort((a, b) => {
      if (state.sort === 'name') return a.herb.name.localeCompare(b.herb.name, 'zh-CN');
      if (state.sort === 'category') {
        const categoryDiff = categoryOrder.indexOf(a.herb.category) - categoryOrder.indexOf(b.herb.category);
        return categoryDiff || a.herb.name.localeCompare(b.herb.name, 'zh-CN');
      }
      return a.index - b.index;
    });
    return results.map(item => item.herb);
  }

  function herbCard(herb) {
    const favorite = state.favorites.has(herb.id);
    return `
      <article class="herb-card" data-herb-id="${herb.id}" data-accent="${herb.accent}" tabindex="0" aria-label="查看${escapeHtml(herb.name)}详情">
        <div class="herb-thumb" data-herb-id="${herb.id}" data-image-state="pending">
          <span class="herb-glyph" aria-hidden="true">${escapeHtml(herb.name.slice(0, 1))}</span>
          <img class="herb-thumb-image" loading="lazy" decoding="async" fetchpriority="low" alt="" aria-hidden="true">
          <span class="image-label" aria-hidden="true"><i data-lucide="image"></i><span>参考图</span></span>
        </div>
        <div class="herb-main">
          <div class="herb-title-row">
            <h3>${escapeHtml(herb.name)}</h3>
            ${herb.verified ? '<span class="verified-mark" title="详录条目"><i data-lucide="badge-check"></i></span>' : ''}
          </div>
          <p class="herb-pinyin">${escapeHtml(herb.pinyin)}</p>
          <p class="herb-efficacy">${escapeHtml(herb.efficacy)}</p>
          <span class="herb-category">${escapeHtml(herb.category)}</span>
        </div>
        <button class="icon-button favorite-button${favorite ? ' is-active' : ''}" type="button" data-favorite="${herb.id}" title="${favorite ? '取消收藏' : '收藏'}" aria-label="${favorite ? '取消收藏' : '收藏'}${escapeHtml(herb.name)}">
          <i data-lucide="bookmark"></i>
        </button>
        <i class="card-arrow" data-lucide="arrow-right" aria-hidden="true"></i>
      </article>`;
  }

  function renderActiveFilters() {
    const tokens = [];
    if (state.category !== '全部') tokens.push({ key: 'category', label: state.category });
    state.natures.forEach(nature => tokens.push({ key: `nature:${nature}`, label: `${nature}性` }));
    if (state.verifiedOnly) tokens.push({ key: 'verified', label: '仅看详录' });
    dom.activeFilters.innerHTML = tokens.map(token => `
      <span class="filter-token">${escapeHtml(token.label)}
        <button type="button" data-remove-filter="${escapeHtml(token.key)}" title="移除此筛选" aria-label="移除${escapeHtml(token.label)}筛选"><i data-lucide="x"></i></button>
      </span>`).join('');
  }

  function renderLibrary() {
    const results = filteredHerbs();
    const visible = results.slice(0, state.visible);
    cardImageObserver?.disconnect();
    dom.resultCount.textContent = String(results.length);
    dom.resultContext.textContent = state.view === 'favorites' ? '我的收藏' : (state.query ? `搜索“${state.query}”` : '完整药材库');
    dom.herbGrid.innerHTML = visible.map(herbCard).join('');
    dom.emptyState.hidden = results.length !== 0;
    dom.loadMoreWrap.hidden = !results.length || visible.length >= results.length;
    dom.loadMore.querySelector('span').textContent = `继续浏览（${results.length - visible.length}）`;
    dom.searchClear.hidden = !state.query;
    renderActiveFilters();
    refreshIcons();
    hydrateCardImages();
  }

  function updateCategory(category) {
    state.category = category;
    state.visible = PAGE_SIZE;
    document.querySelectorAll('[data-category]').forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    renderLibrary();
  }

  function clearFilters({ keepView = true } = {}) {
    state.query = '';
    state.category = '全部';
    state.natures.clear();
    state.verifiedOnly = false;
    state.visible = PAGE_SIZE;
    if (!keepView) state.view = 'all';
    dom.searchInput.value = '';
    dom.verifiedOnly.checked = false;
    document.querySelectorAll('.nature-chip input').forEach(input => { input.checked = false; });
    updateCategory('全部');
    syncViewTabs();
  }

  function toggleFavorite(id) {
    const herb = allHerbs.find(item => item.id === id);
    if (!herb) return;
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast(`已取消收藏：${herb.name}`);
    } else {
      state.favorites.add(id);
      showToast(`已收藏：${herb.name}`);
    }
    saveFavorites();
    renderLibrary();
    if (state.selected?.id === id && dom.detailDialog.open) renderDetail(herb);
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }

  function relatedHerbs(herb) {
    return allHerbs.filter(item => item.category === herb.category && item.id !== herb.id).slice(0, 4);
  }

  function renderDetail(herb) {
    state.selected = herb;
    const favorite = state.favorites.has(herb.id);
    const related = relatedHerbs(herb);
    const attribution = imageAttribution(herb);
    dom.detailPanel.innerHTML = `
      <section class="detail-hero">
        <div class="detail-image">
          <div class="image-fallback" aria-hidden="true">${escapeHtml(herb.name.slice(0, 1))}</div>
          <img id="detailHerbImage" alt="${escapeHtml(herb.name)}药材参考图">
        </div>
        <div class="detail-heading">
          <span class="eyebrow">药材详录</span>
          <h2>${escapeHtml(herb.name)}</h2>
          <p class="pinyin">${escapeHtml(herb.pinyin)}</p>
          <span class="category-pill">${escapeHtml(herb.category)}</span>
        </div>
        <button class="icon-button detail-close" type="button" data-close-dialog="detailDialog" title="关闭" aria-label="关闭详情">
          <i data-lucide="x"></i>
        </button>
      </section>
      <div class="detail-body">
        <div class="detail-actions">
          <button class="button button-secondary${favorite ? ' is-active' : ''}" type="button" data-favorite="${herb.id}">
            <i data-lucide="bookmark"></i><span>${favorite ? '已收藏' : '收藏'}</span>
          </button>
          <button class="button button-secondary" type="button" data-copy-herb="${herb.id}">
            <i data-lucide="copy"></i><span>复制摘要</span>
          </button>
        </div>
        <div class="fact-strip">
          <div class="fact-item"><span>药性</span><strong>${escapeHtml(herb.nature)}</strong></div>
          <div class="fact-item"><span>药味</span><strong>${escapeHtml(herb.taste)}</strong></div>
          <div class="fact-item"><span>归经</span><strong>${escapeHtml(herb.channels)}</strong></div>
        </div>
        <section class="detail-section">
          <h3><i data-lucide="sparkles"></i>功效</h3>
          <p>${escapeHtml(herb.efficacy)}</p>
        </section>
        <section class="detail-section">
          <h3><i data-lucide="list-checks"></i>常见主治</h3>
          <p>${escapeHtml(herb.indications)}</p>
        </section>
        <section class="detail-section">
          <h3><i data-lucide="map-pin"></i>药用部位与产地</h3>
          <p>${escapeHtml(herb.part)} · ${escapeHtml(herb.origin)}</p>
        </section>
        <div class="caution-box">
          <i data-lucide="shield-alert"></i>
          <p><strong>使用注意：</strong>${escapeHtml(herb.caution)}</p>
        </div>
        <div class="record-status">
          <i data-lucide="${herb.verified ? 'badge-check' : 'circle-dashed'}"></i>
          <span>${herb.verified ? '详录条目：已整理核心教材字段，仍应以正式教材和专业人员意见为准。' : '分类索引条目：当前内容仅作分类记忆提示，具体信息请查阅正式教材。'}</span>
        </div>
        <p class="image-source">
          <i data-lucide="external-link"></i>
          <span>图片来源：</span>
          <a href="${escapeHtml(attribution.page)}" target="_blank" rel="noopener noreferrer">${escapeHtml(attribution.source)}</a>
        </p>
        ${related.length ? `
          <section class="detail-section">
            <h3><i data-lucide="network"></i>同类药材</h3>
            <div class="related-list">
              ${related.map(item => `<button class="related-item" type="button" data-related="${item.id}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.efficacy)}</span></button>`).join('')}
            </div>
          </section>` : ''}
      </div>`;
    refreshIcons();
    setHerbImage(document.querySelector('#detailHerbImage'), herb);
  }

  function openDetail(herb) {
    if (!herb) return;
    renderDetail(herb);
    if (!dom.detailDialog.open) dom.detailDialog.showModal();
  }

  function syncViewTabs() {
    document.querySelectorAll('[data-view]').forEach(button => {
      const active = button.dataset.view === state.view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const target = state.view === 'favorites' ? 'all' : 'favorites';
    const label = target === 'favorites' ? '查看收藏' : '返回药材库';
    dom.mobileViewButton.title = label;
    dom.mobileViewButton.setAttribute('aria-label', label);
    dom.mobileViewButton.innerHTML = `<i data-lucide="${target === 'favorites' ? 'bookmark' : 'library'}"></i>`;
    refreshIcons();
  }

  function setView(view) {
    state.view = view;
    state.visible = PAGE_SIZE;
    syncViewTabs();
    renderLibrary();
  }

  function copyHerb(herb) {
    const text = `${herb.name}（${herb.pinyin}）\n分类：${herb.category}\n性味：${herb.nature}，${herb.taste}\n归经：${herb.channels}\n功效：${herb.efficacy}\n主治：${herb.indications}\n注意：${herb.caution}`;
    if (!navigator.clipboard?.writeText) {
      showToast('浏览器未提供复制功能');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => showToast(`已复制${herb.name}摘要`))
      .catch(() => showToast('浏览器未允许复制'));
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const next = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[next]] = [copy[next], copy[index]];
    }
    return copy;
  }

  function nextQuiz() {
    const pool = allHerbs.filter(herb => herb.verified);
    const herb = pool[Math.floor(Math.random() * pool.length)];
    const alternatives = shuffle(categoryOrder.filter(category => category !== herb.category)).slice(0, 3);
    state.quiz.herb = herb;
    state.quiz.options = shuffle([herb.category, ...alternatives]);
    state.quiz.answered = false;
    renderQuiz();
  }

  function renderQuiz() {
    const { herb, options, answered } = state.quiz;
    dom.quizScore.textContent = `${state.quiz.correct} 题答对`;
    dom.quizTotal.textContent = `第 ${state.quiz.total} 题`;
    dom.quizContent.innerHTML = `
      <div class="quiz-question">
        <div class="quiz-glyph" aria-hidden="true">${escapeHtml(herb.name.slice(0,1))}</div>
        <p><strong>「${escapeHtml(herb.name)}」</strong> 属于哪一类中药？</p>
      </div>
      <div class="quiz-options">
        ${options.map(option => `<button class="quiz-option" type="button" data-quiz-option="${escapeHtml(option)}" ${answered ? 'disabled' : ''}>${escapeHtml(option)}</button>`).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>`;
    refreshIcons();
  }

  function answerQuiz(answer) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;
    const correct = answer === state.quiz.herb.category;
    if (correct) state.quiz.correct += 1;
    dom.quizContent.querySelectorAll('[data-quiz-option]').forEach(button => {
      button.disabled = true;
      if (button.dataset.quizOption === state.quiz.herb.category) button.classList.add('is-correct');
      else if (button.dataset.quizOption === answer) button.classList.add('is-wrong');
    });
    dom.quizScore.textContent = `${state.quiz.correct} 题答对`;
    const feedback = document.querySelector('#quizFeedback');
    feedback.innerHTML = `
      <p>${correct ? '回答正确。' : `正确答案是“${escapeHtml(state.quiz.herb.category)}”。`} ${escapeHtml(state.quiz.herb.efficacy)}</p>
      <button class="button button-primary" type="button" data-next-quiz>下一题<i data-lucide="arrow-right"></i></button>`;
    refreshIcons();
  }

  function openQuiz() {
    if (!state.quiz.herb) nextQuiz();
    if (!dom.quizDialog.open) dom.quizDialog.showModal();
  }

  function openFilters() {
    dom.filtersPanel.classList.add('is-open');
    dom.filterBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeFilters() {
    dom.filtersPanel.classList.remove('is-open');
    dom.filterBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  function bindEvents() {
    dom.searchInput.addEventListener('input', event => {
      state.query = event.target.value.trim();
      state.visible = PAGE_SIZE;
      renderLibrary();
    });

    dom.searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const first = filteredHerbs()[0];
        if (first) openDetail(first);
      }
    });

    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        dom.searchInput.focus();
      }
    });

    dom.searchClear.addEventListener('click', () => {
      state.query = '';
      dom.searchInput.value = '';
      dom.searchInput.focus();
      renderLibrary();
    });

    dom.categoryList.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (button) updateCategory(button.dataset.category);
    });

    dom.natureOptions.addEventListener('change', event => {
      if (!event.target.matches('input')) return;
      if (event.target.checked) state.natures.add(event.target.value);
      else state.natures.delete(event.target.value);
      state.visible = PAGE_SIZE;
      renderLibrary();
    });

    dom.verifiedOnly.addEventListener('change', event => {
      state.verifiedOnly = event.target.checked;
      state.visible = PAGE_SIZE;
      renderLibrary();
    });

    dom.sortSelect.addEventListener('change', event => {
      state.sort = event.target.value;
      state.visible = PAGE_SIZE;
      renderLibrary();
    });

    dom.clearFilters.addEventListener('click', () => clearFilters());
    dom.loadMore.addEventListener('click', () => {
      state.visible += PAGE_SIZE;
      renderLibrary();
    });

    dom.herbGrid.addEventListener('click', event => {
      const favorite = event.target.closest('[data-favorite]');
      if (favorite) {
        event.stopPropagation();
        toggleFavorite(favorite.dataset.favorite);
        return;
      }
      const card = event.target.closest('[data-herb-id]');
      if (card) openDetail(allHerbs.find(herb => herb.id === card.dataset.herbId));
    });

    dom.herbGrid.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-herb-id]')) {
        event.preventDefault();
        openDetail(allHerbs.find(herb => herb.id === event.target.dataset.herbId));
      }
    });

    document.addEventListener('click', event => {
      const view = event.target.closest('[data-view]');
      if (view) setView(view.dataset.view);

      const close = event.target.closest('[data-close-dialog]');
      if (close) closeDialog(document.querySelector(`#${close.dataset.closeDialog}`));

      const reset = event.target.closest('[data-action="reset"]');
      if (reset) clearFilters({ keepView: false });

      const remove = event.target.closest('[data-remove-filter]');
      if (remove) {
        const key = remove.dataset.removeFilter;
        if (key === 'category') updateCategory('全部');
        if (key === 'verified') {
          state.verifiedOnly = false;
          dom.verifiedOnly.checked = false;
          renderLibrary();
        }
        if (key.startsWith('nature:')) {
          const nature = key.slice(7);
          state.natures.delete(nature);
          const input = [...document.querySelectorAll('.nature-chip input')].find(item => item.value === nature);
          if (input) input.checked = false;
          renderLibrary();
        }
      }
    });

    dom.detailPanel.addEventListener('click', event => {
      const favorite = event.target.closest('[data-favorite]');
      if (favorite) toggleFavorite(favorite.dataset.favorite);
      const related = event.target.closest('[data-related]');
      if (related) renderDetail(allHerbs.find(herb => herb.id === related.dataset.related));
      const copy = event.target.closest('[data-copy-herb]');
      if (copy) copyHerb(allHerbs.find(herb => herb.id === copy.dataset.copyHerb));
    });

    dom.quizContent.addEventListener('click', event => {
      const option = event.target.closest('[data-quiz-option]');
      if (option) answerQuiz(option.dataset.quizOption);
      if (event.target.closest('[data-next-quiz]')) {
        state.quiz.total += 1;
        nextQuiz();
      }
    });

    [dom.detailDialog, dom.quizDialog].forEach(dialog => {
      dialog.addEventListener('click', event => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });

    document.querySelector('#randomButton').addEventListener('click', () => {
      const pool = filteredHerbs();
      const herb = pool[Math.floor(Math.random() * pool.length)] || allHerbs[Math.floor(Math.random() * allHerbs.length)];
      openDetail(herb);
    });
    document.querySelector('#dailyOpen').addEventListener('click', () => openDetail(state.daily));
    document.querySelector('#quizButton').addEventListener('click', openQuiz);
    dom.mobileViewButton.addEventListener('click', () => setView(state.view === 'favorites' ? 'all' : 'favorites'));
    document.querySelector('#mobileFilterButton').addEventListener('click', openFilters);
    document.querySelector('#mobileFilterClose').addEventListener('click', closeFilters);
    dom.filterBackdrop.addEventListener('click', closeFilters);
  }

  function init() {
    if (!allHerbs.length) {
      dom.emptyState.hidden = false;
      dom.loadMoreWrap.hidden = true;
      return;
    }
    state.daily = deterministicDaily();
    renderFilterControls();
    renderDaily();
    saveFavorites();
    renderLibrary();
    bindEvents();
    refreshIcons();

    const requested = new URLSearchParams(window.location.search).get('herb');
    if (requested) openDetail(allHerbs.find(herb => herb.name === requested));
  }

  init();
})();
