import { defineConfig } from 'vite';
import * as glob from 'glob';
import path from 'path';
import fs from 'fs';
import autoprefixer from 'autoprefixer';

// 1. Collect JS and SCSS entry files
const jsFiles = glob.sync('./src/js/**/*.js');

const scssFiles = glob
    .sync('./src/scss/**/*.scss', { ignore: '**/_*.scss' })
    .filter((file) => fs.statSync(file).size > 0);

// 2. Custom plugin to flatten /src/sections/** to /sections/
function flattenLiquidFolder(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    function walk(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.liquid') && !file.includes('_')) {
                const relativeDir = path.relative(src, dir);
                const prefix = relativeDir ? relativeDir.replace(/[\\/]/g, '-') + '-' : '';
                const newName = prefix + file;
                const destPath = path.join(dest, newName);
                fs.copyFileSync(fullPath, destPath);
                console.log(`✅ Flatten ${relativeDir}/${file} → ${newName}`);
            }
        });
    }

    walk(src);
}

function watchAndFlattenLiquid() {
    const sectionSrc = path.resolve(__dirname, 'src/sections');
    const snippetSrc = path.resolve(__dirname, 'src/snippets');
    const sectionDest = path.resolve(__dirname, 'sections');
    const snippetDest = path.resolve(__dirname, 'snippets');

    return {
        name: 'watch-and-flatten-liquid',
        buildStart() {            
            flattenLiquidFolder(sectionSrc, sectionDest);
            flattenLiquidFolder(snippetSrc, snippetDest);
        },
        closeBundle() {            
            flattenLiquidFolder(sectionSrc, sectionDest);
            flattenLiquidFolder(snippetSrc, snippetDest);
        },
        configureServer(server) {
            server.watcher.add([
                path.join(sectionSrc, '**/*.liquid'),
                path.join(snippetSrc, '**/*.liquid'),
            ]);

            server.watcher.on('change', (file) => {
                if (file.endsWith('.liquid')) {
                    console.log(`🔄 Detected change in: ${file}`);
                    if (file.includes('/sections/')) {
                        flattenLiquidFolder(sectionSrc, sectionDest);
                    } else if (file.includes('/snippets/')) {
                        flattenLiquidFolder(snippetSrc, snippetDest);
                    }
                }
            });
        },
    };
}

// 3. Export Vite config
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
                autoprefixer(),
                require('postcss-sort-media-queries')({
                    sort: 'mobile-first',
                }),
            ],
        },
    },
    plugins: [
        watchAndFlattenLiquid()
    ],
});
