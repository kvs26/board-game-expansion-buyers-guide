# whichexpansion.com social style kit

Three styles, one per season. Each style has a hero (pin and carousel cover) and an info slide. Machine-readable version: `kit.json`.

## Which style for which post

| Style | Post type | Hook |
|---|---|---|
| A2 Box Lid Versus | X vs Y expansion | Two-card stat duel |
| O Scratch Card | Is it worth it, buy-or-skip verdict | Scratch to reveal |
| I2 Airmail Stamps | What to buy next, beginner path | Collect the stamps in order |

## Rotation

- Mix the three styles within a batch (one style per pin or carousel, never mixed inside one carousel). Vary layouts: big headline, stamp list, scratch card, rows.
- Never mix styles in one carousel or one board.
- If a post type has no fresh content, move to the next style early.

## Constants across all styles

- Meeple glyph, recolored per style.
- `whichexpansion.com` on every info slide.
- Sizes: Pinterest 1000x1500, Instagram 1080x1440.
- Every claim on a slide is fact-checked against a source before posting.

## File shape (format the skill uses)

```
style-kit/
  kit.json        palette, fonts, use_for, hook, AI-prompt style, rotation per style
  README.md       this file
  samples/        hero + info PNG per style
  directions/src/ generators for every direction tried (rounds 1-4), kept for reference
```

Rejected directions (N2, Q, B, C, D, D2, E, F, G, H, J, K, L, M, P) live in `directions/src/`. Their rendered sheets are in `../batches/00` to `03`.
