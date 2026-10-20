Status: ready-for-agent
Blocked by: 01

# 02 — Phone layout for `/[game]/expansions/` (compact ranked list)

The money page. On a 390px phone it's ~5,800px tall; cards are 430–600px each; the glance table
sits below the cards; "Your shelf" eats the first screen. Redesign for ≤767px only.

## Target (first 844px of a 390px phone)
1. Breadcrumb + compact header: small game icon inline with H1 (shorter, ~1.6rem), verdict sentence
   clamped to 2–3 lines with "more".
2. Meta chips in one horizontally scrollable row (no wrap stack).
3. "Filter: I own…" pill opening a bottom sheet / `<details>` drawer with the current shelf controls
   (state persistence from ticket 02-persisted-shelf-state must keep working).
4. Ranked list immediately: each row = rank badge, expansion name, verdict tag (buy/skip/later), one-line
   reason, price/buy button. Tap row → expands in place (`<details>`/accordion) to the full card content
   (needs, off-style note, meta, buy links).
- "Ranked at a glance" table: on phones, merge into the ranked list (it *is* the glance) — hide the
  duplicate table, or render as list rows. No horizontal-scroll tables.
- Optional small sticky sub-nav (Ranking · Check before you buy · Compare · FAQ), ≤44px tall.
- Lower sections (Check before you buy, Stuck between two, FAQ, Other games) become accordions.

## Constraints
- Server-rendered content must stay in the HTML (SEO + `tests/pages.test.mjs` text checks); collapse with
  `<details>`/CSS, not by removing markup. JSON-LD unchanged.
- Tap targets ≥44px; body text ≥16px; no layout shift from ads (`.ad-slot` reserved height).
- Laptop ≥1024px: no visual change. Tablet handled in 03.
- Mind the Astro `<a>` whitespace gotcha in any prose you touch.

## Done when
- At 390×844 the verdict + top 3 ranked names are visible without scrolling.
- `/clank/expansions/` page height at 390 is ≤3,000px with rows collapsed (today ~5,800px).
- Checked at 360, 390, 430 on 3 games (clank, catan, wingspan or similar big list); no horizontal overflow
  (`scrollWidth === innerWidth`).
- `npm run build && npm test` pass; before/after screenshots saved in the ticket comments.
