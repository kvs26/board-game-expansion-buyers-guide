/**
 * game-art.mjs — per-game box-tile art (colour + glyph) and the edition
 * "watch out" notes found during research (docs/research/2026-09-27-batch*.md).
 * Art only; all ranking data lives in src/data/catalog.json.
 */

/** Simple 24x24 glyph paths, drawn in the token-face colour on the box tile. */
export const GLYPHS = {
  hex: 'M12 2 21 7v10l-9 5-9-5V7z',
  train: 'M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3l2 3h-2.5l-2-3h-5l-2 3H5l2-3a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zm1 3v5h10V6zm1 8a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 8 14zm8 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z',
  tile: 'M3 3h18v18H3zm7 0v5a2 2 0 1 0 4 0V3zm11 7h-5a2 2 0 1 0 0 4h5z',
  cards: 'M8 2h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM3 6.5 5 6v12a3 3 0 0 0 3 3h9l-.3 1.1a2 2 0 0 1-2.4 1.4L4.6 21A2 2 0 0 1 3.2 18.6z',
  planet: 'M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM2 17c0-1.4 2.5-3.3 6-4.7l.6 1.4C5.3 15 3.8 16.3 4 16.8c.4.9 5-.2 10.4-2.5S23 9.7 22.6 8.8c-.2-.4-1.5-.4-3.5.1l-.4-1.4C21.4 6.8 23.6 6.8 24 7.8c.8 1.8-4.4 5.8-11.2 8.7C6.3 19.4 2 20 2 17z',
  pyramid: 'M12 2 23 21H1zm0 5-5.2 9h10.4z',
  paw: 'M12 11c3 0 6 4 6 7 0 2-1.6 3-3 3-1.3 0-1.9-.8-3-.8S10.3 21 9 21c-1.4 0-3-1-3-3 0-3 3-7 6-7zM5 7.5a2.3 2.8 0 1 1 0 5.6 2.3 2.8 0 0 1 0-5.6zm14 0a2.3 2.8 0 1 1 0 5.6 2.3 2.8 0 0 1 0-5.6zM9 3a2.3 2.8 0 1 1 0 5.6A2.3 2.8 0 0 1 9 3zm6 0a2.3 2.8 0 1 1 0 5.6A2.3 2.8 0 0 1 15 3z',
  gear: 'M10 2h4l.6 2.6 2 .9 2.3-1.4 2.8 2.8-1.4 2.3.9 2 2.6.6v4l-2.6.6-.9 2 1.4 2.3-2.8 2.8-2.3-1.4-2 .9L14 22h-4l-.6-2.6-2-.9-2.3 1.4-2.8-2.8 1.4-2.3-.9-2L0 14v-4l2.6-.6.9-2-1.4-2.3 2.8-2.8 2.3 1.4 2-.9zm2 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
  leaf: 'M20 3C9 3 4 8 4 15c0 1.6.4 3 1 4.2L3 21.5 4.5 23l2.3-2.2C8 21.5 9.4 22 11 22c7 0 11-6 9-19zM8 18c2-4 5-7 9-9-3 3-5.5 6-7 9.5z',
  bird: 'M15 4a4 4 0 0 1 4 3.5L23 9l-4 1.2V11c0 5-4 9-9 9H2l3-3c-2-2-2.5-5-1-8 1.5 2 4.5 3 7 3l.5-4.5A4 4 0 0 1 15 4zm0 2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  mars: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM7 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm2-6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  tree: 'M12 1 20 12h-3.5l4.5 6h-7v5h-4v-5H3l4.5-6H4z',
  compass: 'M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22zm4.5 6.5-6.5 2.5-2.5 6.5 6.5-2.5zM12 10.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
  virus: 'M11 1h2v3.1a8 8 0 0 1 3.9 1.6l2.2-2.2 1.4 1.4-2.2 2.2A8 8 0 0 1 19.9 11H23v2h-3.1a8 8 0 0 1-1.6 3.9l2.2 2.2-1.4 1.4-2.2-2.2a8 8 0 0 1-3.9 1.6V23h-2v-3.1a8 8 0 0 1-3.9-1.6l-2.2 2.2-1.4-1.4 2.2-2.2A8 8 0 0 1 4.1 13H1v-2h3.1a8 8 0 0 1 1.6-3.9L3.5 4.9l1.4-1.4 2.2 2.2A8 8 0 0 1 11 4.1zm-1 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  claw: 'M4 21c3-9 7-15 16-18-4 4-6 8-6.5 12 1.5-3 4-5 7.5-6-3 3-4.5 7-4.5 12zM3 13c1-4 3-7 7-9-2 3-3 6-3 9z',
  map: 'M1 4 8 1l8 3 7-3v19l-7 3-8-3-7 3zm7 0v16l8 3V7z',
  worm: 'M3 20c0-6 3-9 7-9s5-3 5-5a3 3 0 0 1 6 0c0 5-3 8-7 8s-6 3-6 6zm15-15.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  grape: 'M13 1c2 0 4 1 5 3-2 0-3.5.5-4.5 1.5l-.5-1c0-1.5 0-2.5 0-3.5zM9 6a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 9 6zm6 0a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 15 6zm-3 5a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zm-5.5 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zm11 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zM9 16a2.4 2.4 0 1 1 0 4.8A2.4 2.4 0 0 1 9 16zm6 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
  key: 'M7 5a6 6 0 0 1 5.7 8H23v3h-2v3h-3v-3h-2v-3h-3.3A6 6 0 1 1 7 5zm0 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  crystal: 'M12 1 20 8 12 23 4 8zm0 4.2L8.6 8 12 15.5 15.4 8z',
  castle: 'M2 21V6h3v2h2V6h3v2h4V6h3v2h2V6h3v15h-7v-5a3 3 0 0 0-6 0v5z',
  hat: 'M5 20c0-1 .8-1.6 2-2L8 5l4 4 4-4 1 13c1.2.4 2 1 2 2zM3 21h18v2H3z',
  flame: 'M12 1c1 4 6 7 6 13a6 6 0 0 1-12 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-4-1-8 2-11.5zm0 12c-1.5 1.5-2 2.5-2 3.5a2 2 0 0 0 4 0c0-1-.5-2-2-3.5z',
  shield: 'M12 1 21 4v7c0 5.5-3.8 10-9 12-5.2-2-9-6.5-9-12V4zm0 4.5-2 4.5H5.5l3.7 2.6-1.4 4.6L12 14.8l4.2 2.9-1.4-4.6 3.7-2.6H14z',
  star: 'M12 1.5 15 8.6l7.5.6-5.7 5 1.8 7.4L12 17.6 5.4 21.6l1.8-7.4-5.7-5L9 8.6z',
  bolt: 'M14 1 4 14h6l-2 9 11-14h-6.5z',
  pylon: 'M11 1h2v4h5l-1 2h-4v3l5 13h-2.2l-1.2-3.5h-5.2L8.2 23H6l5-13V7H7L6 5h5zm1 12.5L10.6 17.5h2.8z',
  ring: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z',
  bomb: 'M10 7a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm7-5 2 2-3 3.5-2-2zm4 1h2v2h-2z',
  column: 'M12 1 22 6v2H2V6zM3 9h18v2H3zm2 3h3v7H5zm5.5 0h3v7h-3zM16 12h3v7h-3zM2 20h20v3H2z',
  cauldron: 'M5 9h14v1.5c2 1.2 3 3.2 3 5.2 0 3.8-4.5 6.3-10 6.3S2 19.500 2 15.700c0-2 1-4 3-5.200zM7 3a1.500 1.500 0 1 1 0 3 1.500 1.500 0 0 1 0-3zm5 1a1.200 1.200 0 1 1 0 2.400 1.200 1.200 0 0 1 0-2.400zm5-1a1.500 1.500 0 1 1 0 3 1.500 1.500 0 0 1 0-3z',
  alien: 'M12 1c5 0 8 5 8 11 0 3-1 5-3 6.200l1 4.800h-3l-1-3h-4l-1 3H7l1-4.800C6 17 5 15 5 12 5 6 7 1 12 1zM7.500 10l3.500 2.500-3.500 1.500zm9 0v4L13 12.500z',
  tower: 'M7 1h3v3h4V1h3v6l-1.500 1.500V21H17v2H7v-2h1.500V8.500L7 7zm5 12a2 2 0 0 0-2 2v6h4v-6a2 2 0 0 0-2-2z',
  saucer: 'M12 3c3 0 5 1.800 5.300 4.200C20.500 8.300 23 9.800 23 11.500 23 14 18 16 12 16S1 14 1 11.500c0-1.700 2.500-3.200 5.700-4.300C7 4.800 9 3 12 3zm0 2.500c-1.600 0-2.700.8-3 2 .9-.2 1.900-.3 3-.3s2.100.1 3 .3c-.3-1.200-1.400-2-3-2zM6 18l-2 4h2l2-3.500zm6 .8-.8 4.200h1.600zm6-.8-2 3.500 2 3.500h2z',
  fish: 'M2 12c3-5 8-7 13-6 3 .6 5.5 2.6 7 6-1.5 3.4-4 5.4-7 6-5 1-10-1-13-6zm14-2a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 16 10zM0 7l4 5-4 5z',
};

