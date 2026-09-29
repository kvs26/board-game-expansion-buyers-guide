# 04 — Owner review of draft verdicts

Status: closed (agent audit pass 2026-09-27; owner reviews via the live UI instead)
Labels: ready-for-human

Audit pass 2026-09-27: every batch re-fact-checked, weak spots re-sourced, 118/124 rated,
74 verified Amazon links. Details in each `docs/research/2026-09-27-batch*.md` "Audit pass" section.
Remaining unrated: Legend of the Sea Robbers, Root Squires & Disciples, King of Tokyo Baby Gigazaur,
Small World 6-Player Board / Lost Tribes' Crusade, Viticulture Rhine Valley (no real reviews found).
Unconfirmed: 7 Wonders Leaders ASIN (listing says 1st ed, left unlinked).

## What
All 85 verdicts / buy orders / "what it fixes" lines are agent drafts built from cited reviews
(see `docs/research/2026-09-27-batch*.md` and each row's `verdict_sources`). Before launch the
owner reads them per game, edits the research CSVs where they disagree, and reruns
`python3 raw-source/build_catalog.py`.

Weakest spots flagged by research: Dominion (single IGN source), Wingspan/Terraforming Mars
(single ranking article each), Ticket to Ride (map ranking, not buy order), 7 Wonders
(expansion ASINs unverified), King of Tokyo (search snippets only).
