import fs from 'fs';
import cp from 'child_process';
import { build } from 'esbuild';

import * as scripts from './lib/scripts/index.js';

const DEV = process.env.NODE_ENV == 'development';
const pkg = JSON.parse(fs.readFileSync('./package.json'));

let fork = null;
function onBuildComplete() {
  if (DEV) {
    // Run app with node
    fork?.kill();
    fork = cp.fork('dist/main.js', ['-d'], {
      stdio: 'inherit',
    });
  }

  // Copy generated files
  fs.copyFileSync('lib/generated/crp.json', 'dist/crp.json');
}

// Run all scripts
await scripts.run();

await build({
  entryPoints: ['src/index.ts'],
  platform: 'node',
  bundle: true,
  format: 'esm',
  outfile: 'dist/main.js',
  define: {
    'process.env.VERSION': JSON.stringify(pkg.version),
    'process.env.NAME': JSON.stringify(pkg.name),
  },
  banner: {
    js: '#!/usr/bin/env node',
  },
  target: 'node14',
  external: Object.keys(pkg.dependencies),
  watch: DEV && {
    onRebuild(err) {
      if (err) {
        console.error('⚡️ ERR: Watch build failed.', err);
        process.exit(1);
      }

      console.info('\n\n⚡️ Rebuild complete!\n');
      onBuildComplete();
    },
  },
})
  .catch(() => process.exit(1));

console.info('⚡️ Build complete!\n');
onBuildComplete();
