const esbuild = require('esbuild');

async function buildAndWatch() {
  const ctx = await esbuild.context({
    entryPoints: ['src/main.js'],
    bundle: true,
    outfile: 'public/bundle.js',
    sourcemap: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    logLevel: 'info',
  });

  await ctx.watch(); // Start watching
  console.log('👀 Watching for changes...');
}

buildAndWatch().catch((e) => {
  console.error(e);
  process.exit(1);
});
