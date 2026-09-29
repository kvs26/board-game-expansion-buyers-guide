/**
 * guide.mjs — the "what should I buy next" logic. Pure functions, no DOM,
 * shared by the static pages (build time) and the tool island (browser).
 * Order always comes from the editorial buyOrder in the data — never from
 * ratings or price.
 */

export const VERDICTS = {
  buy_first: { label: 'Buy this first', short: 'Buy first', tone: 'gold' },
  worth_it: { label: 'Worth it', short: 'Worth it', tone: 'green' },
  depends: { label: 'Depends on your group', short: 'Depends', tone: 'blue' },
  skip_unless: { label: 'Most groups can skip', short: 'Skip unless', tone: 'red' },
};

export const STYLES = {
  casual: 'Casual / family',
  experienced: 'Experienced players',
};

const byOrder = (a, b) => a.buyOrder - b.buyOrder || a.name.localeCompare(b.name);

/** Ranked = has a verdict and a place in the buy order. */
export const isRanked = (e) => Boolean(e.verdict) && e.buyOrder != null;
const rankedOf = (expansions) => expansions.filter(isRanked).sort(byOrder);

/** Everything an expansion needs (transitively), nearest first. */
export function prereqChain(exp, all) {
  const byId = new Map(all.map((e) => [e.id, e]));
  const out = [];
  const seen = new Set();
  const walk = (e) => {
    for (const id of e.requires || []) {
      const req = byId.get(id);
      if (!req || seen.has(id)) continue;
      seen.add(id);
      out.push(req);
      walk(req);
    }
  };
  walk(exp);
  return out;
}

function fitsPlayers(e, players) {
  if (!players) return true;
  if (e.minPlayers != null && players < e.minPlayers) return false;
  if (e.maxPlayers != null && players > e.maxPlayers) return false;
  return true;
}

function fitsStyle(e, style) {
  if (!style || !e.groupStyle || e.groupStyle === 'mixed') return true;
  return e.groupStyle === style;
}

/**
 * @param {object[]} expansions one game's expansions
 * @param {{owned?: string[], players?: number|null, style?: string|null}} state owned = slugs
 */
export function rankNext(expansions, { owned = [], players = null, style = null } = {}) {
  const ownedSet = new Set(owned);
  const isOwnedId = (id) => {
    const e = expansions.find((x) => x.id === id);
    return e && ownedSet.has(e.slug);
  };
  const rated = rankedOf(expansions);
  const next = [];
  const hidden = [];
  for (const e of rated) {
    if (ownedSet.has(e.slug)) continue;
    const blockedBy = prereqChain(e, expansions).filter((r) => !isOwnedId(r.id));
    const row = { ...e, blockedBy, fitsStyle: fitsStyle(e, style) };
    (fitsPlayers(e, players) ? next : hidden).push(row);
  }
  // Dense rank: ties in buyOrder share a number, gaps close up as rows drop out.
  let rank = 0;
  let last = null;
  for (const row of next) {
    if (row.buyOrder !== last) rank += 1;
    last = row.buyOrder;
    row.rank = rank;
  }
  return {
    next,
    hidden,
    owned: expansions.filter((e) => ownedSet.has(e.slug)),
    unrated: expansions.filter((e) => !isRanked(e)),
  };
}

/**
 * The one-line status above the list. Returns {text} or {lead, pick} where
 * `pick` is the expansion to link after `lead`.
 */
export function statusFor(result, state = {}) {
  const first = result.next[0];
  if (!first) {
    return { text: result.hidden.length ? 'Nothing ranked fits that player count.' : 'You own everything we rank.' };
  }
  const pick = result.next.find((e) => e.blockedBy.length === 0 && e.fitsStyle) || first;
  return { lead: state.owned?.length ? 'Your next buy: ' : 'Start with ', pick };
}

/** Parse `?own=a,b&p=4&style=casual`; unknown values are dropped. */
export function parseState(search, validSlugs) {
  const q = new URLSearchParams(search);
  const valid = new Set(validSlugs);
  const owned = (q.get('own') || '').split(',').filter((s) => valid.has(s));
  const p = Number.parseInt(q.get('p') || '', 10);
  const style = q.get('style');
  return {
    owned,
    players: Number.isInteger(p) && p > 0 && p < 13 ? p : null,
    style: style && STYLES[style] ? style : null,
  };
}

export function serializeState({ owned = [], players = null, style = null }) {
  const parts = [];
  if (owned.length) parts.push(`own=${owned.join(',')}`);
  if (players) parts.push(`p=${players}`);
  if (style) parts.push(`style=${style}`);
  return parts.join('&');
}

/** Head-to-head pairs among the top `top` rated expansions (skips pairs where one needs the other). */
export function comparePairs(expansions, top = 4) {
  const rated = rankedOf(expansions).slice(0, top);
  const pairs = [];
  for (let i = 0; i < rated.length; i++) {
    for (let j = i + 1; j < rated.length; j++) {
      const [a, b] = [rated[i], rated[j]];
      const linked =
        prereqChain(a, expansions).some((r) => r.id === b.id) ||
        prereqChain(b, expansions).some((r) => r.id === a.id);
      if (!linked) pairs.push([a, b]);
    }
  }
  return pairs;
}

export function playersText(e) {
  if (e.minPlayers && e.maxPlayers) return e.minPlayers === e.maxPlayers ? `${e.minPlayers}` : `${e.minPlayers}–${e.maxPlayers}`;
  if (e.maxPlayers) return `up to ${e.maxPlayers}`;
  return null;
}

export function priceText(e) {
  return e.priceUsd != null ? `$${e.priceUsd.toFixed(2)}` : null;
}

/** Rough price band, e.g. "$20–$40". */
export function priceBand(e) {
  const p = e.priceUsd;
  if (p == null) return null;
  if (p < 20) return 'Under $20';
  if (p < 40) return '$20–$40';
  if (p < 60) return '$40–$60';
  if (p < 100) return '$60–$100';
  return '$100+';
}
