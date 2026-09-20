(() => {
  'use strict';

  const STORAGE_KEY = 'every-half-academic-events';
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function parseUtm(search = window.location.search) {
    const params = new URLSearchParams(search);
    return Object.fromEntries(utmKeys.map((key) => [key, params.get(key)]));
  }

  function readEvents() { try { const raw = window.localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
  function writeEvents(events) { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); return true; } catch { return false; } }

  function recordEvent(name, destinationUrl = null) {
    const event = { name, timestamp: new Date().toISOString(), url: window.location.href, destinationUrl, referrer: document.referrer || null, utm: parseUtm(destinationUrl ? new URL(destinationUrl, window.location.href).search : window.location.search) };
    const stored = writeEvents([...readEvents(), event]);
    renderEventLog(stored ? 'Đã ghi nhận trong analytics sandbox cục bộ.' : 'Không thể ghi localStorage; CTA vẫn hoạt động bình thường.');
    return event;
  }

  function getEvents() { return readEvents(); }
  function clear() { try { window.localStorage.removeItem(STORAGE_KEY); renderEventLog('Đã xoá event log cục bộ.'); return true; } catch { renderEventLog('Không thể xoá localStorage trong trình duyệt này.'); return false; } }

  function renderEventLog(status = 'Chỉ lưu trong trình duyệt này; không gửi dữ liệu ra ngoài.') {
    const statusNode = document.querySelector('#event-status'), list = document.querySelector('#event-log');
    if (statusNode) statusNode.textContent = status;
    if (!list) return;
    const events = getEvents(); list.replaceChildren();
    if (!events.length) { const item = document.createElement('li'); item.textContent = 'Chưa có sự kiện nào.'; list.append(item); return; }
    events.slice(-6).reverse().forEach((event) => { const item = document.createElement('li'); item.textContent = `${event.name} · ${event.timestamp} · ${event.utm.utm_campaign || 'không có UTM'}`; list.append(item); });
  }

  function renderCampaignDetails() {
    const node = document.querySelector('#campaign-details');
    if (!node) return;
    node.replaceChildren();
    Object.entries(parseUtm()).forEach(([key, value]) => { const row = document.createElement('div'), label = document.createElement('dt'), detail = document.createElement('dd'); label.textContent = key; detail.textContent = value || 'không có'; row.append(label, detail); node.append(row); });
  }

  function initialise() {
    document.querySelectorAll('[data-track]').forEach((element) => element.addEventListener('click', () => recordEvent(element.dataset.track, element.href)));
    document.querySelector('[data-clear-events]')?.addEventListener('click', clear);
    renderEventLog(); renderCampaignDetails(); recordEvent('page_view');
  }

  window.EveryHalfTracking = { parseUtm, recordEvent, getEvents, clear, renderEventLog };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true }); else initialise();
})();
