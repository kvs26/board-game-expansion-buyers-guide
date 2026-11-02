"""Generate the OG cover with Pillow. Logo + icons come from scripts/make-icons.mjs
(run that first: this script pastes public/logo.png into the cover).
Run from the site root: python3 scripts/make-images.py
"""
from PIL import Image, ImageDraw, ImageFont

INK, GOLD, KRAFT, KRAFT_L, DEEP, FACE = '#1D2A44', '#F2B705', '#E6CFA7', '#F3E7D0', '#A8834D', '#FFFDF8'
TOKENS = ['#F2B705', '#2E8B57', '#2F6DB5', '#C8372D']
BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'


def mark(size):
    return Image.open('public/logo.png').convert('RGBA').resize((size, size), Image.LANCZOS)


def og():
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), KRAFT_L)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 16):
        for y in range(0, H, 16):
            d.ellipse([x, y, x + 2, y + 2], fill='#E3CFAA')
    d.rectangle([0, 0, W, 14], fill=INK)
    d.rectangle([0, 14, W, 20], fill=GOLD)
    # score track down the right
    for i, col in enumerate(TOKENS):
        x, y = 860, 120 + i * 118
        d.rounded_rectangle([x + 6, y + 7, x + 96, y + 97], 16, fill=DEEP)
        d.rounded_rectangle([x, y, x + 90, y + 90], 16, fill=col, outline=INK, width=5)
        f = ImageFont.truetype(BOLD, 48)
        d.text((x + 45, y + 46), str(i + 1), font=f, fill=INK if i == 0 else FACE, anchor='mm')
        d.rounded_rectangle([x + 110, y + 20, x + 300, y + 34], 7, fill=INK)
        d.rounded_rectangle([x + 110, y + 50, x + 250, y + 62], 6, fill='#C9A56E')
    im.paste(mark(120), (70, 80), mark(120))
    ft = ImageFont.truetype(BOLD, 74)
    for i, line in enumerate(['Which expansion', 'should you', 'buy next?']):
        d.text((70, 240 + i * 86), line, font=ft, fill=INK)
    d.text((72, 520), "Board Game Expansion Buyer's Guide", font=ImageFont.truetype(BOLD, 30), fill=DEEP)
    im.save('public/og-cover.png', optimize=True)


if __name__ == '__main__':
    og()
    print('ok')
