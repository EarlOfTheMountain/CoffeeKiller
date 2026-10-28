/**
 * Thin wrapper around the 2D canvas context.
 * All drawing goes through here so we keep pixel-perfect rounding in one place
 * and can swap/extend the backend later (e.g. WebGL) without touching scenes.
 */
export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.W = canvas.width;
    this.H = canvas.height;
  }

  clear(color = '#000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.W, this.H);
  }

  /**
   * Draw a sub-region of a sprite sheet.
   * dx/dy are rounded so sprites never land on half pixels.
   */
  image(img, sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
    this.ctx.drawImage(img, sx, sy, sw, sh, Math.round(dx), Math.round(dy), dw, dh);
  }

  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  /** TODO(next milestone): swap monospace for a real bitmap pixel font. */
  text(str, x, y, { size = 8, color = '#fff', align = 'left', shadow = true } = {}) {
    const c = this.ctx;
    c.font = `${size}px "Courier New", monospace`;
    c.textAlign = align;
    c.textBaseline = 'top';
    if (shadow) {
      c.fillStyle = '#000';
      c.fillText(str, x + 1, y + 1);
    }
    c.fillStyle = color;
    c.fillText(str, x, y);
  }
}
