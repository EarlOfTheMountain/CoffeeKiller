/**
 * Headless smoke test — runs the pure-logic modules in Node (no browser):
 *   1. level01 parses cleanly and the spawn point is not inside a wall
 *   2. 2000 random moves through moveAndCollide() never clip into a solid tile
 *
 * Run: npm run smoke
 */
import { TILE } from '../src/config.js';
import { level01 } from '../src/world/levels/level01.js';
import { Tilemap } from '../src/world/Tilemap.js';
import { moveAndCollide } from '../src/systems/Physics.js';

const map = new Tilemap(level01);
console.log(`level "${map.name}" parsed: ${map.w}x${map.h} tiles`);

const stx = Math.floor(map.spawn.x / TILE);
const sty = Math.floor(map.spawn.y / TILE);
if (map.isSolid(stx, sty)) {
  throw new Error(`spawn tile (${stx},${sty}) is solid — pick a walkable tile!`);
}
console.log(`spawn (${stx},${sty}) is walkable`);

const ent = { x: map.spawn.x, y: map.spawn.y, w: 12, h: 11 };
let seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

for (let i = 0; i < 2000; i++) {
  moveAndCollide(ent, (rnd() * 2 - 1) * 2, (rnd() * 2 - 1) * 2, map);

  const x0 = Math.floor(ent.x / TILE);
  const x1 = Math.floor((ent.x + ent.w - 1) / TILE);
  const y0 = Math.floor(ent.y / TILE);
  const y1 = Math.floor((ent.y + ent.h - 1) / TILE);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (map.isSolid(tx, ty)) {
        throw new Error(`entity clipped into solid tile (${tx},${ty}) after ${i} moves`);
      }
    }
  }
}
console.log('2000 random moves: zero tile clipping. Physics looks solid.');

// quick sanity on the coffee system too
const { CoffeeSystem } = await import('../src/systems/CoffeeSystem.js');
const coffee = new CoffeeSystem();
for (let i = 0; i < 60 * 40; i++) coffee.update(1 / 60); // 40 seconds
if (!coffee.isCrashed) throw new Error('coffee should be empty after 40s of decay');
if (coffee.speedMultiplier !== 0.7) throw new Error('crash multiplier wrong');
console.log('coffee decays to a proper decaf crash. Comedy is intact.');

console.log('\nSMOKE OK');
