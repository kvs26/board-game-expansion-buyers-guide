/**
 * hub-seo.mjs — title/description/JSON-LD for the per-game expansion hubs,
 * worded the way people search ("{game} expansions ranked", "best {game} expansion").
 */
import { absUrl } from './site.config.mjs';
import { VERDICTS } from './guide.mjs';

const VERDICT_TEXT = Object.fromEntries(Object.entries(VERDICTS).map(([k, v]) => [k, v.label.toLowerCase()]));

export function hubTitle(gameName) {
  return `${gameName} Expansions Ranked: Which to Buy First (2026)`;
}

export function hubDescription(gameName, topName) {
  return topName
    ? `Best ${gameName} expansions ranked in the order to buy them. Start with ${topName}. Tick what you own and the list updates, with what each box needs first.`
    : `Every ${gameName} expansion, what it adds, and what you need first.`;
}

/** CollectionPage node carrying dateModified, matching the visible "Last checked" date. */
export function hubModifiedLd(checkedOn, path) {
  return { '@type': 'CollectionPage', url: absUrl(path), dateModified: checkedOn };
}

const firstSentence = (s) => {
  const t = String(s || '').trim();
  const m = t.match(/^.+?[.!?](?=\s|$)/);
  const out = m ? m[0] : t;
  return out.length > 170 ? `${out.slice(0, 167).trimEnd()}...` : out;
};
const joinNames = (names) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

/**
 * 2-3 sentence "buy first / what to skip" intro, built from catalog data so every
 * game (including ones added later) gets one automatically. Returns string[].
 */
export function hubIntro(game, expansions) {
  const ranked = expansions
    .filter((e) => e.verdict && e.buyOrder != null)
    .sort((a, b) => a.buyOrder - b.buyOrder || a.name.localeCompare(b.name));
  if (!ranked.length) return [];
  const [top, second] = ranked;
  const out = [];
  const reason = firstSentence(top.reason);
  const adds = (String(top.adds || '').trim().match(/^.+?[.!?](?=\s|$)/)?.[0] || '').replace(/[.!?]$/, '');
  if (reason.includes(top.name) && !reason.endsWith('...')) out.push(reason);
  else if (adds && adds.length <= 110 && !adds.includes('(')) out.push(`Start with ${top.name}. It adds ${adds.charAt(0).toLowerCase()}${adds.slice(1)}.`);
  else out.push(`Start with ${top.name}, our top pick (${VERDICT_TEXT[top.verdict] || 'see details'}).`);
  if (second) out.push(`${second.name} is next in our buy order.`);
  const skips = ranked.filter((e) => e.verdict === 'skip_unless').map((e) => e.name);
  const depends = ranked.filter((e) => e.verdict === 'depends' && e !== second && e !== top).map((e) => e.name);
  if (skips.length) out.push(`Most groups can skip ${joinNames(skips.slice(0, 2))}${skips.length > 2 ? ` and ${skips.length - 2} more` : ''}.`);
  else if (depends.length) out.push(`${joinNames(depends.slice(0, 2))} ${depends.length > 1 ? 'depend' : 'depends'} on your group, so check before buying.`);
  if (out.length < 2) out.push(`Nothing else for ${game.name} ranks above it.`);
  return out.slice(0, 3);
}
