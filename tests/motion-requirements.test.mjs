import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('landing uses a Vietnamese-safe font stack and a reduced-motion-safe animation layer', () => {
  const css = readFileSync('assets/css/every-half-prototype.css', 'utf8');
  const home = readFileSync('index.html', 'utf8');
  const motion = readFileSync('assets/js/motion.js', 'utf8');
  assert.match(css, /Segoe UI/);
  assert.match(css, /@keyframes/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\[data-reveal\]/);
  assert.match(home, /assets\/js\/motion\.js/);
  assert.match(home, /organic-float/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /matchMedia/);
});
