Status: ready-for-agent
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
