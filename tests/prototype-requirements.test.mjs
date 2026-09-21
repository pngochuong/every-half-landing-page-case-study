import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const requiredAssets = [
  'public/images/everyhalf/people/11_human_moment.png', 'public/images/everyhalf/space/12_space.png', 'public/images/everyhalf/transition/13_transition_macro.png', 'public/images/everyhalf/organic/14_organic_01.png', 'public/images/everyhalf/organic/14_organic_02.png', 'public/images/everyhalf/organic/14_organic_03.png', 'public/images/everyhalf/organic/14_organic_04.png', 'public/images/everyhalf/texture/15_material_texture.png', 'public/images/everyhalf/closing/16_closing.png',
];

test('the complete Every Half asset pack is present', () => {
  for (const path of requiredAssets) assert.equal(existsSync(path), true, `missing asset: ${path}`);
});

test('the landing page is clearly academic and has a valid UTM CTA', () => {
  const home = readFileSync('index.html', 'utf8');
  assert.match(home, /Bài tập học thuật – không phải trang chính thức của thương hiệu/);
  assert.match(home, /id="visit-roastery"/);
  assert.match(home, /data-track="cta_click"/);
  assert.match(home, /https:\/\/www\.everyhalf\.vn\/\?utm_source=every_half_study&amp;utm_medium=landing_cta&amp;utm_campaign=academic_demo_2026/);
  assert.match(home, />Tìm cửa hàng gần bạn</);
  assert.match(home, /href="#tracking-check">Xem kết quả ghi nhận sự kiện</);
  assert.doesNotMatch(home, /[←-⇿☀-➿\u{1F000}-\u{1FFFF}]/u);
});

test('the tracking module exposes private event logging primitives', () => {
  const tracking = readFileSync('assets/js/tracking.js', 'utf8');
  for (const token of ['page_view', 'timestamp', 'localStorage', 'URLSearchParams', 'EveryHalfTracking']) assert.match(tracking, new RegExp(token));
});
