import { TILE, LEGEND, SOLID } from '../config.js';

/**
 * Tile-based world: parses a level file (array of strings + spawn point),
 * answers collision queries and draws the visible slice of the map.
 *
 * Levels are ASCII art — easy to design by hand, easy to diff in git.
 * The constructor validates everything loudly so a typo in a level file
 * fails at load, not three screens in.
 */
export class Tilemap {
  /** @param {{name:string, spawn:{x:number,y:number}, map:string[]}} level */
  constructor(level) {
    this.name = level.name;
    this.rows = level.map;
    this.h = this.rows.length;
    this.w = this.rows[0].length;

    this.grid = this.rows.map((row, y) => {
      if (row.length !== this.w) {
        throw new Error(
          `[${level.name}] row ${y} is ${row.length} chars, expected ${this.w}: "${row}"`
        );
      }
      return [...row].map((ch) => {
        const tile = LEGEND[ch];
        if (tile === undefined) throw new Error(`[${level.name}] unknown tile char '${ch}'`);
        return tile;
      });
    });

    this.spawn = { x: level.spawn.x * TILE, y: level.spawn.y * TILE };
    this.pixelW = this.w * TILE;
    this.pixelH = this.h * TILE;
  }

  isSolid(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return true; // the void is solid
    return SOLID.has(this.grid[ty][tx]);
  }

  /** Draw the visible window of tiles; sheet is the tiles.png strip. */
  draw(renderer, sheet, camX, camY) {
    const tx0 = Math.max(0, Math.floor(camX / TILE));
    const ty0 = Math.max(0, Math.floor(camY / TILE));
    const tx1 = Math.min(this.w - 1, Math.floor((camX + renderer.W) / TILE));
    const ty1 = Math.min(this.h - 1, Math.floor((camY + renderer.H) / TILE));

    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        const id = this.grid[ty][tx];
        renderer.image(sheet, id * TILE, 0, TILE, TILE, tx * TILE, ty * TILE);
      }
    }
  }
}
