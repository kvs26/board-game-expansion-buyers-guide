# 01 — Match query wording and add unique hub content

Status: ready-for-agent
Site: sites/board-game-expansion-buyers-guide

## Why
Search Console (3 months, site ~3 weeks old): 1.08K impressions, 12 clicks, avg position 18.1.
"dune imperium expansions" ranks page 1 (niche, low competition). "catan expansions" ranks page ~8
(head term, ~50k bucket, dominated by catan.com / Wikipedia / BGG / Amazon). The domain is not the
cause; age, low authority and templated thin pages are. Spirit Island has 70 impressions, 0 clicks.

## Scope

1. **Title/H1/meta rewrite to match real query wording.** Hub titles currently "Which {Game} expansion
   should I buy next?". People search "{game} expansions", "best {game} expansion", "{game} expansions
   ranked", "which {game} expansion first". Proposed hub title: "{Game} Expansions Ranked: Which to Buy
   First (2026)"; put "best" in the meta description. Keep the first 20 chars of rule/listNote free of
   apostrophes (pages.test.mjs gotcha). Files: `src/lib/seo.mjs`, hub `src/pages/[game]/expansions/index.astro`.
2. **Unique editorial block per hub (150-300 words).** Why the top pick wins, who should skip what,
   player-count/edition caveats. Do games with impressions first: Catan, Spirit Island, Wingspan,
   Ticket to Ride, Dune Imperium, Small World. Add as a data field per game, not hardcoded in templates.
3. **Ranked HTML table on hubs** (rank, expansion, adds, needs, price/link) and `dateModified` in JSON-LD
   alongside the visible "Last checked" date, to improve snippet/AI Overview eligibility.

## Acceptance
- Hub title/H1/meta use the new patterns on all ~100 hubs; tests pass.
- Editorial block present for the six priority games; no two blocks share boilerplate sentences.
- Table + `dateModified` render and validate in Rich Results/Schema validator.
- After deploy: request indexing in Search Console for the six priority hubs.

## Out of scope
Winning the head term "catan expansions" directly; that needs backlinks (see distribution, tracked separately by owner).

## Comments
