import { defineConfig } from 'vite';
import * as glob from 'glob';
import path from 'path';
import fs from 'fs';
import autoprefixer from 'autoprefixer';

const jsFiles = glob.sync('./src/js/**/*.js');
const scssFiles = glob
    .sync(`./src/scss/**/*.scss`, { ignore: '**/_*.scss' })
    .filter((file) => fs.statSync(file).size > 0);

export default defineConfig({
    root: 'src',
    build: {
        outDir: path.resolve(__dirname, 'assets'),
        emptyOutDir: false,
        rollupOptions: {
            input: [
                ...jsFiles.map((file) => path.resolve(file)),
                ...scssFiles.map((file) => path.resolve(file)),
            ],
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: ({ name }) => {
                    if (name && name.endsWith('.css')) {
                        return '[name].css';
                    }
                    return '[name].[ext]';
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/*'),
        },
    },
    css: {
        postcss: {
            plugins: [
                require('postcss-url')({
                    url: 'inline',
                    fallback: 'copy',
                    assetsPath: path.resolve(__dirname, 'assets'),
                }),
                require('postcss-nested')(),
                    autoprefixer(), // Added autoprefixer here
                    require('postcss-sort-media-queries')({
                    sort: 'mobile-first'
                }),
            ],
        },
    },
});
