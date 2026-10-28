#!/usr/bin/env python3
"""
The Coffee Killer — placeholder pixel-art generator.

Generates every PNG the game needs into public/assets/ so the repo stays
self-contained (no binary blobs in git history while we iterate):

    tiles.png    11 tiles, 16x16 each, one horizontal strip (see TILE_ORDER)
    player.png    8 frames 16x16: down x2, up x2, right x2, left x2
    zombie.png    6 frames 16x16: down x2, right x2, left x2
    coffee.png    16x16 steaming cup (pickup / HUD icon)
    favicon.png   the cup, because even browsers need caffeine

Edit the pixel maps / palettes below and re-run `npm run assets`.
Deterministic: seeded RNG, same output every run.
"""

import os
import random

from PIL import Image

TILE = 16
OUT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'public', 'assets'))
RNG = random.Random(42)

TRANSPARENT = (0, 0, 0, 0)


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------

def new_img(w=TILE, h=TILE):
    return Image.new('RGBA', (w, h), TRANSPARENT)


def from_map(rows, palette):
    """Render a character map into an image. '.' = transparent."""
    assert all(len(r) == TILE for r in rows), [len(r) for r in rows]
    assert len(rows) == TILE, f"expected {TILE} rows, got {len(rows)}"
    img = new_img()
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch != '.':
                px[x, y] = palette[ch]
    return img


def mirror(img):
    return img.transpose(Image.FLIP_LEFT_RIGHT)


def speckle(img, color, count):
    """Scatter `count` single pixels of `color` (grass detail, road grit...)."""
    px = img.load()
    for _ in range(count):
        px[RNG.randrange(TILE), RNG.randrange(TILE)] = color


def grass_base():
    img = new_img()
    speckle(img, (74, 143, 63, 255), TILE * TILE)  # fill
    px = img.load()
    for y in range(TILE):
        for x in range(TILE):
            px[x, y] = (74, 143, 63, 255)
    speckle(img, (63, 124, 54, 255), 14)
    speckle(img, (90, 160, 78, 255), 8)
    return img


# --------------------------------------------------------------------------
# tiles (TILE_ORDER matches TILES in src/config.js)
# --------------------------------------------------------------------------

GRASS_DARK = (63, 124, 54, 255)
GRASS = (74, 143, 63, 255)
GRASS_LIGHT = (90, 160, 78, 255)


def tile_grass():
    return grass_base()


def tile_flowers():
    img = grass_base()
    px = img.load()
    flowers = [(3, 4, (240, 240, 230)), (10, 3, (240, 240, 230)), (6, 11, (230, 180, 60)), (12, 10, (200, 70, 70))]
    for fx, fy, col in flowers:
        px[fx, fy] = (*col, 255)
        px[fx + 1, fy] = (*col, 255)
        px[fx, fy + 1] = (*col, 255)
        px[fx + 1, fy + 1] = (230, 180, 60, 255)
    return img


def tile_road():
    img = new_img()
    px = img.load()
    for y in range(TILE):
        for x in range(TILE):
            px[x, y] = (184, 160, 116, 255)
    speckle(img, (166, 141, 99, 255), 12)
    speckle(img, (203, 182, 138, 255), 8)
    speckle(img, (140, 130, 110, 255), 4)
    return img


def tile_wall():
    img = new_img()
    px = img.load()
    mortar = (125, 106, 92, 255)
    brick = (156, 95, 78, 255)
    brick_hi = (172, 110, 90, 255)
    for y in range(TILE):
        band = y // 4
        for x in range(TILE):
            if y % 4 == 3:
                px[x, y] = mortar
            elif (x + (band % 2) * 3) % 6 == 0:
                px[x, y] = mortar
            elif y % 4 == 0:
                px[x, y] = brick_hi
            else:
                px[x, y] = brick
    return img


