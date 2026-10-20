# 02 — Cross-game links, FAQ schema, and more compare pages

Status: ready-for-agent
Site: sites/board-game-expansion-buyers-guide
Blocked by: none (can run parallel to 01; touches different files)

## Why
Audit: game hubs link only to their own compare pages and back to home, so link equity is not spread
across ~100 hubs. FAQ page exists but has no FAQPage schema and no per-hub FAQ. A compare page
("viticulture bordeaux vs tuscany") already earned a click, so compare pages are working long-tail
entry points.

## Scope

1. **Cross-game "also see" links.** 4-6 related games per hub (same publisher/genre/series), plus
   genre hub pages linking all games in the genre. Add `related` to game data or derive from tags.
2. **Per-hub FAQ block + `FAQPage` JSON-LD.** 3-5 Q&As per hub built from real Search Console queries
   (e.g. "which spirit island expansion first", "is X worth it", "do I need Y before Z"). Update the
   comment in `src/lib/seo.mjs` that intentionally omits FAQPage.
3. **More compare pages.** Add pairs for games with impressions (Spirit Island, Catan, Dune Imperium,
   Wingspan); link them prominently from hubs. Titles "X vs Y: which expansion first?".
4. **Measurement.** Weekly Search Console export (queries + pages) saved under
   `sites/board-game-expansion-buyers-guide/docs/`; track impressions/clicks/position per hub.
   Do not act on single-query rank moves at this volume.

## Acceptance
- Every hub shows related-game links; genre hubs in sitemap.
- FAQ visible on hubs and valid `FAQPage` JSON-LD; tests pass.
- New compare pages build and are linked from their hubs.
- First weekly GSC export committed.

## Comments
