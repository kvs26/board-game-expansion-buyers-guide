/** catalog.mjs — accessors over src/data/catalog.json (built by raw-source/build_catalog.py). */
import catalog from '../data/catalog.json';
import { isRanked } from './guide.mjs';

export const games = [...catalog.games].sort((a, b) => a.name.localeCompare(b.name));
export const expansions = catalog.expansions;
export const linksVerifiedOn = catalog.linksVerifiedOn;

export const gameBySlug = (slug) => games.find((g) => g.slug === slug);
export const expansionsFor = (gameSlug) => expansions.filter((e) => e.game === gameSlug);
export const expansionById = (id) => expansions.find((e) => e.id === id);

export const TYPE_LABELS = {
  expansion: 'Expansion',
  mini_expansion: 'Mini expansion',
  player_count_extension: 'More players',
  standalone_compatible: 'Standalone (mixes in)',
  scenario_pack: 'Scenario pack',
  big_box: 'Big box',
};

const COMPLEXITY = {
  heavier: 'Adds more rules',
  same: 'About the same rules load',
  lighter: 'Makes it lighter',
};
export const complexityText = (c) => (c ? COMPLEXITY[c] || c : null);

const STYLE = { casual: 'Best for casual groups', experienced: 'Best for experienced groups', mixed: 'Fine for any group' };
export const styleText = (s) => (s ? STYLE[s] || null : null);

export const ratedCount = (gameSlug) => expansionsFor(gameSlug).filter(isRanked).length;

export const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
