import { ASSETS, COLORS, VIEW } from '../config.js';

/**
 * Loads every asset in the manifest, then hands over to the title screen.
 * Shows a brewing pun while loading and a clear error if an asset is missing.
 */
export class BootScene {
  constructor(game) {
    this.game = game;
    this.error = null;
  }

  enter() {
    this.game.assets
      .load(ASSETS)
      .then(() => this.game.scenes.switchTo('title'))
      .catch((err) => {
        console.error(err);
        this.error = `${err.message}`;
      });
  }

  update() {
    /* loading is promise-driven; nothing to simulate */
  }

  draw(r) {
    r.clear(COLORS.NIGHT);
    if (this.error) {
      r.text('BREW FAILED', VIEW.W / 2, 76, { size: 12, align: 'center', color: COLORS.DANGER });
      r.text(this.error, VIEW.W / 2, 94, { align: 'center', color: COLORS.FADED });
    } else {
      r.text('Brewing assets...', VIEW.W / 2, 84, { align: 'center', color: '#d8c9a3' });
    }
  }
}
