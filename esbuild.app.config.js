const fs = require('fs');
const { fork } = require('child_process');
const esbuild = require('esbuild');

const pkg = require('./package.json');
const scripts = require('./core/scripts');


const DEV = process.env.NODE_ENV !== 'production';

// Fork process to start/kill app with
let nodeFork;

function onBuildComplete() {
  if (DEV) {
    // Run app with node
    nodeFork?.kill();
    nodeFork = fork('dist/main.js');
  }

  // Copy generated files
  fs.copyFileSync('core/generated/build.json', 'dist/build.json');
}

async function build() {
  // Run all scripts
  scripts.run();

  // Bundle CRP app
  await esbuild.build({
    entryPoints: [
      'core/main.ts',
    ],
    platform: 'node',
    bundle: true,
    outfile: 'dist/main.js',
    define: {
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
      'process.env.NAME': JSON.stringify(process.env.npm_package_name),
      '__TEST__': process.env.NODE_ENV === 'test',
      '__PROD__': process.env.NODE_ENV == null || process.env.NODE_ENV === 'production',
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    target: 'node14',
    external: Object.keys(pkg.dependencies),
    watch: DEV && {
      onRebuild(err) {
        if (err) {
          console.error('⚡️ ERR: Watch build failed:', err);
          process.exit(1);
        }

        console.info('⚡️ Rebuild complete!\n');
        onBuildComplete();
      },
    },
  })
    .catch(() => process.exit(1));

  console.info('⚡️ Build complete!\n');
  onBuildComplete();
}

build();
