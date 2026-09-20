import { defineConfig } from 'vite';
import { resolve } from 'path';

// Sitio estático multi-página (sin frameworks nuevos).
// Vite copia /public tal cual a la raíz del build, así que
// /.well-known/apple-app-site-association y /.well-known/assetlinks.json
// terminan en la raíz del sitio publicado.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        join: resolve(__dirname, 'join.html'),
        pay: resolve(__dirname, 'pay.html'),
      },
    },
  },
});
