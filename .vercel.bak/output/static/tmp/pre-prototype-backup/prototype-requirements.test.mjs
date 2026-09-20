import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const requiredAssets = [
  'public/images/everyhalf/people/11_human_moment.png',
  'public/images/everyhalf/space/12_space.png',
  'public/images/everyhalf/transition/13_transition_macro.png',
  'public/images/everyhalf/organic/14_organic_01.png',
  'public/images/everyhalf/organic/14_organic_02.png',
  'public/images/everyhalf/organic/14_organic_03.png',
  'public/images/everyhalf/organic/14_organic_04.png',
  'public/images/everyhalf/texture/15_material_texture.png',
  'public/images/everyhalf/closing/16_closing.png',
];

test('the complete Every Half asset pack is present', () => {
  for (const path of requiredAssets) {
    assert.equal(existsSync(path), true, `missing asset: ${path}`);
  }
});

test('the landing page is clearly academic and has a valid UTM CTA', () => {
  const home = readFileSync('index.html', 'utf8');
  assert.match(home, /Bài tập học thuật – không phải trang chính thức của thương hiệu/);
  assert.match(home, /id="visit-roastery"/);
  assert.match(home, /utm_source=academic_prototype&amp;utm_medium=landing_page&amp;utm_campaign=every_half_case_study/);
});

test('the tracking module exposes private event logging primitives', () => {
  const tracking = readFileSync('assets/js/tracking.js', 'utf8');
  for (const token of ['page_view', 'cta_click', 'timestamp', 'localStorage', 'URLSearchParams', 'EveryHalfTracking']) {
    assert.match(tracking, new RegExp(token));
  }
});
