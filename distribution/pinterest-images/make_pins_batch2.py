"""Generate 15 more 1000x1500 Pinterest pins (batch 2). Run: python make_pins_batch2.py
Reuses the look of make_pins.py. Output: pinterest-images/batch2/pin-NN-<slug>.png
"""
from pathlib import Path
from PIL import ImageDraw  # noqa: F401  (kept for clarity)

import make_pins as m
from make_pins import W, H, INK, INK_SOFT, FACE, GOLD, GREEN, BLUE, RED, KRAFT_E, font, headline, footer, base, box, tag

OUT = Path(__file__).parent / "batch2"
OUT.mkdir(exist_ok=True)

GAMES = [
    ("wingspan", "Wingspan", BLUE),
    ("spirit-island", "Spirit Island", GREEN),
    ("catan", "CATAN", RED),
    ("everdell", "Everdell", GREEN),
    ("root", "Root", INK_SOFT),
    ("scythe", "Scythe", RED),
    ("terraforming-mars", "Terraforming Mars", BLUE),
    ("ticket-to-ride", "Ticket to Ride", GREEN),
    ("carcassonne", "Carcassonne", INK_SOFT),
]

TIPS = [
    ("three-questions", "BEFORE YOU BUY", "3 questions to ask before buying any expansion",
     ["Does it need the base game?", "Does it need another expansion first?", "Does it fit my player count?"]),
    ("standalone-check", "CHECK THE BOX", "Expansion or standalone? Check before you check out",
     ["Some boxes play on their own", "Some need your base game", "Some need another expansion too"]),
    ("two-player", "PLAYING AT 2?", "Buying expansions for a 2-player household",
     ["Check the player count first", "See what each one adds", "Skip what you will not use"]),
    ("shelf-space", "SHELF SPACE", "Not every expansion is worth the shelf space",
     ["Get a plain-English verdict", "See what it fixes or adds", "Buy the top pick first"]),
    ("gift-owned", "GIFT TIP", "Buying a gamer an expansion? Start with what they own",
     ["Find their base game", "Tick the expansions they have", "Gift the one that is next"]),
    ("fomo", "EXPANSION FOMO?", "Do not buy blind: see what you actually need first",
     ["Pick your game", "Tick what you own", "Buy the top one"]),
]


def game_pin(i, slug, name, color):
    im, d = base()
    d.text((70, 70), f"{name.upper()} EXPANSIONS", font=font(34), fill=INK_SOFT)
    y = headline(d, f"Which {name} expansion should you buy first?", 130, 88)
    d.text((70, y + 10), "Plain English. Free.", font=font(42, False), fill=INK_SOFT)
    box(d, 330, 700, 340, 300, color, name, 44)
    steps = ["1. Pick your game", "2. Tick what you own", "3. Buy the top one"]
    sy = 1090
    for s in steps:
        d.text((W / 2, sy), s, font=font(46), fill=INK, anchor="ma")
        sy += 66
    footer(d)
    im.save(OUT / f"pin-{i:02d}-{slug}.png")


def tip_pin(i, slug, kicker, title, bullets):
    im, d = base()
    d.text((70, 70), kicker, font=font(34), fill=INK_SOFT)
    y = headline(d, title, 130, 86)
    cx, cy, cw, ch = 70, max(y + 70, 600), W - 140, 560
    d.rounded_rectangle((cx + 10, cy + 10, cx + cw + 10, cy + ch + 10), 28, fill=KRAFT_E)
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), 28, fill=FACE)
    ry = cy + 50
    for n, b in enumerate(bullets, 1):
        d.ellipse((cx + 40, ry, cx + 110, ry + 70), fill=GOLD)
        d.text((cx + 75, ry + 8), str(n), font=font(44), fill=INK, anchor="ma")
        f = font(40, False)
        ly = ry
        for line in m.wrap(d, b, f, cw - 200):
            d.text((cx + 140, ly + 6), line, font=f, fill=INK)
            ly += 48
        ry += 160
    footer(d)
    im.save(OUT / f"pin-{i:02d}-{slug}.png")


if __name__ == "__main__":
    n = 1
    for slug, name, color in GAMES:
        game_pin(n, slug, name, color)
        n += 1
    for slug, kicker, title, bullets in TIPS:
        tip_pin(n, slug, kicker, title, bullets)
        n += 1
    print("done", n - 1)
