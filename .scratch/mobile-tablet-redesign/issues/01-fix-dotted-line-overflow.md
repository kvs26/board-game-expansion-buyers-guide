Status: resolved
Blocked by: none

# 01 — Fix dotted die-cut line overflowing content on mobile/tablet

Owner sees, on localhost at phone and tablet widths, a dashed outline cutting through the
`/clank/expansions/` hero (chips "30-60 min", "Dire Wolf / Renegade", "5 expansions checked" sit
across/outside the dashed box). Laptop is fine. See spec.md.

## Likely source
`src/styles/base.css` `.token::after` — absolutely positioned dashed border at `inset: 5px`.
Any token whose height is constrained (sticky `.shelf`, grid row stretch, `max-height`, fixed
aspect, overlap with the hero at the 600–900px breakpoints) will draw its dashed line over content.
The agent could not reproduce in headless Chromium at 360/390/418/430/768/1024 — so reproduce first:
Chrome DevTools device mode (iPhone 12/14 Pro, Pixel 7, iPad Mini/Air), DPR 2–3, after rotate/resize,
and with Safari/WebKit (`npx playwright` webkit).

## To do
- Reproduce and screenshot; identify the exact element (DevTools: inspect the dashed box).
- Fix the root cause (container height/overlap), not just hide the line.
- On ≤1023px, simplify decoration: drop the `::after` die-cut line on tokens (keep solid border + shadow); keep it on laptop.
- Check every page type for the same thing: home, `[game]/expansions`, expansion detail, compare, publishers, prose pages.

## Done when
- No dashed/dotted line crosses or clips text/chips at 360, 390, 430, 768, 834 in Chromium and WebKit.
- Laptop (1280) screenshots unchanged.
- `npm run build && npm test` pass.

## Comments

**Agent, 2026-10-20 — resolved.**
- **Element:** `aside.shelf.token.pad` on every `[game]/expansions/` page. Reproduced in Chromium (iPhone 14 Pro / Pixel 7 / iPad Mini / Air at DPR 2–3).
- **Root cause:** at ≤900px base.css set `.shelf { position: static }`. That removed the token's containing block, so `.token::after` (`position:absolute; inset:5px`) anchored to the page and drew a viewport-sized dashed box across the hero chips.
- **Fix (`src/styles/base.css`):**
  - `.shelf { position: relative; top: auto }` at ≤900px.
  - `.token::after { content: none }` at ≤1023px: solid border and shadow only on phones and tablets.
- **Checked in Chromium and WebKit, no dashed line escaping its token:**
  - Pages: home, hub, detail, compare, publisher, and the about, methodology, FAQ, disclosure, privacy and contact pages.
  - Widths: 360, 390, 430, 768, 834 and 1280.
  - Rotate/resize: checked.
- **Laptop at 1280:** computed styles and element rects are identical before and after on 6 page types. Full-page screenshots match apart from anti-alias noise.
- `npm run build` passes; `npm test` 133/133.
