import './style.css';
import { Game } from './core/Game.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WorldScene } from './scenes/WorldScene.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

game.start(
  {
    boot: () => new BootScene(game),
    title: () => new TitleScene(game),
    world: () => new WorldScene(game),
  },
  'boot'
);

// Debug/QA handle: lets headless tests (and you, from DevTools) poke at the game.
window.game = game;
