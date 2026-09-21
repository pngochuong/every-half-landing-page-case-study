import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('tracking is a separate page and not displayed on the landing page', () => {
  const home = readFileSync('index.html', 'utf8');
  const tracking = readFileSync('tracking.html', 'utf8');
  const css = readFileSync('assets/css/tracking-route.css', 'utf8');
  for (const text of ['Khu vực kiểm tra nội bộ', 'Nhật ký sự kiện', 'Chuỗi chuyển hướng và bảo toàn UTM', 'Giả lập sự kiện CTA', 'Tổng sự kiện', 'CTA Clicks']) assert.ok(!home.includes(text), text);
  assert.doesNotMatch(home, /id="event-log"/);
  assert.match(tracking, /Kết quả ghi nhận sự kiện/);
  assert.match(tracking, /href="\/">Quay lại landing page</);
  assert.match(tracking, /id="event-log"/);
  assert.match(tracking, /data-clear-events/);
  assert.match(tracking, /Bài tập học thuật – không phải trang chính thức của thương hiệu/);
  assert.match(css, /\.tracking-route/);
  assert.match(css, /\.event-panel/);
});
