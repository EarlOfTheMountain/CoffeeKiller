import { VIEW } from '../config.js';
import { level01 } from '../world/levels/level01.js';
import { Tilemap } from '../world/Tilemap.js';
import { Player } from '../entities/Player.js';
import { Camera } from '../core/Camera.js';
import { CoffeeSystem } from '../systems/CoffeeSystem.js';
import { Hud } from '../ui/Hud.js';

/**
 * The walking demo: one map, one player, one draining caffeine meter.
 * Zombies invade in v0.2 — for now the streets are only haunted by irony.
 */
export class WorldScene {
  constructor(game) {
    this.game = game;
  }

  enter() {
    this.map = new Tilemap(level01);
    this.player = new Player(this.map.spawn.x, this.map.spawn.y);
    this.camera = new Camera(VIEW.W, VIEW.H);
    this.coffee = new CoffeeSystem();
    this.hud = new Hud(this.coffee, this.game.assets, true);

    this.tilesImg = this.game.assets.image('tiles');
    this.playerImg = this.game.assets.image('player');

    this.camera.snap(this.player, this.map.pixelW, this.map.pixelH);
  }

  update(dt) {
    this.coffee.update(dt);
    this.player.update(dt, this.game.input, this.map, this.coffee.speedMultiplier);
    this.camera.follow(this.player, this.map.pixelW, this.map.pixelH);
    this.hud.update(dt);
  }

  draw(r) {
    r.clear('#1a1f16');

    const cam = this.camera.rounded;
    r.ctx.save();
    r.ctx.translate(-cam.x, -cam.y);
    this.map.draw(r, this.tilesImg, cam.x, cam.y);
    this.player.draw(r, this.playerImg, cam.x, cam.y);
    r.ctx.restore();

    this.hud.draw(r);
  }
}
