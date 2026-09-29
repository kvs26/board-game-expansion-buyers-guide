import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalize, searchEntry, matchGame } from '../src/lib/game-search.mjs';

const catalog = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url)));
const entries = catalog.games.map((g) => searchEntry(g, catalog.expansions.filter((e) => e.game === g.slug)));
const find = (q) => entries.map((e) => [e.slug, matchGame(e, q)]).filter(([, m]) => m);

test('normalize folds case, accents, & and punctuation', () => {
  assert.equal(normalize('Cities & Knights'), 'cities and knights');
  assert.equal(normalize('  Pokémon: Tag-Team! '), 'pokemon tag team');
  assert.equal(normalize(null), '');
});

test('an expansion name finds its game and says which expansion matched', () => {
  const hits = find('seafarers');
  assert.deepEqual(hits.map(([s]) => s), ['catan']);
  assert.equal(hits[0][1].via, 'Seafarers');
});

test('game name and publisher are direct hits', () => {
  assert.deepEqual(find('WINGSPAN'), [['wingspan', { via: null }]]);
  assert.deepEqual(find('stonemaier').map(([s]) => s).sort(), ['scythe', 'viticulture-essential-edition', 'wingspan']);
});

test('multi-word queries can mix game and expansion words', () => {
  assert.deepEqual(find('catan cities knights').map(([s]) => s), ['catan']);
  assert.deepEqual(find('cities').map(([s]) => s).sort(), ['7-wonders', 'catan']);
});

test('empty query matches everything; nonsense matches nothing', () => {
  assert.equal(find('   ').length, entries.length);
  assert.equal(find('zzqx').length, 0);
});
