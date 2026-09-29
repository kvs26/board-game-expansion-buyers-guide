# 02 — Remember what I own (no account)

Status: resolved
Labels: ready-for-agent
PRD: user story 13

## What
Owned list + group inputs persist per game in `localStorage` and in the URL
(`?own=slug,slug&p=4&style=casual`). URL wins when present so shared links show the sender's view.
Serialize/parse helpers live in `guide.mjs` and are unit-tested.

## Acceptance
- Reloading keeps the owned marks.
- Copy-link button produces a URL that reproduces the filtered view.
- Unknown slugs in the URL are ignored.
