/**
 * Loads images from the ASSETS manifest once at boot and hands them out.
 * Keys are plain strings; nothing in the game touches DOM URLs directly.
 */
export class AssetLoader {
  constructor() {
    /** @private */ this.images = new Map();
  }

  /** @param {Record<string, string>} manifest key -> url */
  load(manifest) {
    return Promise.all(Object.entries(manifest).map(([key, url]) => this.loadImage(key, url)));
  }

  loadImage(key, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load asset: ${url}`));
      img.src = url;
    });
  }

  image(key) {
    const img = this.images.get(key);
    if (!img) throw new Error(`Unknown asset: ${key} (did BootScene finish?)`);
    return img;
  }
}
