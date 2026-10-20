import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { hubTitle, hubDescription, hubModifiedLd } from '../src/lib/hub-seo.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)));
const editorial = read('../src/data/editorial.json');
const catalog = read('../src/data/catalog.json');
const dist = new URL('../dist/', import.meta.url);
const built = existsSync(dist);

test('hubTitle matches how people search', () => {
  assert.equal(hubTitle('Catan'), 'Catan Expansions Ranked: Which to Buy First (2026)');
});

test('hubDescription uses "best" and names the top pick', () => {
  const d = hubDescription('Catan', 'Seafarers');
  assert.match(d, /^Best Catan expansions/);
  assert.ok(d.includes('Start with Seafarers'));
  assert.match(hubDescription('Catan', null), /Catan/);
});

test('hubModifiedLd emits dateModified from the checked date', () => {
  assert.deepEqual(hubModifiedLd('2026-09-27', '/catan/expansions/'), {
    '@type': 'CollectionPage',
    url: 'https://whichexpansion.com/catan/expansions/',
    dateModified: '2026-09-27',
  });
});

const sentences = (t) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim().toLowerCase()).filter(Boolean);

test('hand-written intro overrides stay short (max 45 words)', () => {
  for (const slug of Object.keys(editorial)) {
    const words = editorial[slug].split(/\s+/).filter(Boolean).length;
    assert.ok(words <= 45, `${slug}: ${words} words`);
  }
});

test('no two editorial blocks share a sentence', () => {
  const seen = new Map();
  for (const slug of Object.keys(editorial)) {
    for (const s of sentences(editorial[slug])) {
      assert.ok(!seen.has(s), `"${s}" in ${slug} and ${seen.get(s)}`);
      seen.set(s, slug);
    }
  }
});

test('hub pages ship new title, table, editorial and dateModified', { skip: !built && 'run npm run build first' }, () => {
  for (const g of catalog.games) {
    const html = readFileSync(new URL(`${g.slug}/expansions/index.html`, dist), 'utf8');
    assert.ok(html.includes(`${g.name} Expansions Ranked: Which to Buy First (2026)`.replace(/&/g, '&amp;')), `${g.slug} title`);
    assert.match(html, /<table[^>]*data-ranked-table/, `${g.slug} table`);
    assert.ok(html.includes('"dateModified":"' + g.checkedOn + '"'), `${g.slug} dateModified`);
    if (editorial[g.slug]) assert.ok(html.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').includes(editorial[g.slug].slice(0, 30)), `${g.slug} editorial`);
  }
});

import { hubIntro } from '../src/lib/hub-seo.mjs';
test('every game gets a 2-3 sentence, short buy-first intro', () => {
  for (const g of catalog.games) {
    const exps = catalog.expansions.filter((e) => e.game === g.slug);
    if (!exps.some((e) => e.verdict && e.buyOrder != null)) continue;
    const intro = hubIntro(g, exps);
    assert.ok(intro.length >= 2 && intro.length <= 3, `${g.slug}: ${intro.length} sentences`);
    assert.ok(intro.join(' ').split(/\s+/).length <= 90, `${g.slug}: too long`);
  }
});

test('built hubs show the intro for every game with ranked expansions', { skip: !built && 'run npm run build first' }, () => {
  for (const g of catalog.games) {
    const exps = catalog.expansions.filter((e) => e.game === g.slug);
    if (!exps.some((e) => e.verdict && e.buyOrder != null)) continue;
    const html = readFileSync(new URL(`${g.slug}/expansions/index.html`, dist), 'utf8');
    assert.match(html, /data-hub-intro/, `${g.slug} intro`);
  }
});
