(() => {
  'use strict';

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = 'data:,';
  document.head.append(favicon);

  const STORAGE_KEY = 'every-half-academic-events';
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  let currentFilter = 'all';

  function parseUtm(search = window.location.search) {
    const params = new URLSearchParams(search);
    return Object.fromEntries(utmKeys.map((key) => [key, params.get(key)]));
  }

  function readEvents() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function writeEvents(events) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch {
      return false;
    }
  }

  function formatRelativeTime(isoString) {
    const now = new Date();
    const past = new Date(isoString);
    const diffSecs = Math.floor((now - past) / 1000);
    if (diffSecs < 5) return 'Vừa xong';
    if (diffSecs < 60) return `${diffSecs} giây trước`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return past.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function recordEvent(name, destinationUrl = null, extraUtm = {}) {
    let utmObj = extraUtm && Object.keys(extraUtm).length ? extraUtm : parseUtm(destinationUrl ? new URL(destinationUrl, window.location.href).search : window.location.search);
    const event = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      name,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      destinationUrl,
      referrer: document.referrer || null,
      utm: utmObj
    };
    const stored = writeEvents([...readEvents(), event]);
    renderDashboard(stored ? 'Đã ghi nhận sự kiện vào sandbox cục bộ.' : 'Không thể ghi vào localStorage.');
    showToast(stored ? `Đã ghi sự kiện: ${name}` : 'Lỗi ghi nhớ dữ liệu');
    return event;
  }

  function getEvents() {
    return readEvents();
  }

  function clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      renderDashboard('Đã xoá toàn bộ log cục bộ.');
      showToast('Đã xoá sạch lịch sử sự kiện!');
      return true;
    } catch {
      renderDashboard('Không thể xoá localStorage trong trình duyệt.');
      return false;
    }
  }

  function showToast(message) {
    const toast = document.querySelector('#tracking-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function renderMetrics(events) {
    const totalNode = document.querySelector('#metric-total');
    const ctaNode = document.querySelector('#metric-cta');
    const pageNode = document.querySelector('#metric-views');
    const campaignNode = document.querySelector('#metric-campaigns');

    if (totalNode) totalNode.textContent = events.length;
    if (ctaNode) ctaNode.textContent = events.filter(e => e.name === 'cta_click' || e.name === 'simulated_cta_click').length;
    if (pageNode) pageNode.textContent = events.filter(e => e.name === 'page_view').length;

    if (campaignNode) {
      const activeCampaigns = new Set(
        events.map(e => e.utm && e.utm.utm_campaign).filter(Boolean)
      );
      campaignNode.textContent = activeCampaigns.size;
    }
  }

  function renderEventLog(events) {
    const list = document.querySelector('#event-log');
    if (!list) return;

    list.replaceChildren();

    const filtered = events.filter(event => {
      if (currentFilter === 'cta_click') return event.name === 'cta_click' || event.name === 'simulated_cta_click';
      if (currentFilter === 'page_view') return event.name === 'page_view';
      return true;
    });

    if (!filtered.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'event-log-empty';
      emptyState.innerHTML = `
        <p>Chưa có sự kiện nào trong bộ lọc này.</p>
        <span class="empty-sub">Hãy nhấp nút CTA bên dưới để thử nghiệm gửi sự kiện.</span>
      `;
      list.append(emptyState);
      return;
    }

    filtered.slice().reverse().forEach((event) => {
      const card = document.createElement('li');
      card.className = `event-card event-type-${event.name}`;

      const header = document.createElement('div');
      header.className = 'event-card-header';

      const badge = document.createElement('span');
      let badgeClass = 'badge-default';
      let badgeLabel = event.name;

      if (event.name === 'cta_click') {
        badgeClass = 'badge-cta';
        badgeLabel = 'CTA CLICK';
      } else if (event.name === 'simulated_cta_click') {
        badgeClass = 'badge-simulated';
        badgeLabel = 'SIMULATED CTA';
      } else if (event.name === 'page_view') {
        badgeClass = 'badge-pageview';
        badgeLabel = 'PAGE VIEW';
      }

      badge.className = `event-badge ${badgeClass}`;
      badge.textContent = badgeLabel;

      const time = document.createElement('span');
      time.className = 'event-time';
      time.title = event.timestamp;
      time.textContent = formatRelativeTime(event.timestamp);

      header.append(badge, time);
      card.append(header);

      // Path & Navigation summary
      const details = document.createElement('div');
      details.className = 'event-card-details';

      const pathRow = document.createElement('div');
      pathRow.className = 'event-url-row';

      const currentPathName = new URL(event.url, window.location.href).pathname;
      let pathHtml = `<span class="url-label">Route:</span> <code class="url-code">${currentPathName}</code>`;

      if (event.destinationUrl) {
        const destPathName = new URL(event.destinationUrl, window.location.href).pathname;
        pathHtml += ` <span class="url-arrow">chuyển đến</span> <code class="url-code dest">${destPathName}</code>`;
      }
      pathRow.innerHTML = pathHtml;
      details.append(pathRow);

      // UTM Badges
      const utmEntries = Object.entries(event.utm || {}).filter(([_, val]) => Boolean(val));
      if (utmEntries.length > 0) {
        const utmContainer = document.createElement('div');
        utmContainer.className = 'event-utm-container';
        utmContainer.innerHTML = '<span class="utm-title">UTM Parameters:</span>';

        const utmPills = document.createElement('div');
        utmPills.className = 'utm-pills';

        utmEntries.forEach(([key, value]) => {
          const pill = document.createElement('span');
          pill.className = 'utm-pill';
          const shortKey = key.replace('utm_', '');
          pill.innerHTML = `<strong class="utm-key">${shortKey}:</strong> <span class="utm-val">${value}</span>`;
          utmPills.append(pill);
        });

        utmContainer.append(utmPills);
        details.append(utmContainer);
      } else {
        const noUtm = document.createElement('div');
        noUtm.className = 'event-no-utm';
        noUtm.textContent = 'Trắng thông số UTM (Organic Access)';
        details.append(noUtm);
      }

      card.append(details);
      list.append(card);
    });
  }

  function renderCampaignDetails() {
    const node = document.querySelector('#campaign-details');
    if (!node) return;
    node.replaceChildren();
    Object.entries(parseUtm()).forEach(([key, value]) => {
      const row = document.createElement('div'), label = document.createElement('dt'), detail = document.createElement('dd');
      label.textContent = key;
      detail.textContent = value || 'không có';
      row.append(label, detail);
      node.append(row);
    });
  }

  function renderChainInspector() {
    const container = document.querySelector('#chain-inspector-content');
    if (!container) return;

    const events = getEvents();
    const ctaEvents = events.filter(e => e.name === 'cta_click' || e.name === 'simulated_cta_click');
    const latestCta = ctaEvents.length ? ctaEvents[ctaEvents.length - 1] : null;

    if (!latestCta) {
      container.innerHTML = `
        <div class="chain-empty">
          <p>Chưa có thao tác nhấp CTA nào được ghi nhận.</p>
          <span class="chain-sub">Hãy bấm nút &quot;Tìm cửa hàng gần bạn&quot; ở đầu trang hoặc dùng nút giả lập bên dưới.</span>
        </div>
      `;
      return;
    }

    const utmObj = latestCta.utm || {};
    const hasUtm = Object.values(utmObj).some(Boolean);
    const srcUrl = new URL(latestCta.url, window.location.href);
    const destUrl = latestCta.destinationUrl ? new URL(latestCta.destinationUrl, window.location.href) : null;
    const srcPath = srcUrl.pathname;
    const destPath = destUrl ? destUrl.href : 'N/A';
    const expectedUtm = ['utm_source', 'utm_medium', 'utm_campaign'];
    const missingUtm = destUrl ? expectedUtm.filter((key) => !destUrl.searchParams.get(key)) : expectedUtm;

    container.innerHTML = `
      <div class="chain-grid">
        <div class="chain-row">
          <span class="chain-label">Sự kiện ghi nhận:</span>
          <span class="chain-val badge-cta">${latestCta.name}</span>
        </div>
        <div class="chain-row">
          <span class="chain-label">Thời gian (Timestamp):</span>
          <span class="chain-val mono">${latestCta.timestamp}</span>
        </div>
        <div class="chain-row">
          <span class="chain-label">Chuỗi Chuyển Hướng:</span>
          <span class="chain-val mono"><code class="url-code">${srcPath}</code> chuyển đến <code class="url-code dest">${destPath}</code></span>
        </div>
        <div class="chain-row">
          <span class="chain-label">Trạng thái UTM:</span>
          <span class="chain-val ${hasUtm ? 'utm-status-pass' : 'utm-status-warn'}">
            ${hasUtm ? 'Đã bảo toàn đầy đủ tham số UTM' : 'Trắng tham số UTM'}
          </span>
        </div>
        <div class="chain-row">
          <span class="chain-label">Tham số còn / mất sau redirect:</span>
          <span class="chain-val mono">${missingUtm.length ? 'Thiếu: ' + missingUtm.join(', ') : 'Còn đủ source, medium, campaign'}</span>
        </div>
        ${hasUtm ? `
        <div class="chain-utm-box">
          <div class="utm-pills">
            ${Object.entries(utmObj).filter(([_, v]) => Boolean(v)).map(([k, v]) => `
              <span class="utm-pill"><strong class="utm-key">${k.replace('utm_', '')}:</strong> ${v}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  function renderDashboard(statusMessage = 'Chỉ lưu trong trình duyệt này; không gửi dữ liệu ra ngoài.') {
    const statusNode = document.querySelector('#event-status');
    if (statusNode) statusNode.textContent = statusMessage;
    const events = getEvents();
    renderMetrics(events);
    renderEventLog(events);
    renderChainInspector();
    renderCampaignDetails();
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.dataset.filter;
        renderDashboard(`Đã lọc hiển thị: ${btn.textContent.trim()}`);
      });
    });
  }

  function setupSimulator() {
    const simButton = document.querySelector('#btn-simulate-cta');
    if (!simButton) return;

    simButton.addEventListener('click', () => {
      const sourceInput = document.querySelector('#sim-source')?.value || 'academic_prototype';
      const mediumInput = document.querySelector('#sim-medium')?.value || 'tracking_sandbox';
      const campaignInput = document.querySelector('#sim-campaign')?.value || 'every_half_demo';

      const customUtm = {
        utm_source: sourceInput,
        utm_medium: mediumInput,
        utm_campaign: campaignInput
      };

      const destUrl = `thank-you.html?utm_source=${encodeURIComponent(sourceInput)}&utm_medium=${encodeURIComponent(mediumInput)}&utm_campaign=${encodeURIComponent(campaignInput)}`;
      recordEvent('simulated_cta_click', destUrl, customUtm);
    });
  }

  function initialise() {
    document.querySelectorAll('[data-track]').forEach((element) => {
      element.addEventListener('click', () => recordEvent(element.dataset.track, element.href));
    });
    document.querySelector('[data-clear-events]')?.addEventListener('click', clear);
    setupFilters();
    setupSimulator();
    renderDashboard();
    recordEvent('page_view');
  }

  window.EveryHalfTracking = { parseUtm, recordEvent, getEvents, clear, renderDashboard };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();

