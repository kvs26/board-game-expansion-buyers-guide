import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)));
const catalog = read('../src/data/catalog.json');
const summaries = read('../src/data/listing-summaries.json');
const MAX = 200;

test('listing Adds/Fixes text is short (add a hand-written entry to src/data/listing-summaries.json if not)', () => {
  const tooLong = [];
  for (const e of catalog.expansions) {
    for (const k of ['adds', 'fixes']) {
      const text = summaries[`${e.game}/${e.slug}`]?.[k] || e[k] || '';
      if (text.length > MAX) tooLong.push(`${e.game}/${e.slug} ${k} (${text.length})`);
    }
  }
  assert.deepEqual(tooLong, []);
});

test('listing summaries point at real expansions and are short', () => {
  const slugs = new Set(catalog.expansions.map((e) => `${e.game}/${e.slug}`));
  for (const [key, v] of Object.entries(summaries)) {
    assert.ok(slugs.has(key), `unknown expansion key: ${key}`);
    for (const k of ['adds', 'fixes']) if (v[k]) assert.ok(v[k].length <= MAX, `${key} ${k} too long`);
  }
});
