/**
 * related.mjs — cross-game links, publisher hubs and per-hub FAQ text.
 * Pure functions over the catalog; no genre field exists, so "related" =
 * same publisher first, then closest player range / play time.
 */
import { isRanked, prereqChain, VERDICTS, comparePairs } from './guide.mjs';

export const publisherSlug = (name) =>
  String(name).toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const minutes = (g) => {
  const m = String(g.playTime || '').match(/\d+/g);
  return m ? m.map(Number).reduce((a, b) => a + b, 0) / m.length : null;
};

function distance(a, b) {
  const pa = ((a.minPlayers || 0) + (a.maxPlayers || 0)) / 2;
  const pb = ((b.minPlayers || 0) + (b.maxPlayers || 0)) / 2;
  const ta = minutes(a);
  const tb = minutes(b);
  const time = ta != null && tb != null ? Math.abs(ta - tb) / 30 : 3;
  return Math.abs(pa - pb) + time;
}

/** 4-6 other games: same publisher first, then nearest by players / play time. */
export function relatedGames(game, games, max = 6) {
  const others = games.filter((g) => g.slug !== game.slug);
  const byName = (a, b) => a.name.localeCompare(b.name);
  const same = others.filter((g) => g.publisher && g.publisher === game.publisher).sort(byName);
  const rest = others
    .filter((g) => !same.includes(g))
    .sort((a, b) => distance(game, a) - distance(game, b) || byName(a, b));
  return [...same.slice(0, 3), ...rest].slice(0, max);
}

/** Publishers with 2+ games, each { name, slug, games } (games sorted by name). */
export function publisherGroups(games) {
  const map = new Map();
  for (const g of games) {
    if (!g.publisher) continue;
    if (!map.has(g.publisher)) map.set(g.publisher, []);
    map.get(g.publisher).push(g);
  }
  return [...map.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([name, list]) => ({ name, slug: publisherSlug(name), games: list.sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const sentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

/** 3-5 Q&As built only from catalog data (order, verdicts, prerequisites, player counts). */
export function hubFaqs(game, expansions) {
  const ranked = expansions.filter(isRanked).sort((a, b) => a.buyOrder - b.buyOrder || a.name.localeCompare(b.name));
  if (!ranked.length) return [];
  const [top, second] = ranked;
  const faqs = [];
  faqs.push({
    q: `Which ${game.name} expansion should I buy first?`,
    a: `${top.name}. ${top.reason ? sentence(top.reason) : `It’s number one in our buy order for ${game.name}.`}`,
  });
  faqs.push({
    q: `Is ${top.name} worth it?`,
    a: `Our verdict: ${VERDICTS[top.verdict].label.toLowerCase()}. ${top.adds ? `It adds: ${sentence(top.adds)}` : ''}`.trim(),
  });
  const gated = ranked.find((e) => prereqChain(e, expansions).length);
  if (gated) {
    const need = prereqChain(gated, expansions).map((c) => c.name).join(' and ');
    faqs.push({ q: `Do I need ${need} before ${gated.name}?`, a: `Yes. ${gated.name} needs ${need} first.` });
  }
  const players = ranked.find((e) => e.type === 'player_count_extension');
  if (players) {
    faqs.push({
      q: `Can I play ${game.name} with more players?`,
      a: `${players.name} extends it${players.maxPlayers ? ` to ${players.maxPlayers} players` : ''}. Our verdict: ${VERDICTS[players.verdict].label.toLowerCase()}.`,
    });
  }
  const pair = comparePairs(expansions, 5)[0];
  if (faqs.length < 5 && pair) {
    const [a, b] = pair;
    faqs.push({ q: `${a.name} or ${b.name}: which first?`, a: `We’d buy ${a.buyOrder <= b.buyOrder ? a.name : b.name} first. See the side-by-side comparison for what each adds and needs.` });
  }
  if (faqs.length < 3 && second) {
    faqs.push({ q: `What should I buy after ${top.name}?`, a: `${second.name} is next in our buy order.` });
  }
  if (faqs.length < 3) {
    faqs.push({
      q: `How many ${game.name} expansions are there?`,
      a: `We checked ${expansions.length} ${game.name} expansion${expansions.length === 1 ? '' : 's'} and ranked ${ranked.length} of them in buy order.`,
    });
  }
  return faqs.slice(0, 5);
}
