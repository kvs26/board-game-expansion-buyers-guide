Status: resolved
Blocked by: 02

# 03 — Tablet layout + phone pass on remaining page types

## Tablet (768–1023px)
- Game page: two-column — ranked list (from 02, expanded rows allowed) left, sticky compact shelf/filter
  panel right (≤ viewport height, internal scroll) — or shelf as a top filter bar if it doesn't fit.
  Never a sticky element taller than the viewport.
- Card grids 2-up; hero chips on one row; glance table may show (fits at 768) but not duplicated below cards.
- Unify breakpoints in `base.css` (today: 600/760/860/900 mixed) into tokens: phone ≤767, tablet 768–1023,
  laptop ≥1024.

## Phone + tablet pass on other pages
- Home: hero art smaller/after headline on phones; game picker as searchable list (A–Z + search) instead
  of a long grid; letters jump bar.
- Expansion detail: verdict + buy box first, details accordions.
- Compare (`/compare`): stacked "A vs B" summary rows, no side-by-side columns under 768.
- Publishers, about/faq/methodology/privacy/disclosure: readable measure, accordion FAQ, footer 2-col.
- Header: on phones collapse nav to a menu button or a single scrollable row; keep ≤56px tall.

## Done when
- No horizontal overflow, no clipped text, no dashed-line artifacts at 360/390/430/768/834 on every page type.
- Laptop 1280 screenshots unchanged.
- `npm run build && npm test` pass; screenshots per width attached in ticket comments for owner review.

## Comments

### Agent — implementation

- **Breakpoints:** `base.css` now uses only phone ≤767 / tablet 768–1023 / laptop ≥1024. CSS custom
  properties can't be used inside `@media`, so they are literals documented in `tokens.css`, and
  `tests/breakpoints.test.mjs` fails on any other width in any `src/` file (CSS or `matchMedia`).
- **Tablet:**
  - Game page: ranked list on the left, a 16rem shelf on the right. The shelf is sticky, capped at
    `100dvh − 2×space-4` and scrolls inside.
  - Game picker is 2-up. Hero chips are on one scrolling row. The glance table is hidden at ≤1023.
  - Link lists (`.later-list`: publisher pages, "Compare it") are capped at `--measure`.
- **Phones:**
  - **Header:** 56px, with a "Menu" button that opens the nav as a dropdown with 48px links. It closes
    on Escape or an outside click. Without JS, the nav is a single scrolling row.
  - **Home:** smaller hero art after the headline, the game grid as a list, and a sticky A–Z jump bar
    with letter headings. Searching hides the bar and the headings.
  - **Expansion page:** verdict, then the buy box, then Quick facts (folded), then the details as
    accordions. "Our take" starts open; Compare it and Sources fold.
  - **Compare:** each question is a stacked row, A then B, with the expansion name labelled on each
    cell. Explicit table roles keep the table semantics.
  - **FAQ:** one accordion per question.
  - **Footer:** 2 columns.
  - **Accordion code:** shared by the game, expansion and FAQ pages through `src/lib/phone-folds.mjs`.
    On phones the heading becomes a button; at wider widths it is unwrapped again.
- **Results:** 13 page types × 360/390/430/768/834, checked in Chromium and WebKit. All 65 checks pass
  in each engine: no horizontal overflow, no text clipped by its box, and no dashed `::after` boxes.
  The header is 56px on phones and 68px on tablet.

  | Page | 360 height | 768 height |
  |---|---|---|
  | Home | 9,194px (12,312px before) | 7,034px |
  | Expansion detail | 1,814px | 1,696px |
  | Compare | 3,270px | 1,757px |
  | FAQ | 1,368px | 1,642px |

- **Laptop unchanged:** I used a computed-style and geometry snapshot of every element in `main` on all
  13 pages at 1024 and 1280, not a pixel diff (anti-aliasing noise). It matches the pre-change baseline
  except for:
  - new class names with identical styles (`tool-main`, `faq-q`, `quick-facts`);
  - one wrapper `div` around Quick facts that has no effect on layout.
- **Screenshots:** before in `../screens/03-before/`, after in `../screens/03-after/`, both named
  `{page}-{360,390,430,768,834}-{fold,full}.png`. Pages: home, hub, hubCatan, detail, compare,
  publisher, about, methodology, faq, disclosure, privacy, contact, e404.
- **Tests:** new tests for the A–Z bar, the folds (FAQ, detail and Quick facts), compare cell labels and
  roles, the header menu on 6 page types, and the breakpoint guard. `npm run build && npm test`: 140/140
  pass. `astro check` is unchanged at 128.
- **Code review (standards + spec) fixes:**
  - A malformed `#hash` no longer throws and stops the game-page script.
  - Quick facts now fold, so "Our take" is on the first screen.
  - Compare table roles added.
  - Publisher page measure added.
  - A–Z code: clearer names, and the `#` label is no longer duplicated.
  - The header outside-click handler only runs when the menu is open.
  - Fold CSS moved into its own "Folding sections" block.
  - The breakpoint guard now covers JS too.
- **Consciously left:**
  - On tablet the shelf is first in the DOM but sits in the right column, so keyboard focus reaches
    filters before the list. That matches laptop, where the shelf is on the left.
  - The glance table is hidden at every width ≤1023 (the ticket says "may show").
  - Hero art now also shows at tablet (it was hidden at ≤860), capped at 340px.
  - `.detail` and `.tool` are two columns from 768, because the breakpoints were unified.
  - Open accordions reset to their defaults when you rotate past 767px.