/** colour = box tile colour, ink = glyph colour. */
export const GAME_ART = {
  '7-wonders': { color: '#B5763A', ink: '#FFFDF8', glyph: 'pyramid' },
  carcassonne: { color: '#3C7A3A', ink: '#FFFDF8', glyph: 'tile' },
  cascadia: { color: '#2F8A8A', ink: '#FFFDF8', glyph: 'fish' },
  catan: { color: '#D9822B', ink: '#1D2A44', glyph: 'hex' },
  clank: { color: '#6C3E8E', ink: '#F2B705', glyph: 'key' },
  dominion: { color: '#8E2F2F', ink: '#F2B705', glyph: 'cards' },
  'dune-imperium': { color: '#C79A4B', ink: '#1D2A44', glyph: 'worm' },
  everdell: { color: '#4E6E2E', ink: '#FFFDF8', glyph: 'tree' },
  'king-of-tokyo': { color: '#C8372D', ink: '#FFFDF8', glyph: 'claw' },
  'lost-ruins-of-arnak': { color: '#2E6E5E', ink: '#F2B705', glyph: 'compass' },
  pandemic: { color: '#2F6DB5', ink: '#FFFDF8', glyph: 'virus' },
  'race-for-the-galaxy': { color: '#23305A', ink: '#F2B705', glyph: 'planet' },
  root: { color: '#E07A2E', ink: '#1D2A44', glyph: 'paw' },
  scythe: { color: '#6B5B45', ink: '#F2B705', glyph: 'gear' },
  'small-world': { color: '#7FA83A', ink: '#1D2A44', glyph: 'map' },
  'spirit-island': { color: '#2E8B57', ink: '#FFFDF8', glyph: 'leaf' },
  'terraforming-mars': { color: '#B0462C', ink: '#FFFDF8', glyph: 'mars' },
  'ticket-to-ride': { color: '#A8322D', ink: '#FFFDF8', glyph: 'train' },
  'viticulture-essential-edition': { color: '#6E2447', ink: '#F2B705', glyph: 'grape' },
  wingspan: { color: '#5AA0B8', ink: '#1D2A44', glyph: 'bird' },
  'arkham-horror-the-card-game': { color: '#2B3A2E', ink: '#C9B26B', glyph: 'cards' },
  'eldritch-horror': { color: '#3A2F4F', ink: '#C9B26B', glyph: 'compass' },
  'mansions-of-madness': { color: '#4A2B2B', ink: '#F2B705', glyph: 'key' },
  concordia: { color: '#8C2F39', ink: '#FFFDF8', glyph: 'map' },
  'ark-nova': { color: '#2E7D5B', ink: '#FFFDF8', glyph: 'paw' },
  'twilight-imperium': { color: '#1B1F3B', ink: '#F2B705', glyph: 'planet' },
  'heat-pedal-to-the-metal': { color: '#D7372B', ink: '#FFFDF8', glyph: 'gear' },
  splendor: { color: '#2A5C8A', ink: '#F2B705', glyph: 'hex' },
  sagrada: { color: '#6A3D9A', ink: '#FFFDF8', glyph: 'tile' },
  'aeons-end': { color: '#3B2A6B', ink: '#7FE3F0', glyph: 'crystal' },
  'architects-of-the-west-kingdom': { color: '#7A5C3A', ink: '#FFFDF8', glyph: 'castle' },
  'disney-villainous': { color: '#1F5C3A', ink: '#B58CE0', glyph: 'hat' },
  'flash-point-fire-rescue': { color: '#E2501F', ink: '#FFF2C4', glyph: 'flame' },
  'marvel-champions': { color: '#B11E2D', ink: '#FFFDF8', glyph: 'shield' },
  'memoir-44': { color: '#556B3A', ink: '#E8DDB0', glyph: 'star' },
  'power-grid': { color: '#2D3E50', ink: '#F2D230', glyph: 'pylon' },
  'smash-up': { color: '#D63E8C', ink: '#FFFDF8', glyph: 'bomb' },
  'the-lord-of-the-rings-the-card-game': { color: '#2F3B2A', ink: '#E5B94A', glyph: 'ring' },
  '7-wonders-duel': { color: '#2F6F8F', ink: '#F5D58A', glyph: 'column' },
  'the-quacks-of-quedlinburg': { color: '#5B3A8C', ink: '#8BE08B', glyph: 'cauldron' },
  nemesis: { color: '#14201C', ink: '#9BE04A', glyph: 'alien' },
  'lords-of-waterdeep': { color: '#8A1F2B', ink: '#E8C468', glyph: 'tower' },
  'cosmic-encounter': { color: '#1F2A6B', ink: '#FF8FB1', glyph: 'saucer' },
  dixit: { color: '#E3A33B', ink: '#1D2A44', glyph: 'leaf' },
};

