/**
 * Simple follow camera with map clamping.
 * Works in float space during play; scenes render using `rounded` so the
 * world never jitters between whole pixels.
 */
export class Camera {
  constructor(viewW, viewH) {
    this.x = 0;
    this.y = 0;
    this.viewW = viewW;
    this.viewH = viewH;
  }

  /** @param {{x:number,y:number,w:number,h:number}} target entity to track */
  follow(target, mapW, mapH, lerp = 0.15) {
    const { tx, ty } = this._desired(target, mapW, mapH);
    this.x += (tx - this.x) * lerp;
    this.y += (ty - this.y) * lerp;
  }

  /** Jump instantly (used on scene entry so the camera never slides). */
  snap(target, mapW, mapH) {
    const { tx, ty } = this._desired(target, mapW, mapH);
    this.x = tx;
    this.y = ty;
  }

  _desired(target, mapW, mapH) {
    let tx = target.x + target.w / 2 - this.viewW / 2;
    let ty = target.y + target.h / 2 - this.viewH / 2;
    tx = mapW > this.viewW ? Math.max(0, Math.min(tx, mapW - this.viewW)) : (mapW - this.viewW) / 2;
    ty = mapH > this.viewH ? Math.max(0, Math.min(ty, mapH - this.viewH)) : (mapH - this.viewH) / 2;
    return { tx, ty };
  }

  get rounded() {
    return { x: Math.round(this.x), y: Math.round(this.y) };
  }
}
