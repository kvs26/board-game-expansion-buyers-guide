import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankNext, prereqChain, parseState, serializeState, comparePairs } from '../src/lib/guide.mjs';

// Small fixture shaped like catalog.json rows (one game).
const X = (slug, o = {}) => ({
  id: `g--${slug}`, slug, game: 'g', name: slug.toUpperCase(), verdict: 'worth_it',
  buyOrder: 1, requires: [], minPlayers: null, maxPlayers: null, groupStyle: null, ...o,
});
const exps = [
  X('sea', { verdict: 'buy_first', buyOrder: 1, minPlayers: 3, maxPlayers: 4 }),
  X('sea56', { buyOrder: 3, requires: ['g--sea'], minPlayers: 5, maxPlayers: 6 }),
  X('cities', { buyOrder: 2, groupStyle: 'experienced' }),
  X('twin', { buyOrder: 2, groupStyle: 'casual' }),
  X('legend', { verdict: 'depends', buyOrder: 4, requires: ['g--sea56'] }),
  X('promo', { verdict: null, buyOrder: null }),
];
const slugs = (list) => list.map((e) => e.slug);

test('ranks rated expansions by editorial buy order, ties share a number', () => {
  const r = rankNext(exps);
  assert.deepEqual(slugs(r.next), ['sea', 'cities', 'twin', 'sea56', 'legend']);
  assert.deepEqual(r.next.map((e) => e.rank), [1, 2, 2, 3, 4]);
  assert.deepEqual(slugs(r.unrated), ['promo']);
});

test('owned expansions leave the buy-next list and the rest renumber', () => {
  const r = rankNext(exps, { owned: ['sea', 'cities'] });
  assert.deepEqual(slugs(r.next), ['twin', 'sea56', 'legend']);
  assert.deepEqual(r.next.map((e) => e.rank), [1, 2, 3]);
  assert.deepEqual(slugs(r.owned), ['sea', 'cities']);
});

test('flags what you need first until it is owned', () => {
  let r = rankNext(exps);
  const legend = r.next.find((e) => e.slug === 'legend');
  assert.deepEqual(legend.blockedBy.map((e) => e.slug), ['sea56', 'sea']);
  assert.equal(r.next.find((e) => e.slug === 'sea').blockedBy.length, 0);
  r = rankNext(exps, { owned: ['sea'] });
  assert.equal(r.next.find((e) => e.slug === 'sea56').blockedBy.length, 0);
});

test('player count hides rows known not to fit; unknown counts stay', () => {
  const r = rankNext(exps, { players: 6 });
  assert.deepEqual(slugs(r.next), ['cities', 'twin', 'sea56', 'legend']);
  assert.deepEqual(slugs(r.hidden), ['sea']);
});

test('style highlights matching rows without reordering', () => {
  const r = rankNext(exps, { style: 'casual' });
  assert.equal(r.next.find((e) => e.slug === 'twin').fitsStyle, true);
  assert.equal(r.next.find((e) => e.slug === 'cities').fitsStyle, false);
  assert.equal(r.next.find((e) => e.slug === 'sea').fitsStyle, true); // unknown = fits
  assert.deepEqual(slugs(r.next), slugs(rankNext(exps).next));
});

test('prereqChain walks requirements transitively', () => {
  assert.deepEqual(slugs(prereqChain(exps[4], exps)), ['sea56', 'sea']);
  assert.deepEqual(prereqChain(exps[0], exps), []);
});

test('state round-trips through the URL and drops unknown slugs', () => {
  const qs = serializeState({ owned: ['sea', 'twin'], players: 4, style: 'casual' });
  assert.equal(qs, 'own=sea,twin&p=4&style=casual');
  const s = parseState('?' + qs + '&own2=x', ['sea', 'twin']);
  assert.deepEqual(s, { owned: ['sea', 'twin'], players: 4, style: 'casual' });
  assert.deepEqual(parseState('?own=sea,nope&p=abc&style=weird', ['sea']), { owned: ['sea'], players: null, style: null });
  assert.equal(serializeState({ owned: [], players: null, style: null }), '');
});

test('comparePairs pairs top rated expansions that do not require each other', () => {
  const pairs = comparePairs(exps, 3);
  assert.deepEqual(pairs.map(([a, b]) => `${a.slug}-vs-${b.slug}`), ['sea-vs-cities', 'sea-vs-twin', 'cities-vs-twin']);
  const all = comparePairs(exps, 10).map(([a, b]) => `${a.slug}-${b.slug}`);
  assert.ok(!all.includes('sea-sea56'));
});
