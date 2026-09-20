import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

test('cta_click records the source page and UTM values from its destination URL', () => {
  const store = new Map();
  const sourceUrl = 'http://127.0.0.1:4173/index.html';
  const destinationUrl = 'http://127.0.0.1:4173/thank-you.html?utm_source=academic_prototype&utm_medium=landing_page&utm_campaign=every_half_case_study';
  const document = { readyState: 'loading', referrer: '', querySelectorAll: () => [], querySelector: () => null, addEventListener: (_name, listener) => listener() };
  const window = { location: { href: sourceUrl, search: '' }, localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: (key) => store.delete(key) } };
  vm.runInNewContext(readFileSync('assets/js/tracking.js', 'utf8'), { window, document, URL, URLSearchParams, Object, JSON, Date });

  const event = window.EveryHalfTracking.recordEvent('cta_click', destinationUrl);

  assert.equal(event.url, sourceUrl);
  assert.equal(event.destinationUrl, destinationUrl);
  assert.deepEqual(event.utm, { utm_source: 'academic_prototype', utm_medium: 'landing_page', utm_campaign: 'every_half_case_study', utm_content: null, utm_term: null });
});
