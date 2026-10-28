/**
 * Minimal scene manager.
 * Scenes are created by factories (registered in main.js) so scenes never
 * need to import each other and there are no circular dependencies.
 * Scene lifecycle: enter(params) -> update(dt) -> draw(renderer), exit() on leave.
 */
export class SceneManager {
  constructor(game, factories) {
    this.game = game;
    this.factories = factories;
    this.current = null;
    this.currentName = '';
  }

  switchTo(name, params) {
    if (this.current && this.current.exit) this.current.exit();
    const factory = this.factories[name];
    if (!factory) throw new Error(`Unknown scene: ${name}`);
    this.currentName = name;
    this.current = factory();
    if (this.current.enter) this.current.enter(params);
  }

  update(dt) {
    if (this.current && this.current.update) this.current.update(dt);
  }

  draw(renderer) {
    if (this.current && this.current.draw) this.current.draw(renderer);
  }
}
