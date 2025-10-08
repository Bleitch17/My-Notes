// The esbuild getting started docs say to put the build script in a file with a .mjs extension.
// Since the package.json has "type": "module" set, this file can have a .js extension.

import * as esbuild from 'esbuild';
import browserSync from 'browser-sync';
import { cpSync, watch } from 'fs';

const assetsDirPath = 'assets';
const distDirPath = 'dist';

// Copy files from assets directory to the dist directory.
cpSync(assetsDirPath, distDirPath, { recursive: true });

watch('assets', { recursive: true }, () => {
  cpSync(assetsDirPath, distDirPath, { recursive: true });
});

let ctx = await esbuild.context({
  entryPoints: ['src/main.js', 'src/index.html', 'src/styles/main.css'],
  bundle: true,
  outdir: 'dist',
  loader: { 
    '.html': 'copy',
  },
});

await ctx.watch();
console.log('watching...');

browserSync.init({
    server: 'dist',
    files: ['dist/**/*'],
    port: 3000,
    open: true,
    browser: "firefox"
});
