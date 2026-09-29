/** game-search.mjs — homepage search: match a typed query against a game, its publisher and its expansions. */

export const normalize = (s) =>
  String(s ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** The small per-game record shipped to the browser. */
export const searchEntry = (game, gameExpansions) => ({
  slug: game.slug,
  name: game.name,
  publisher: game.publisher,
  expansions: gameExpansions.map((e) => e.name),
});

/**
 * Every query word must appear in the game's name/publisher, or in one expansion name
 * (the game name counts too, so "catan seafarers" works).
 * Returns null for no match, { via: null } for a direct hit, { via: expansionName } for an expansion hit.
 */
export function matchGame(entry, query) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return { via: null };
  const has = (...parts) => {
    const text = normalize(parts.join(' '));
    return words.every((w) => text.includes(w));
  };
  if (has(entry.name, entry.publisher)) return { via: null };
  const hit = entry.expansions.find((x) => has(entry.name, x));
  return hit ? { via: hit } : null;
}
