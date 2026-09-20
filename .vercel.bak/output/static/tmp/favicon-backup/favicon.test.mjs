import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('all navigable prototype pages prevent an unnecessary favicon 404', () => {
  for (const path of ['index.html', 'tracking/index.html', 'thank-you.html']) {
    assert.match(readFileSync(path, 'utf8'), /rel="icon" href="data:,"/);
  }
});
