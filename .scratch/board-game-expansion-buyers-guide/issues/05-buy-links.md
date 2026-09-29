---
status: closed
label: ready-for-human
---

> **Closed 2026-09-29.** All 124 expansions (118 ranked) and all 20 base games now have at least one verified buy link: 267 expansion links in total, 82 of them on Amazon.
> - **Data:** links come from several stores: the publisher, Amazon (verified ASINs), and US retailers (Miniature Market, GameNerdz, CoolStuffInc, Target, Walmart, Asmodee). Each game has its own file, `raw-source/buy-links/<game>.csv`, with columns `target,store,kind,url,edition_note,checked_on,how_verified`. `build_catalog.py` merges these files into `buyLinks`.
> - **UI:** `src/components/BuyLinks.astro`. List rows show "Buy:" with up to 3 stores and a "+N more" link. Detail pages have a "Where to buy" box that shows the store, its type and any edition note.
> - **Tests:** every ranked expansion must have at least one link, and every link must appear on its pages.
> - **Follow-ups:**
>   - Some publisher rows (Rio Grande, Days of Wonder) block bots and were verified only by a search snippet or sitemap.
>   - Carcassonne expansions have only the publisher link, because retailers now sell the V3.1 reprints.
>   - Affiliate tagging is still off: `affiliate.enabled` in `src/lib/site.config.mjs`.

# 05 — Buy links for the remaining expansions

Only 21 of the 124 expansions have a product link (`amazon_asin` / `amazon_url` in `raw-source/research-batch*.csv`). The PRD asks for a purchase link on every ranked row and on every expansion detail page.

## To do
- Find the correct product page for each ranked expansion that has no link. There are 85 ranked, so 64 are missing. Make sure the link is for the right edition.
- Fill `amazon_asin` / `amazon_url` in the batch CSVs, then run `npm run data && npm run build && npm test`.
- Affiliate tagging is a separate, later step: turn on `affiliate.enabled` in `site.config.mjs`.

## Done when
Every ranked expansion shows a buy link on both the list page and its detail page. `tests/pages.test.mjs` already checks that any link in the data appears on both pages.
