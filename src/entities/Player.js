import { PLAYER, PLAYER_FRAMES, TILE } from '../config.js';
import { moveAndCollide } from '../systems/Physics.js';

/**
 * The hero: The Coffee Killer. Barista cap, apron, and unresolved caffeine
 * dependency. Movement is grid-colliding, 4-directional, with a 2-frame walk
 * cycle. Combat arrives in the next milestone — the mop is still in the closet.
 */
export class Player {
  constructor(x, y) {
    this.x = x; // hitbox top-left (world pixels)
    this.y = y;
    this.w = PLAYER.HITBOX_W;
    this.h = PLAYER.HITBOX_H;
    this.dir = 'down';
    this.moving = false;
    /** @private */ this.animT = 0;
    /** @private */ this.frame = 0;
  }

  /**
   * @param {number} dt fixed step
   * @param {import('../core/Input.js').Input} input
   * @param {import('../world/Tilemap.js').Tilemap} map
   * @param {number} speedMult multiplier from the coffee system (wired/crashed)
   */
  update(dt, input, map, speedMult = 1) {
    let ax = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    let ay = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    this.moving = ax !== 0 || ay !== 0;

    if (!this.moving) {
      this.frame = 0;
      this.animT = 0;
      return;
    }

    // Normalize diagonals so GC-driven panic sprints aren't 41% faster.
    if (ax !== 0 && ay !== 0) {
      ax *= Math.SQRT1_2;
      ay *= Math.SQRT1_2;
    }

    // Facing: horizontal wins when both axes are held (feels snappier).
    if (ax > 0) this.dir = 'right';
    else if (ax < 0) this.dir = 'left';
    else if (ay > 0) this.dir = 'down';
    else this.dir = 'up';

    const speed = PLAYER.SPEED * speedMult;
    moveAndCollide(this, ax * speed * dt, ay * speed * dt, map);

    this.animT += dt;
    if (this.animT >= PLAYER.ANIM_FRAME_TIME) {
      this.animT -= PLAYER.ANIM_FRAME_TIME;
      this.frame ^= 1;
    }
  }

  /** @param {import('../core/Renderer.js').Renderer} r */
  draw(r, sheet, camX, camY) {
    const base = PLAYER_FRAMES[this.dir];
    r.image(
      sheet,
      (base + this.frame) * TILE,
      0,
      TILE,
      TILE,
      this.x + PLAYER.SPRITE_OFF_X - camX,
      this.y + PLAYER.SPRITE_OFF_Y - camY
    );
  }
}
