import { CONTROLS } from '../config.js';

/**
 * Keyboard input with edge detection.
 * - isDown(action): held this frame (movement)
 * - pressed(action): went down since last processed step (menus, interactions)
 */
export class Input {
  constructor(target = window) {
    /** @private */ this.down = new Set();
    /** @private */ this.pressedSet = new Set();

    const watched = new Set(Object.values(CONTROLS).flat());

    target.addEventListener('keydown', (e) => {
      if (watched.has(e.code)) e.preventDefault();
      if (!this.down.has(e.code)) this.pressedSet.add(e.code);
      this.down.add(e.code);
    });
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    // Losing focus (alt-tab on Debian, etc.) must not leave keys stuck down.
    target.addEventListener('blur', () => this.down.clear());
  }

  isDown(action) {
    return CONTROLS[action].some((code) => this.down.has(code));
  }

  pressed(action) {
    return CONTROLS[action].some((code) => this.pressedSet.has(code));
  }

  /** Called by the game loop after each fixed update; clears edge states. */
  endFrame() {
    this.pressedSet.clear();
  }
}
