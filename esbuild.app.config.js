const fs = require('fs');
const pkg = require('./package.json');

// Bundle CRP app
require('esbuild').build({
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
  .then(() => {
    fs.copyFileSync('core/generated/build.json', 'dist/build.json');
  })
  .catch(() => process.exit(1));
