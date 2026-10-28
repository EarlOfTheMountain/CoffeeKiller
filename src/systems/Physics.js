import { TILE } from '../config.js';

/**
 * Axis-separated AABB collision against the tile grid.
 * Move X, resolve; move Y, resolve. Classic, robust, tunnel-proof at our
 * speeds (max ~2px per fixed step, way below TILE).
 *
 * @param {{x:number,y:number,w:number,h:number}} ent entity (mutated in place)
 * @param {number} dx x displacement in pixels
 * @param {number} dy y displacement in pixels
 * @param {import('../world/Tilemap.js').Tilemap} map
 * @returns {{x:boolean,y:boolean}} which axes were blocked (useful for SFX later)
 */
export function moveAndCollide(ent, dx, dy, map) {
  const hits = { x: false, y: false };

  ent.x += dx;
  if (overlapsSolid(ent, map)) {
    hits.x = true;
    if (dx > 0) {
      // right edge entered a solid tile -> snap flush against its left side
      const tx = Math.floor((ent.x + ent.w - 1) / TILE);
      ent.x = tx * TILE - ent.w;
    } else if (dx < 0) {
      // left edge entered a solid tile -> snap flush against its right side
      const tx = Math.floor(ent.x / TILE);
      ent.x = (tx + 1) * TILE;
    }
  }

  ent.y += dy;
  if (overlapsSolid(ent, map)) {
    hits.y = true;
    if (dy > 0) {
      const ty = Math.floor((ent.y + ent.h - 1) / TILE);
      ent.y = ty * TILE - ent.h;
    } else if (dy < 0) {
      const ty = Math.floor(ent.y / TILE);
      ent.y = (ty + 1) * TILE;
    }
  }

  return hits;
}

/** True if the entity's rect overlaps any solid tile (or is outside the map). */
export function overlapsSolid(ent, map) {
  const x0 = Math.floor(ent.x / TILE);
  const x1 = Math.floor((ent.x + ent.w - 1) / TILE);
  const y0 = Math.floor(ent.y / TILE);
  const y1 = Math.floor((ent.y + ent.h - 1) / TILE);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (map.isSolid(tx, ty)) return true;
    }
  }
  return false;
}

/** Plain rect-vs-rect overlap, for future pickups / attacks / zombies. */
export function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
