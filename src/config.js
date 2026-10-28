// ---------------------------------------------------------------------------
// The Coffee Killer — global configuration & tuning knobs
// Every magic number the game uses lives here so we can tune comedy pacing
// without hunting through modules.
// ---------------------------------------------------------------------------

/** Internal render resolution (upscaled by CSS with image-rendering: pixelated). */
export const VIEW = { W: 320, H: 180 };

/** Tile size in pixels. All our art is authored at 16x16. */
export const TILE = 16;

/** Player tuning (pixels per second). */
export const PLAYER = {
  SPEED: 64, // base walk speed
  HITBOX_W: 12,
  HITBOX_H: 11,
  SPRITE_OFF_X: -2, // sprite is 16px wide, hitbox 12px -> center it
  SPRITE_OFF_Y: -5, // show head/shoulders above the feet hitbox
  ANIM_FRAME_TIME: 0.12, // seconds per walk frame
};

/**
 * The Coffee System — the heart of the game.
 * Caffeine drains constantly; while it lasts you are buffed, once it hits
 * zero the dreaded "decaf crash" makes everything worse. Pickups (next
 * milestone) will refill it.
 */
export const COFFEE = {
  MAX: 100,
  START: 100,
  DECAY_PER_SEC: 3, // baseline drain; TODO: scale with sprinting / panic
  WARN_AT: 25, // below this the HUD starts screaming
  BUFF_SPEED: 1.25, // "wired" multiplier while caffeine > 0
  CRASH_SPEED: 0.7, // "decaf slowdown" while crashed
};

/** Keyboard bindings (e.code values). */
export const CONTROLS = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  confirm: ['Enter', 'Space'],
  interact: ['KeyE'], // reserved for talking to NPCs / drinking coffee
  dash: ['ShiftLeft', 'ShiftRight'], // reserved for the espresso dash
};

/** Asset manifest: key -> public/ path. Loaded once by BootScene. */
export const ASSETS = {
  tiles: 'assets/tiles.png',
  player: 'assets/player.png',
  zombie: 'assets/zombie.png',
  coffee: 'assets/coffee.png',
};

/**
 * Tile ids — index into the tiles.png strip (left to right).
 * Keep in sync with scripts/generate_assets.py (TILE_ORDER).
 */
export const TILES = {
  GRASS: 0,
  FLOWERS: 1,
  ROAD: 2,
  WALL: 3,
  ROOF: 4,
  DOOR: 5,
  TREE: 6,
  WATER: 7,
  FENCE: 8,
  SACK: 9, // burlap sack of coffee beans. Do not lose the beans.
  VOID: 10,
};

/** Map legend: character used in level files -> tile id. */
export const LEGEND = {
  '.': TILES.GRASS,
  f: TILES.FLOWERS,
  '-': TILES.ROAD,
  '#': TILES.WALL,
  R: TILES.ROOF,
  D: TILES.DOOR,
  T: TILES.TREE,
  '~': TILES.WATER,
  '=': TILES.FENCE,
  S: TILES.SACK,
};

/** Tiles the player cannot walk through. */
export const SOLID = new Set([
  TILES.WALL,
  TILES.ROOF,
  TILES.DOOR,
  TILES.TREE,
  TILES.WATER,
  TILES.FENCE,
  TILES.SACK,
]);

/** Sprite sheet frame indices (player.png: 8 frames of 16x16, one row). */
export const PLAYER_FRAMES = {
  down: 0, // frames [0,1] = down walk
  up: 2, // frames [2,3] = up walk
  right: 4, // frames [4,5] = right walk
  left: 6, // frames [6,7] = left walk
};

/** Palette shared by HUD / debug overlays. */
export const COLORS = {
  NIGHT: '#101018',
  PAPER: '#f2d16b',
  FADED: '#9aa4b0',
  DANGER: '#e05a4e',
  GOOD: '#4a9e4a',
  WARN: '#d8b23a',
  INK: '#20160f',
};
