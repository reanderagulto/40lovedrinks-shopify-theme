import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../assets',
    emptyOutDir: false,
    assetsDir: '',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
        global: resolve(__dirname, 'src/css/global.css')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
});
