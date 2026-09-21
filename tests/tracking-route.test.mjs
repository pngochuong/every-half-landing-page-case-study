import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('tracking is a separate visual route and not displayed on the landing page', () => {
  const home = readFileSync('index.html', 'utf8');
  const tracking = readFileSync('tracking/index.html', 'utf8');
  const css = readFileSync('assets/css/tracking-route.css', 'utf8');
  assert.match(home, /id="tracking-check"/);
  assert.match(home, /Khu vực kiểm tra nội bộ/);
  assert.match(home, /id="event-log"/);
  assert.match(tracking, /id="event-log"/);
  assert.match(tracking, /data-clear-events/);
  assert.match(tracking, /Bài tập học thuật – không phải trang chính thức của thương hiệu/);
  assert.match(css, /\.tracking-route/);
  assert.match(css, /\.event-panel/);
});
