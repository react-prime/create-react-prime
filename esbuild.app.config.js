const fs = require('fs');
const esbuild = require('esbuild');

const pkg = require('./package.json');
const scripts = require('./core/scripts');


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
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    target: 'es2018',
    treeShaking: true,
    external: Object.keys(pkg.dependencies),
  })
    .catch(() => process.exit(1));

  fs.copyFileSync('core/generated/build.json', 'dist/build.json');
}

build();
