import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the shared tracker installs an inline favicon and prevents favicon 404 requests', () => {
  const tracking = readFileSync('assets/js/tracking.js', 'utf8');
  assert.match(tracking, /favicon\.rel = 'icon'/);
  assert.match(tracking, /favicon\.href = 'data:,'/);
});
