import { COFFEE } from '../config.js';

/**
 * CoffeeSystem — the survival core of The Coffee Killer.
 *
 * Caffeine drains constantly. Above zero you are "wired" (faster). At zero
 * you "crash" (slower, sadder). This first version only models the meter and
 * its multipliers so the walking demo already feels like the game's thesis:
 * *coffee is life*.
 *
 * TODO(next: coffee pickups & buffs):
 *  - spawn coffee cups on the map; Player picks up via rectsOverlap()
 *  - drink(amount) refills the meter (already implemented below)
 *  - tiered brews: Espresso (speed x1.5, 10s), Cold Brew (attack up),
 *    Double Shot (both, then a harsher crash — comedy gold)
 *  - crash event: screen wobble, sad trombone, brief "so... sleepy..." overlay
 *  - emit events through a tiny EventBus so HUD/VFX stay decoupled
 */
export class CoffeeSystem {
  constructor() {
    this.caffeine = COFFEE.START;
  }

  update(dt) {
    this.caffeine = Math.max(0, this.caffeine - COFFEE.DECAY_PER_SEC * dt);
  }

  /** Wired to coffee pickups in the next milestone. */
  drink(amount) {
    this.caffeine = Math.min(COFFEE.MAX, this.caffeine + amount);
  }

  get speedMultiplier() {
    return this.caffeine > 0 ? COFFEE.BUFF_SPEED : COFFEE.CRASH_SPEED;
  }

  get isWired() {
    return this.caffeine > COFFEE.WARN_AT;
  }

  get isLow() {
    return this.caffeine > 0 && this.caffeine <= COFFEE.WARN_AT;
  }

  get isCrashed() {
    return this.caffeine <= 0;
  }
}
