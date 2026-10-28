import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { AssetLoader } from './AssetLoader.js';
import { SceneManager } from './SceneManager.js';

const FIXED_STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.25; // clamp tab-switch spikes so physics never explodes

/**
 * Owns the fixed-timestep game loop and the shared services
 * (renderer / input / assets / scenes). Scenes get `game` injected and can
 * reach everything through it.
 */
export class Game {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.assets = new AssetLoader();
    this.scenes = null; // set in start()
  }

  /**
   * @param {Record<string, () => object>} sceneFactories name -> factory
   * @param {string} firstScene
   * @param {object} [params] passed to the first scene's enter()
   */
  start(sceneFactories, firstScene, params) {
    this.scenes = new SceneManager(this, sceneFactories);
    this.scenes.switchTo(firstScene, params);

    let last = performance.now();
    let acc = 0;

    const loop = (t) => {
      acc += Math.min((t - last) / 1000, MAX_FRAME_DELTA);
      last = t;

      // Deterministic simulation: N fixed updates, then one render.
      while (acc >= FIXED_STEP) {
        this.scenes.update(FIXED_STEP);
        this.input.endFrame();
        acc -= FIXED_STEP;
      }

      this.scenes.draw(this.renderer);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
