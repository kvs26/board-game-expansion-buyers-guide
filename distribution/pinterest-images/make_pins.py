"""Generate the three 1000x1500 Pinterest pin images. Run: python make_pins.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).parent
W, H = 1000, 1500
KRAFT, KRAFT_L, KRAFT_E = "#e6cfa7", "#f3e7d0", "#c9a56e"
INK, INK_SOFT, FACE = "#1d2a44", "#46526b", "#fffdf8"
GOLD, GREEN, BLUE, RED = "#f2b705", "#2e8b57", "#2f6db5", "#c8372d"
FONT = "/System/Library/Fonts/Avenir Next.ttc"


def font(size, bold=True):
    return ImageFont.truetype(FONT, size, index=1 if bold else 7)


def wrap(d, text, f, maxw):
    lines, cur = [], ""
    for w in text.split():
        t = f"{cur} {w}".strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w
    return lines + [cur]


def headline(d, text, y, size=84, color=INK):
    f = font(size)
    for line in wrap(d, text, f, W - 140):
        d.text((70, y), line, font=f, fill=color)
        y += int(size * 1.12)
    return y


def footer(d):
    d.rounded_rectangle((0, H - 130, W, H), 0, fill=INK)
    d.text((70, H - 98), "whichexpansion.com", font=font(52), fill=GOLD)
    d.text((W - 70, H - 90), "Free tool", font=font(40, False), fill=KRAFT_L, anchor="ra")


def base():
    im = Image.new("RGB", (W, H), KRAFT)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 18), fill=GOLD)
    return im, d


def box(d, x, y, w, h, color, label, lsize=34):
    d.rounded_rectangle((x + 8, y + 8, x + w + 8, y + h + 8), 14, fill=KRAFT_E)
    d.rounded_rectangle((x, y, x + w, y + h), 14, fill=color)
    d.rectangle((x, y + h * 0.62, x + w, y + h - 14), fill=FACE)
    f = font(lsize)
    ty = y + 24
    for line in wrap(d, label, f, w - 30):
        d.text((x + w / 2, ty), line, font=f, fill=FACE, anchor="ma")
        ty += lsize + 4


def tag(d, x, y, text, color, size=30):
    f = font(size)
    tw = d.textlength(text, font=f)
    d.rounded_rectangle((x, y, x + tw + 36, y + size + 22), 30, fill=color)
    d.text((x + 18, y + 10), text, font=f, fill=FACE)


def pin1():
    im, d = base()
    d.text((70, 70), "BOARD GAME EXPANSIONS", font=font(34), fill=INK_SOFT)
    y = headline(d, "Which expansion should you buy next?", 130, 92)
    d.text((70, y + 10), "Wingspan  •  Scythe  •  Catan  •  more", font=font(40, False), fill=INK_SOFT)
    # mock checklist card
    cx, cy, cw, ch = 70, 640, W - 140, 560
    d.rounded_rectangle((cx + 10, cy + 10, cx + cw + 10, cy + ch + 10), 28, fill=KRAFT_E)
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), 28, fill=FACE)
    d.text((cx + 40, cy + 30), "What do you own?", font=font(44), fill=INK)
    rows = [("Wingspan", True), ("European Expansion", True), ("Oceania Expansion", False), ("Asia Expansion", False)]
    ry = cy + 120
    for name, on in rows:
        d.rounded_rectangle((cx + 40, ry, cx + 100, ry + 60), 12, outline=INK, width=5, fill=GREEN if on else FACE)
        if on:
            d.line((cx + 54, ry + 32, cx + 68, ry + 46, cx + 88, ry + 16), fill=FACE, width=8)
        d.text((cx + 130, ry + 6), name, font=font(42, False), fill=INK)
        ry += 85
    d.rounded_rectangle((cx + 40, ry + 15, cx + cw - 40, ry + 105), 20, fill=GOLD)
    d.text((cx + cw / 2, ry + 36), "Buy this next: Oceania", font=font(44), fill=INK, anchor="ma")
    footer(d)
    im.save(OUT / "pin-1-which-expansion-next.png")


def pin2():
    im, d = base()
    d.text((70, 70), "SHELF CHECK", font=font(34), fill=INK_SOFT)
    y = headline(d, "Before you buy another box: check your shelf first", 130, 88)
    d.text((70, y + 10), "See what each expansion needs first.", font=font(42, False), fill=INK_SOFT)
    shelf_y = [790, 1070]
    games = [
        [("Spirit Island", BLUE), ("Everdell", GREEN), ("Root", RED)],
        [("Pandemic", INK_SOFT), ("Wingspan", BLUE), ("Scythe", GREEN)],
    ]
    for sy, row in zip(shelf_y, games):
        for i, (n, c) in enumerate(row):
            box(d, 90 + i * 280, sy - 230, 250, 230, c, n, 32)
        d.rounded_rectangle((50, sy + 4, W - 50, sy + 30), 8, fill=KRAFT_deep if False else "#a8834d")
    tag(d, 90, 1135, "Needs the base game", RED)
    tag(d, 90, 1215, "Needs another expansion first", BLUE)
    tag(d, 90, 1295, "Ready to play", GREEN)
    footer(d)
    im.save(OUT / "pin-2-check-your-shelf.png")


def pin3():
    im, d = base()
    d.text((70, 70), "GIFT GUIDE", font=font(34), fill=INK_SOFT)
    y = headline(d, "The right expansion for a gamer who has everything", 130, 88)
    # gift box
    gx, gy, gw, gh = 250, 700, 500, 380
    d.rounded_rectangle((gx + 10, gy + 10, gx + gw + 10, gy + gh + 10), 16, fill=KRAFT_E)
    d.rounded_rectangle((gx, gy, gx + gw, gy + gh), 16, fill=RED)
    d.rectangle((gx + gw / 2 - 40, gy, gx + gw / 2 + 40, gy + gh), fill=GOLD)
    d.rounded_rectangle((gx - 20, gy - 70, gx + gw + 20, gy + 10), 16, fill="#a82a21")
    d.rectangle((gx + gw / 2 - 40, gy - 70, gx + gw / 2 + 40, gy + 10), fill=GOLD)
    d.ellipse((gx + gw / 2 - 110, gy - 170, gx + gw / 2 - 5, gy - 60), outline=GOLD, width=22)
    d.ellipse((gx + gw / 2 + 5, gy - 170, gx + gw / 2 + 110, gy - 60), outline=GOLD, width=22)
    f = font(46)
    steps = ["1. Pick the games they own", "2. Get the best next buy", "3. See what it needs"]
    sy = 1160
    for s in steps:
        d.text((W / 2, sy), s, font=f, fill=INK, anchor="ma")
        sy += 62
    footer(d)
    im.save(OUT / "pin-3-gift-guide.png")


if __name__ == "__main__":
    pin1()
    pin2()
    pin3()
    print("done")
