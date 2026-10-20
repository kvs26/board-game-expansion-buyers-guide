Status: ready-for-agent

# Mobile + tablet redesign (laptop stays as-is)

Most traffic is mobile. The laptop layout (≥1024px) is good and must not change visually.
Redesign phone S/M/L (360 / 390 / 430) and tablet (768 / 834 portrait, 1024 landscape is "laptop").

## Findings (local dev, `/clank/expansions/`, 2026-10-20)
- Page height: ~5,800px at 390 vs ~3,600px at 1024 (≈7 phone screens).
- Each ranked "Buy order" card is 430–600px tall on phones (270–330px at 768) — every block stacks.
- "Ranked at a glance" table sits ~3,800px down at 390, *after* the cards it summarises → users scroll up/down to compare.
- "Your shelf" filter takes a full screen (~570px) before the first ranked card.
- Owner screenshot (localhost): a `.token::after` dashed die-cut line (base.css `.token::after`, `inset: 5px`) visibly cuts through the hero chips on mobile/tablet. Not reproduced by the agent at 360–1024 in headless Chromium → ticket 01 must reproduce it first (try Chrome DevTools device mode, DPR 2–3, rotation/resize, every page type).

## Decisions (owner, 2026-10-20)
- Follow mobile industry patterns; owner reviews the built UI at the end rather than answering more questions.
- Phone first screen = verdict + compact ranked list (name, rank badge, one-line reason); details expand in place.
- "Your shelf" becomes a collapsible filter (sheet/drawer) on phones, not a full-height block above the ranking.
- Laptop ≥1024px: no visual change (screenshot-diff before/after).

## Industry patterns to apply (research basis)
- Answer-first / inverted pyramid: verdict and ranked list above the fold (Wirecutter, RTINGS mobile "our pick" summaries).
- Progressive disclosure: accordion rows / `<details>` instead of full cards (NN/g: accordions suit mobile for long content).
- Sticky compact affordances: small sticky sub-nav or "Filter" pill, not sticky large panels.
- Bottom sheets for filters (Material 3, iOS sheets); tap targets ≥44–48px (Apple HIG / Material).
- Avoid horizontal scrolling tables on phones — render glance data as list rows.

## Tickets
- 01 — Fix dotted die-cut overflow on mobile/tablet
- 02 — Phone layout for game expansion pages (compact ranked list, collapsible shelf)
- 03 — Tablet layout + phone pass on remaining page types (home, detail, compare, publishers, prose)
