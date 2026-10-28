import { COFFEE, COLORS, VIEW } from '../config.js';

const HINT_TIME = 6; // seconds the movement hint stays on screen

/**
 * Heads-up display: caffeine meter + panic messaging.
 * Pure draw code — it reads the CoffeeSystem, it never mutates it.
 */
export class Hud {
  constructor(coffeeSystem, assets, showHint = false) {
    this.coffee = coffeeSystem;
    this.cupImg = assets.image('coffee');
    this.t = 0;
    this.hintT = showHint ? HINT_TIME : 0;
  }

  update(dt) {
    this.t += dt;
    if (this.hintT > 0) this.hintT -= dt;
  }

  /** @param {import('../core/Renderer.js').Renderer} r */
  draw(r) {
    const pct = this.coffee.caffeine / COFFEE.MAX;

    // Caffeine meter: cup icon + bar, green -> amber -> red as hope fades.
    r.image(this.cupImg, 0, 0, 16, 16, 6, 4);
    r.rect(25, 7, 52, 8, COLORS.INK);
    const fillW = Math.round(50 * pct);
    const fillCol =
      pct > 0.5 ? COLORS.GOOD : pct > COFFEE.WARN_AT / COFFEE.MAX ? COLORS.WARN : COLORS.DANGER;
    if (fillW > 0) r.rect(26, 8, fillW, 6, fillCol);

    if (Math.floor(this.t * 3) % 2 === 0) {
      if (this.coffee.isCrashed) {
        r.text('so... sleepy...', 84, 7, { color: COLORS.FADED });
      } else if (this.coffee.isLow) {
        r.text('DECAF ALERT!', 84, 7, { color: COLORS.DANGER });
      }
    }

    if (this.hintT > 0) {
      r.text('WASD / ARROWS to move', VIEW.W / 2, 164, {
        align: 'center',
        color: '#cfd6c0',
      });
    }
  }
}
