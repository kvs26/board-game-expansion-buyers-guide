import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { relatedGames, publisherGroups, publisherSlug, hubFaqs } from '../src/lib/related.mjs';
import { comparePairs } from '../src/lib/guide.mjs';
import { faqPageLd } from '../src/lib/seo.mjs';

const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url)));
const games = catalog.games;
const expsOf = (slug) => catalog.expansions.filter((e) => e.game === slug);

test('relatedGames: 4-6 others, never itself, same publisher first, deterministic', () => {
  for (const g of games) {
    const r = relatedGames(g, games);
    assert.ok(r.length >= 4 && r.length <= 6, `${g.slug}: ${r.length}`);
    assert.ok(!r.some((x) => x.slug === g.slug));
    assert.equal(new Set(r.map((x) => x.slug)).size, r.length);
    assert.deepEqual(r.map((x) => x.slug), relatedGames(g, games).map((x) => x.slug));
    const same = games.filter((x) => x.publisher === g.publisher && x.slug !== g.slug);
    if (same.length) assert.equal(r[0].publisher, g.publisher);
  }
});

test('publisherGroups: hubs for publishers with 2+ games, all games listed', () => {
  const groups = publisherGroups(games);
  assert.ok(groups.length > 0);
  for (const grp of groups) {
    assert.ok(grp.games.length >= 2);
    assert.equal(grp.slug, publisherSlug(grp.name));
    assert.ok(grp.games.every((g) => g.publisher === grp.name));
  }
  assert.equal(publisherSlug('Indie Boards & Cards'), 'indie-boards-cards');
});

test('hubFaqs: 3-5 grounded Q&As per game with ranked expansions', () => {
  for (const g of games) {
    const exps = expsOf(g.slug);
    const faqs = hubFaqs(g, exps);
    if (!exps.some((e) => e.verdict && e.buyOrder != null)) continue;
    assert.ok(faqs.length >= 3 && faqs.length <= 5, `${g.slug}: ${faqs.length}`);
    for (const f of faqs) assert.ok(f.q.endsWith('?') && f.a.length > 20);
  }
});

test('faqPageLd shapes schema.org FAQPage', () => {
  const n = faqPageLd([{ q: 'Q?', a: 'A.' }]);
  assert.equal(n['@type'], 'FAQPage');
  assert.equal(n.mainEntity[0].acceptedAnswer.text, 'A.');
});

test('comparePairs honours a larger top', () => {
  const e = expsOf('spirit-island');
  assert.ok(comparePairs(e, 5).length >= comparePairs(e, 4).length);
});

import { existsSync } from 'node:fs';
const dist = new URL('../dist/', import.meta.url);
test('built hubs: related links, FAQ + FAQPage JSON-LD; publisher hubs in sitemap', { skip: !existsSync(dist) && 'run npm run build first' }, () => {
  for (const g of games) {
    if (!expsOf(g.slug).some((e) => e.verdict && e.buyOrder != null)) continue;
    const html = readFileSync(new URL(`${g.slug}/expansions/index.html`, dist), 'utf8');
    assert.ok(html.includes('"@type":"FAQPage"'), `${g.slug} FAQPage`);
    assert.ok(html.includes('id="faq-h"'), `${g.slug} FAQ block`);
    const rel = relatedGames(g, games);
    for (const r of rel) assert.ok(html.includes(`href="/${r.slug}/expansions/"`), `${g.slug} -> ${r.slug}`);
  }
  const sm = readFileSync(new URL('sitemap-0.xml', dist), 'utf8');
  for (const p of publisherGroups(games)) assert.ok(sm.includes(`/publishers/${p.slug}/`), p.slug);
});
