// Layout breakpoints: phone ≤767px, tablet 768–1023px, laptop ≥1024px (see tokens.css).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const ALLOWED = new Set(['max-width: 767px', 'min-width: 768px', 'max-width: 1023px', 'min-width: 1024px']);
const src = new URL('../src/', import.meta.url);
const files = readdirSync(src, { recursive: true }).filter((f) => /\.(css|astro|mjs|ts)$/.test(f));

test('media queries (CSS and matchMedia) only use the phone/tablet/laptop breakpoints', () => {
  const used = [];
  for (const f of files) {
    const text = readFileSync(new URL(f, src), 'utf8');
    for (const m of text.matchAll(/\((m(?:in|ax)-width:\s*[\d.]+(?:px|rem|em))\)/g)) used.push(`${f}: ${m[1].replace(/:\s*/, ': ')}`);
    for (const m of text.matchAll(/\(\s*width\s*[<>]=?[^)]*\)/g)) used.push(`${f}: range syntax ${m[0]}`);
  }
  assert.ok(used.length > 0);
  assert.deepEqual(used.filter((q) => !ALLOWED.has(q.split(': ').slice(1).join(': '))), []);
});