def tile_roof():
    img = new_img()
    px = img.load()
    base = (168, 68, 47, 255)
    dark = (140, 53, 36, 255)
    for y in range(TILE):
        for x in range(TILE):
            if y % 4 == 3:
                px[x, y] = dark
            elif (x + (y // 4) % 2 * 2) % 4 == 0 and y % 4 == 2:
                px[x, y] = dark
            else:
                px[x, y] = base
    return img


def tile_door():
    img = new_img()
    px = img.load()
    wall = tile_wall().load()
    for y in range(TILE):
        for x in range(TILE):
            px[x, y] = wall[x, y]
    frame = (74, 51, 32, 255)
    wood = (107, 74, 44, 255)
    wood_dark = (88, 60, 35, 255)
    for y in range(3, TILE):
        for x in range(4, 12):
            if y == 3 or y == TILE - 1 or x == 4 or x == 11:
                px[x, y] = frame
            elif x == 7:
                px[x, y] = wood_dark
            else:
                px[x, y] = wood
    px[9, 9] = (230, 190, 80, 255)  # brass handle
    return img


def tile_tree():
    img = grass_base()
    px = img.load()
    trunk = (90, 58, 34, 255)
    canopy = (47, 107, 47, 255)
    canopy_hi = (63, 138, 63, 255)
    canopy_lo = (36, 84, 36, 255)
    for y in range(10, 15):
        px[7, y] = trunk
        px[8, y] = trunk
    # chunky canopy circle, center (8,7) r=5.5
    for y in range(1, 12):
        for x in range(2, 15):
            if (x - 8) ** 2 + (y - 7) ** 2 <= 30:
                px[x, y] = canopy
    for _ in range(10):
        x, y = RNG.randrange(4, 13), RNG.randrange(2, 10)
        if (x - 8) ** 2 + (y - 7) ** 2 <= 24:
            px[x, y] = canopy_hi
    for _ in range(8):
        x, y = RNG.randrange(3, 14), RNG.randrange(4, 12)
        if (x - 8) ** 2 + (y - 7) ** 2 <= 30:
            px[x, y] = canopy_lo
    return img


def tile_water():
    img = new_img()
    px = img.load()
    for y in range(TILE):
        for x in range(TILE):
            px[x, y] = (63, 111, 168, 255)
    light = (90, 143, 200, 255)
    dark = (52, 93, 143, 255)
    for y0, x0, x1 in [(3, 1, 4), (8, 8, 11), (12, 4, 7), (5, 12, 14)]:
        for x in range(x0, x1 + 1):
            px[x, y0] = light
    speckle(img, dark, 6)
    return img


def tile_fence():
    img = grass_base()
    px = img.load()
    post = (107, 79, 44, 255)
    post_hi = (128, 96, 56, 255)
    rail = (138, 106, 63, 255)
    for y in range(2, TILE):
        for x in (2, 3, 12, 13):
            px[x, y] = post
    for x in (2, 12):
        px[x, 2] = post_hi
    for y in (5, 6, 10, 11):
        for x in range(TILE):
            px[x, y] = rail
    return img


def tile_sack():
    img = grass_base()
    px = img.load()
    burlap = (163, 128, 79, 255)
    burlap_dark = (116, 88, 51, 255)
    bean = (58, 36, 23, 255)
    # tied top
    for y in (2, 3):
        for x in range(6, 10):
            px[x, y] = burlap_dark
    # body
    for y in range(4, 15):
        for x in range(3, 13):
            edge = y == 4 or y == 14 or x == 3 or x == 12
            px[x, y] = burlap_dark if edge else burlap
    # bean emblem
    for bx, by in [(6, 8), (9, 7), (7, 11)]:
        px[bx, by] = bean
        px[bx + 1, by] = bean
    return img


def tile_void():
    img = new_img()
    px = img.load()
    for y in range(TILE):
        for x in range(TILE):
            px[x, y] = (16, 20, 24, 255)
    return img


TILE_ORDER = [
    ('grass', tile_grass),
    ('flowers', tile_flowers),
    ('road', tile_road),
    ('wall', tile_wall),
    ('roof', tile_roof),
    ('door', tile_door),
    ('tree', tile_tree),
    ('water', tile_water),
    ('fence', tile_fence),
    ('sack', tile_sack),
    ('void', tile_void),
]


# --------------------------------------------------------------------------
# characters
# --------------------------------------------------------------------------

PLAYER_PAL = {
    'c': (176, 58, 58, 255),    # barista cap
    'h': (74, 47, 27, 255),     # hair
    's': (242, 199, 154, 255),  # skin
    'e': (36, 24, 17, 255),     # eyes
    'm': (176, 122, 92, 255),   # mouth
    'w': (236, 232, 220, 255),  # shirt
    'g': (92, 61, 36, 255),     # apron
    'p': (58, 69, 104, 255),    # pants
    'b': (91, 58, 33, 255),     # shoes
    'k': (242, 240, 230, 255),  # mug
    'd': (74, 44, 23, 255),     # coffee
}

ZOMBIE_PAL = {
    'c': (63, 90, 47, 255),     # no cap for the undead, just more hair
    'h': (63, 90, 47, 255),
    's': (138, 166, 90, 255),   # sickly green skin
    'e': (176, 48, 48, 255),    # caffeinated eyes (red, ironic)
    'm': (64, 96, 48, 255),
    'w': (106, 106, 118, 255),  # torn grey shirt
    'g': (74, 74, 85, 255),
    'p': (63, 71, 86, 255),
    'b': (47, 47, 51, 255),
    'k': (176, 200, 170, 255),
    'd': (90, 60, 40, 255),
}

# facing the camera (frame 0: legs down / frame 1: left foot raised)
DOWN = [
    "................",
    "....ccccccc.....",
    "...ccccccccc....",
    "...hsssssssh....",
    "...hsesssesh....",
    "...hsssmsssh....",
    ".....ssss.......",
    "....wwwwwwww....",
    "...wwggggggww...",
    "...wwggggggww...",
    "...swggggggws...",
    "....gggggggg....",
    "....ppp..ppp....",
    "....ppp..ppp....",
    "....bbb..bbb....",
    "................",
]

DOWN2 = DOWN[:]
DOWN2[13] = "....bbb..ppp...."
DOWN2[14] = ".........bbb...."

# back of the head: all hair under the cap
UP = [
    "................",
    "....ccccccc.....",
    "...ccccccccc....",
    "...hhhhhhhhh....",
    "...hhhhhhhhh....",
    "...hhhhhhhhh....",
    ".....ssss.......",
    "....wwwwwwww....",
    "...wwggggggww...",
    "...wwggggggww...",
    "...swggggggws...",
    "....gggggggg....",
    "....ppp..ppp....",
    "....ppp..ppp....",
    "....bbb..bbb....",
    "................",
]
UP2 = UP[:]
UP2[13] = "....bbb..ppp...."
UP2[14] = ".........bbb...."

# facing right; mug held out front (also the "offering coffee" pose)
RIGHT = [
    "................",
    "....cccccc......",
    "...ccccccccc....",
    "...hssssssh.....",
    "...hssssess.....",
    "...hsssmsss.....",
    "......sss.......",
    "....wwwwww......",
    "....wwggwwdd....",
    "....wwggwwkk....",
    "....swggws......",
    "....gggggg......",
    ".....pppp.......",
    ".....pppp.......",
    ".....bbbb.......",
    "................",
]

RIGHT2 = RIGHT[:]
RIGHT2[12] = ".....pppp......."
RIGHT2[13] = "....ppp..pp....."
RIGHT2[14] = "....bbb...bb...."


# --------------------------------------------------------------------------
# coffee cup
# --------------------------------------------------------------------------

CUP_PAL = {
    's': (216, 216, 216, 255),  # steam
    'd': (74, 44, 23, 255),     # coffee
    'k': (242, 240, 230, 255),  # ceramic
    'K': (190, 186, 172, 255),  # handle / shadow
}

CUP = [
    "................",
    "......s.s.......",
    "....s..s........",
    "......s.s.......",
    "....ddddddd.....",
    "....kkkkkkk.....",
    "....kkkkkkk.....",
    "....kkkkkkkKK...",
    "....kkkkkkkKK...",
    "....kkkkkkk.....",
    "....kkkkkkk.....",
    "....kkkkkkk.....",
    "....kkkkkkk.....",
    "...kkkkkkkkk....",
    "................",
    "................",
]


# --------------------------------------------------------------------------
# assembly
# --------------------------------------------------------------------------

def build_sheet(frames, out_name):
    sheet = new_img(len(frames) * TILE, TILE)
    for i, fr in enumerate(frames):
        sheet.paste(fr, (i * TILE, 0))
    path = os.path.join(OUT_DIR, out_name)
    sheet.save(path)
    print(f"  {out_name:<14} {sheet.width}x{TILE}  ({len(frames)} frames)")
    return path


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print('Generating placeholder art ->', OUT_DIR)

    # tiles strip
    tiles = new_img(len(TILE_ORDER) * TILE, TILE)
    for i, (name, fn) in enumerate(TILE_ORDER):
        tiles.paste(fn(), (i * TILE, 0))
    tiles.save(os.path.join(OUT_DIR, 'tiles.png'))
    print(f"  tiles.png      {tiles.width}x{TILE}  ({len(TILE_ORDER)} tiles: {' '.join(n for n, _ in TILE_ORDER)})")

    # player: down x2, up x2, right x2, left x2  (frame order matches
    # PLAYER_FRAMES in src/config.js)
    player_frames = [
        from_map(DOWN, PLAYER_PAL),
        from_map(DOWN2, PLAYER_PAL),
        from_map(UP, PLAYER_PAL),
        from_map(UP2, PLAYER_PAL),
        from_map(RIGHT, PLAYER_PAL),
        from_map(RIGHT2, PLAYER_PAL),
        mirror(from_map(RIGHT, PLAYER_PAL)),
        mirror(from_map(RIGHT2, PLAYER_PAL)),
    ]
    build_sheet(player_frames, 'player.png')

    # zombie: same body, different priorities. down x2, right x2, left x2.
    zombie_frames = [
        from_map(DOWN, ZOMBIE_PAL),
        from_map(DOWN2, ZOMBIE_PAL),
        from_map(RIGHT, ZOMBIE_PAL),
        from_map(RIGHT2, ZOMBIE_PAL),
        mirror(from_map(RIGHT, ZOMBIE_PAL)),
        mirror(from_map(RIGHT2, ZOMBIE_PAL)),
    ]
    build_sheet(zombie_frames, 'zombie.png')

    cup = from_map(CUP, CUP_PAL)
    cup.save(os.path.join(OUT_DIR, 'coffee.png'))
    print(f"  coffee.png     {TILE}x{TILE}")
    cup.save(os.path.join(OUT_DIR, 'favicon.png'))
    print(f"  favicon.png    {TILE}x{TILE}")

    print('Done. Run `npm run dev` and enjoy the fresh brew.')


if __name__ == '__main__':
    main()
