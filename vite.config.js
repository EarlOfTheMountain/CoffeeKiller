import { defineConfig } from 'vite';

// base './' keeps the built game portable: dist/ runs from any subpath,
// a USB stick, or even file:// on your Debian box.
export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
