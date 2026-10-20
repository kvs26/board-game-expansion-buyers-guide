# Site changelog

Common log for this site. Add a new entry at the top for every change: date, what changed, files touched.

## 2026-10-20 — One-to-two-line Bryson intro under the title; removed repeated blocks

- Removed the "Which {game} expansion to buy first, and what to skip" section and made the "Start with X" status line visually hidden (kept for screen readers).
- The line under each hub title is now a 1-2 sentence Bill Bryson-style blurb that names the top pick and what to skip (all 100 games, `src/data/editorial.json`, max 45 words, tested). It replaces the plain game description on hubs.
- New games without an entry fall back to the first two sentences of the generated intro.
- Files: `src/pages/[game]/expansions/index.astro`, `src/data/editorial.json`, `tests/hub-seo.test.mjs`.

## 2026-10-20 — Bryson-style intro for all 100 games

- Every hub's "Which {game} expansion to buy first, and what to skip" intro is now hand-written in a Bill Bryson-style voice, 2-3 sentences each, stored in `src/data/editorial.json` (all 100 games).
- The generated intro (`hubIntro`) remains the automatic fallback for any new game without an entry. Add a slug to `editorial.json` to give it the Bryson treatment.
- Files: `src/data/editorial.json`, `tests/hub-seo.test.mjs`.

## 2026-10-20 — Removed "More on buying" section; Catan intro rewritten

- Removed the long "More on buying {game} expansions" block from every hub (the six hand-written essays are gone).
- `src/data/editorial.json` now holds short hand-written intro overrides (max 90 words). Catan's intro is rewritten in a Bill Bryson-style voice; all other games use the generated intro.
- Files: `src/pages/[game]/expansions/index.astro`, `src/data/editorial.json`, `tests/hub-seo.test.mjs`.

## 2026-10-20 — Short "buy first / what to skip" intro on every hub, compact lower sections

- Every hub now opens with a 2-3 sentence "Which {game} expansion to buy first, and what to skip" block, generated from catalog data (`hubIntro` in `src/lib/hub-seo.mjs`). New games get it automatically; a test fails if one is missing.
- The six long hand-written editorial blocks stay lower on the page under "More on buying {game} expansions".
- Lower hub sections compacted (folds, chips) without reordering.
- Files: `src/lib/hub-seo.mjs`, `src/pages/[game]/expansions/index.astro`, `tests/hub-seo.test.mjs`, `src/styles/base.css`.

## 2026-10-20 — Hub query wording, editorial blocks, ranked table (ticket 01)

- Hub title is now "{Game} Expansions Ranked: Which to Buy First (2026)"; H1 matches; meta description starts "Best {Game} expansions…" — `src/lib/hub-seo.mjs`.
- Editorial block (about 200 words, data in `src/data/editorial.json`) on the Catan, Spirit Island, Wingspan, Ticket to Ride, Dune: Imperium and Small World hubs.
- Ranked table on every hub (rank, expansion, adds, needs, price/buy link) and `CollectionPage` JSON-LD with `dateModified` equal to "Last checked".
- Files: `src/lib/hub-seo.mjs`, `src/data/editorial.json`, `src/pages/[game]/expansions/index.astro`, `tests/hub-seo.test.mjs`.
- Still open: request indexing in Search Console for the six priority hubs after deploy.

## 2026-10-20 — Cross-game links, hub FAQ, wider compare pages (ticket 02)

- Each game hub now shows 4–6 "Other games' expansion guides" links (same publisher first, then nearest by player count and play time) — `src/lib/related.mjs`.
- New publisher hub pages at `/publishers/<publisher>/` (publishers with 2+ games), linked from hubs and included in the sitemap. The catalog has no genre field, so publisher hubs stand in for genre hubs.
- Per-hub "quick answers" FAQ (3–5 Q&As built from catalog data) with `FAQPage` JSON-LD (`faqPageLd` in `src/lib/seo.mjs`; comment updated).
- Compare pages: Spirit Island, Catan, Dune: Imperium, Wingspan and Viticulture now use the top 5 expansions (more pairs); first comparison is linked near the top of each hub.
- Tests: `tests/related.test.mjs`.
- Still open: first weekly Search Console export (needs the owner's GSC access) to be saved in `docs/`.