export function artFor(slug) {
  return GAME_ART[slug] || { color: '#1D2A44', ink: '#FFFDF8', glyph: 'hex' };
}

/** Plain-language "check before you buy" notes, from the research files. */
export const WATCH_OUT = {
  catan: [
    'For 5–6 players with an expansion like Seafarers you need four boxes: the base game, the base 5–6 extension, the expansion, and that expansion’s own 5–6 extension.',
    'CATAN is now on its 6th edition (2025 boxes). The publisher says current expansions need the 6th-edition base game.',
  ],
  dominion: [
    'Every Dominion expansion needs the basic Treasure and Victory cards — from the Dominion base game or the separate Base Cards set.',
    'Intrigue 2nd edition (2016) is not standalone; the old 1st edition (2009) was.',
    'Seaside, Prosperity and Hinterlands got 2nd editions in 2022, and Cornucopia & Guilds now come as one box. Some cards changed between editions.',
  ],
  '7-wonders': [
    'Don’t mix 1st- and 2nd-edition 7 Wonders boxes (the 2nd edition has a metallic title). Buy expansions that match your base game. Edifice is the one exception — the publisher says it works with both.',
  ],
  'race-for-the-galaxy': [
    'The expansions come in separate story arcs that can’t be mixed. Within an arc, buy them in order.',
  ],
  'spirit-island': [
    'Nature Incarnate needs Jagged Earth — a common surprise.',
    'Jagged Earth does not need Branch & Claw.',
  ],
  pandemic: ['In the Lab needs On the Brink.'],
  root: [
    'Clockwork Expansion 2 needs Root plus either The Riverfolk or The Underworld.',
    'Riverfolk’s bot is replaced by the Clockwork bots, so don’t buy Riverfolk just for solo play.',
  ],
  wingspan: ['Asia works on its own for 1–2 players, but its 6–7 player “Flock” mode needs parts from the base game.'],
  everdell: ['Mistwood already includes the Corrin Evertail, Legends II and Through Every Season mini packs.'],
  'dune-imperium': ['Bloodlines works with either Dune: Imperium or Dune: Imperium – Uprising.'],
  'viticulture-essential-edition': [
    'If you own the original Tuscany, you already have the Tuscany Essential Edition content.',
    'The designer says not to mix the Moor and Rhine Valley visitor decks.',
  ],
  clank: ['A newer “Master Thief Edition” exists. Check which edition an expansion is made for before buying.'],
  'lost-ruins-of-arnak': ['The Missing Expedition campaign is for 1–2 players only.'],
  'arkham-horror-the-card-game': ['Each cycle comes as two boxes: a Campaign Expansion (scenarios) and an Investigator Expansion (player cards). Buy them in pairs for the full cycle.'],
  'mansions-of-madness': ['Recurring Nightmares and Suppressed Memories are out of print; every expansion listed here also needs the free companion app.'],
  splendor: ['The Silk Road and The Sun Never Sets re-release the four Cities of Splendor modules. If you own Cities of Splendor, you already have this content.'],
  'twilight-imperium': ['7–8 player games need Prophecy of Kings, even if you also own Thunder’s Edge.'],
};
