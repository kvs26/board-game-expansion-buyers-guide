"""Generate 15 more 1000x1500 Pinterest pins (batch 2). Run: python make_pins_batch2.py
Reuses the look of make_pins.py. Output: pinterest-images/batch2/pin-NN-<slug>.png
"""
from pathlib import Path
from PIL import ImageDraw  # noqa: F401  (kept for clarity)

import make_pins as m
from make_pins import W, H, INK, INK_SOFT, FACE, GOLD, GREEN, BLUE, RED, KRAFT_E, font, headline, footer, base, box, tag

OUT = Path(__file__).parent / "batch2"
OUT.mkdir(exist_ok=True)

import json, math
from PIL import Image

SITE = Path(__file__).resolve().parents[2]
LOGO = Image.open(SITE / "public" / "logo.png").convert("RGBA")
CAT = json.load(open(SITE / "src" / "data" / "catalog.json"))

# slug, name, monogram, base colour, dark colour, accent
GAMES = [
    ("wingspan", "Wingspan", "W", "#2f6db5", "#173a66", "#f6d365"),
    ("spirit-island", "Spirit Island", "SI", "#2e8b57", "#164a2d", "#f2b705"),
    ("catan", "CATAN", "C", "#c8372d", "#6e1a14", "#f2d08a"),
    ("everdell", "Everdell", "E", "#6b8e23", "#344811", "#f4c2c2"),
    ("root", "Root", "R", "#d9792b", "#6a3510", "#f3e7d0"),
    ("scythe", "Scythe", "S", "#8a8f98", "#33373f", "#f2b705"),
    ("terraforming-mars", "Terraforming Mars", "TM", "#b5482a", "#5c2111", "#f6c9a8"),
    ("ticket-to-ride", "Ticket to Ride", "TR", "#2a9d8f", "#124a43", "#f6e27a"),
    ("carcassonne", "Carcassonne", "Ca", "#7a5c3a", "#3b2a17", "#e8d9a8"),
]


def hexagon(cx, cy, r, rot=30):
    return [(cx + r * math.cos(math.radians(rot + 60 * k)),
             cy + r * math.sin(math.radians(rot + 60 * k))) for k in range(6)]


def paste_logo(im, x, y, size):
    lg = LOGO.resize((size, size), Image.LANCZOS)
    im.paste(lg, (x, y), lg)


def game_data(slug):
    ex = [e for e in CAT["expansions"] if e["game"] == slug]
    ex.sort(key=lambda e: (e.get("buyOrder") or 99))
    return ex


def short(n, name):
    n = n.replace(name + ":", "").replace(name, "").replace("Expansion", "").strip(" -–:")
    return n or "Expansion"


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


def game_pin(i, slug, name, base_c, dark, accent, mono):
    im = Image.new("RGB", (W, H), dark)
    d = ImageDraw.Draw(im)
    # patterned hex backdrop in the game colour
    for row in range(-1, 9):
        for col in range(-1, 7):
            cx = col * 208 + (104 if row % 2 else 0)
            cy = row * 180
            d.polygon(hexagon(cx, cy, 120), outline=base_c, width=3)
    d.rectangle((0, 0, W, 18), fill=accent)
    # big emblem hex with monogram
    ex_, ey_ = W / 2, 400
    d.polygon(hexagon(ex_ + 10, ey_ + 12, 260), fill="#00000055" if False else dark)
    d.polygon(hexagon(ex_, ey_, 260), fill=accent)
    d.polygon(hexagon(ex_, ey_, 232), fill=base_c)
    d.polygon(hexagon(ex_, ey_, 205), outline=accent, width=5)
    d.text((ex_, ey_ - 20), mono, font=font(190 if len(mono) == 1 else 160), fill=FACE, anchor="mm")
    d.text((ex_, ey_ + 100), "EXPANSIONS", font=font(34), fill=accent, anchor="mm")
    # title
    f = font(82)
    y = 700
    for line in m.wrap(d, f"Which {name} expansion first?", f, W - 140):
        d.text((W / 2, y), line, font=f, fill=FACE, anchor="ma")
        y += 92
    # checklist card from real catalog data
    ex = game_data(slug)
    top = ex[0]
    rows = [short(e["name"], name) for e in ex[1:4]]
    cx, cy, cw = 70, y + 20, W - 140
    ch = 90 + 78 * len(rows) + 120
    d.rounded_rectangle((cx + 10, cy + 10, cx + cw + 10, cy + ch + 10), 28, fill="#00000040" if False else dark)
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), 28, fill=FACE)
    d.text((cx + 40, cy + 24), "Tick what you own", font=font(40), fill=INK)
    ry = cy + 96
    for k, r in enumerate(rows):
        on = False
        d.rounded_rectangle((cx + 40, ry, cx + 96, ry + 52), 12, outline=INK, width=5, fill=GREEN if on else FACE)
        if on:
            d.line((cx + 52, ry + 28, cx + 64, ry + 40, cx + 84, ry + 12), fill=FACE, width=7)
        label = r if len(r) < 30 else r[:28] + "..."
        d.text((cx + 120, ry + 4), label, font=font(38, False), fill=INK)
        ry += 78
    d.rounded_rectangle((cx + 30, ry + 14, cx + cw - 30, ry + 96), 20, fill=accent)
    d.text((cx + cw / 2, ry + 30), "Buy this next: " + short(top["name"], name)[:22], font=font(40), fill=INK, anchor="ma")
    # footer with site logo
    d.rounded_rectangle((0, H - 130, W, H), 0, fill=INK)
    paste_logo(im, 60, H - 122, 112)
    d.text((190, H - 98), "whichexpansion.com", font=font(52), fill=GOLD)
    d.text((W - 60, H - 90), "Free tool", font=font(40, False), fill=m.KRAFT_L, anchor="ra")
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
    paste_logo(im, W - 190, H - 122, 112)
    im.save(OUT / f"pin-{i:02d}-{slug}.png")


if __name__ == "__main__":
    n = 1
    for slug, name, mono, c, dk, ac in GAMES:
        game_pin(n, slug, name, c, dk, ac, mono)
        n += 1
    for slug, kicker, title, bullets in TIPS:
        tip_pin(n, slug, kicker, title, bullets)
        n += 1
    print("done", n - 1)
