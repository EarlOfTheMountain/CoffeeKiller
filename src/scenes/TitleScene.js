import { COLORS, VIEW } from '../config.js';

/**
 * Title screen: the cast lineup (hero, magic bean juice, customer base),
 * the pitch, and one blinking call to action.
 */
export class TitleScene {
  constructor(game) {
    this.game = game;
    this.t = 0;
  }

  enter() {
    this.t = 0;
  }

  update(dt) {
    this.t += dt;
    if (this.game.input.pressed('confirm')) {
      this.game.scenes.switchTo('world');
    }
  }

  draw(r) {
    r.clear(COLORS.NIGHT);

    // Deterministic starfield (the apocalypse happened under the same stars).
    for (let i = 0; i < 42; i++) {
      r.rect((i * 97) % VIEW.W, (i * 61) % 150, 1, 1, '#3a4252');
    }

    r.text('THE COFFEE KILLER', VIEW.W / 2, 30, { size: 20, align: 'center', color: COLORS.PAPER });
    r.text('survive the apocalypse. stay caffeinated.', VIEW.W / 2, 58, {
      align: 'center',
      color: COLORS.FADED,
    });

    // Cast lineup, scaled 2x: hero, coffee (the real protagonist), zombie.
    const cast = this.game.assets;
    const bob = Math.round(Math.sin(this.t * 3) * 2);
    r.image(cast.image('player'), 0, 0, 16, 16, 118, 82 + bob, 32, 32);
    r.image(cast.image('coffee'), 0, 0, 16, 16, 152, 86 - bob, 32, 32);
    r.image(cast.image('zombie'), 0, 0, 16, 16, 186, 82 + bob, 32, 32);

    if (Math.floor(this.t * 2) % 2 === 0) {
      r.text('PRESS ENTER TO CLOCK IN', VIEW.W / 2, 130, { align: 'center', color: '#e8e8e8' });
    }

    r.text('v0.1 - the walking demo', VIEW.W / 2, 164, { align: 'center', color: '#5a6472' });
  }
}
