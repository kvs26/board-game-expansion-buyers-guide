# 01 — "Buy next" ranking engine

Status: resolved
Labels: ready-for-agent
PRD: pipeline/board-games/ideas/board-game-expansion-buyers-guide/prd.md (user stories 1–5)

## What
Pure module `src/lib/guide.mjs` that, given one game's expansions and the visitor's state
(`owned` ids, `players`, `style`), returns:
- `next` — rated expansions not owned, in buy order, renumbered 1..N (ties share a number),
  each flagged `ready` or `blockedBy: [names]` when a required expansion isn't owned;
  `fitsPlayers` / `fitsStyle` flags driven only by per-row data (unknown = fits).
- `owned` — what the visitor marked.
- `unrated` — expansions with no verdict yet (never ranked).

## Acceptance
- Marking an expansion owned removes it from `next`; the rest renumber.
- An expansion needing another shows "get X first" until X is owned.
- Player count filter hides rows whose known max < players or known min > players.
- Never sorts by anything other than the editorial buy order.
- Unit tests in `tests/guide.test.mjs` (node:test, fixtures only).
