// Checks the built pages in dist/ against the catalog. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { statusFor, rankNext, priceBand, isRanked } from '../src/lib/guide.mjs';

const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url)));
const dist = new URL('../dist/', import.meta.url);
const built = existsSync(dist);
const page = (p) => readFileSync(new URL(p, dist), 'utf8');
const hasUrl = (html, u) => html.includes(u) || html.includes(u.replaceAll('&', '&amp;'));

test('statusFor picks the first unblocked, on-style row', () => {
  const r = { next: [{ name: 'B', blockedBy: [{}], fitsStyle: true }, { name: 'C', blockedBy: [], fitsStyle: true }], hidden: [] };
  assert.deepEqual(statusFor(r, { owned: ['a'] }), { lead: 'Your next buy: ', pick: r.next[1] });
  assert.equal(statusFor({ next: [], hidden: [] }).text, 'You own everything we rank.');
  assert.equal(statusFor({ next: [], hidden: [{}] }).text, 'Nothing ranked fits that player count.');
});

test('priceBand buckets prices', () => {
  assert.equal(priceBand({ priceUsd: 15 }), 'Under $20');
  assert.equal(priceBand({ priceUsd: 45 }), '$40–$60');
  assert.equal(priceBand({ priceUsd: null }), null);
});

test('homepage links every game and ships search data for each', { skip: !built && 'run npm run build first' }, () => {
  const html = page('index.html');
  assert.equal(html.match(/<li data-game-item/g)?.length, catalog.games.length);
  const data = JSON.parse(html.match(/id="game-search-data"[^>]*>([^<]*)<\/script>/)[1]);
  assert.equal(data.length, catalog.games.length);
  for (const g of catalog.games) assert.ok(html.includes(`href="/${g.slug}/expansions/"`), g.slug);
});

test('no prerequisite rule is a one-word stub', () => {
  for (const e of catalog.expansions) {
    if (e.prerequisiteRule) assert.ok(e.prerequisiteRule.split(/\s+/).length >= 3, `${e.id}: ${e.prerequisiteRule}`);
  }
});

for (const g of catalog.games) {
  test(`built pages for ${g.slug}`, { skip: !built && 'run npm run build first' }, () => {
    const exps = catalog.expansions.filter((e) => e.game === g.slug);
    const html = page(`${g.slug}/expansions/index.html`);
    const { next } = rankNext(exps);
    for (const e of next) {
      assert.ok(html.includes(`data-slug="${e.slug}"`), `${e.slug} missing from tool page`);
      assert.ok(e.buyLinks.length > 0, `${e.slug} is ranked but has no buy link`);
      for (const l of e.buyLinks.slice(0, 3)) assert.ok(hasUrl(html, l.url), `${e.slug} buy link missing: ${l.url}`);
      if (e.listNote) assert.ok(html.includes(e.listNote.slice(0, 20)), `${e.slug} note missing`);
    }
    for (const e of exps.filter((x) => !isRanked(x))) {
      assert.ok(!html.includes(`data-slug="${e.slug}"`), `${e.slug} unranked but on the track`);
    }
    for (const e of exps) {
      const detail = page(`${g.slug}/${e.slug}/index.html`);
      for (const l of e.buyLinks) assert.ok(hasUrl(detail, l.url), `${e.slug} detail buy link: ${l.url}`);
    }
  });
}
