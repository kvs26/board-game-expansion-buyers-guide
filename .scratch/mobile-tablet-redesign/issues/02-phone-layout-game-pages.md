Status: resolved
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

## Comments

**Agent, 2026-10-20 — resolved.**
- **Approach:** phone CSS is gated on `html.js` (set by an inline head script in `Layout.astro`) plus
  `@media (max-width:767px)`. Phone-only controls (sub-nav, sheet close, row toggles, "Read more") are
  server-rendered with `display:none` by default; accordion toggles are injected by JS on phones only.
  No markup was removed, so all SSR text stays in the HTML.
- **What changed at ≤767px (`src/pages/[game]/expansions/index.astro`, `src/styles/base.css`):**
  - Header (`.hub-head`, hub only): icon inline with a 1.4rem H1; intro clamped to 3 lines with a
    "Read more" button (hidden when the intro fits); fact chips and the base-game buy strip each scroll
    sideways on one row.
  - Sticky 44px sub-nav: "Filter: I own…" pill (shows e.g. ": 2 owned, 3 players") plus jump links to
    the ranking, watch-outs, compare and FAQ sections.
  - Shelf opens as a bottom sheet (`role=dialog`, `aria-modal`, focus trap, Esc/backdrop/Done close and
    return focus to the pill). URL and localStorage persistence unchanged.
  - Ranked rows collapse to rank, name, verdict, a one-line reason and the first buy link; "More"
    (or tapping the row) expands in place.
  - Glance table hidden; Check before you buy, Stuck between two, FAQ and Other games are accordions.
    Jump links and `#hash` loads open the target accordion.
- **Results (rows collapsed):**

  | Page @390 | Before | After | 3rd ranked name bottom |
  |---|---|---|---|
  | clank | 5,777px | 2,246px | 757px |
  | catan | 8,849px | 3,049px | 738px |
  | wingspan | 5,569px | 2,078px | 738px |
  | legendary | — | 6,566px | 813px |

  Verdict and top 3 names are above the 844px fold on all four. Clank is 2,334px at 360 and 2,246px at
  430. `scrollWidth === innerWidth` on all four games at 360/390/430. No-JS fallback: shelf stays inline,
  pill hidden, no overflow.
- **Laptop/tablet unchanged:** computed styles and rects of every rendered element hash identically to
  HEAD at 768, 834, 1024 and 1280 on clank, catan, wingspan and legendary. Detail pages (which share
  `.game-head`) are untouched.
- **JSON-LD:** byte-identical to a HEAD build on all 1,207 pages.
- **Screenshots:** before in `../screens/02-before/`, after in `../screens/02-after/`
  (`{clank,catan,wingspan}-{360,390,430}-{fold,full}.png`, plus `clank-390-row-open.png`,
  `clank-390-sheet.png`, `clank-390-faq-open.png`).
- **Tests:** 2 new tests in `tests/pages.test.mjs` (one row toggle per ranked expansion; every sub-nav
  anchor resolves and the pill controls `#shelf`). `npm run build && npm test` 135/135.
  `astro check` goes from 121 to 128 errors; the extra 7 are "implicitly any" on the existing untyped
  `state` object, used by the new filter summary.
- **Code review (standards + spec):** fixed header CSS leaking into detail pages, an unscoped breadcrumb
  rule, missing `aria-modal`/focus trap, focus loss after "Read more", `fitLead` not re-running on resize,
  duplicated close code and an unused class. Consciously left:
  - Collapsed rows show the first buy link rather than a separate price pill (the price is in the link).
  - H1 is 1.4rem, not ~1.6rem, so the top 3 names fit above the fold.
  - Small meta labels (rank numbers, chip text) are below 16px; body text is 16px.
  - Tapping an open row does not collapse it; the "Less" button does (avoids closing when tapping links).
  - The `replaceState` change that preserves `location.hash` applies at all widths (needed for jump links,
    no visual effect).
  - Breakpoint is duplicated in JS (`matchMedia`) and CSS; `MediaQueryList.addEventListener` needs
    Safari 14+.
  - Tests are markup-only; interactions were verified in Chromium (row toggle, sheet, persistence on
    reload, accordions, Read more).
