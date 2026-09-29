# 03 — Pages generated from catalog.json

Status: resolved
Labels: ready-for-agent
PRD: user stories 6–9, 12, 14

## What
- `/[game]/expansions/` — the tool page (score track + filters), fully rendered server-side so it
  reads fine without JS and for crawlers.
- `/[game]/[expansion]/` — detail page: adds / fixes / what you need first / verdict / buy link.
- `/compare/[game]/[a]-vs-[b]/` — head-to-head for pairs among each game's top rated expansions
  (pair list from `comparePairs()` in `guide.mjs`, tested).
- Adding a game or expansion = edit raw-source CSV → `python3 raw-source/build_catalog.py`.

## Acceptance
- Every page stands alone (game name, context, links back).
- Buy links go through `AffiliateLink.astro` only (off until owner enables).
