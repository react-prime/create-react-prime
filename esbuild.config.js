/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json');

require('esbuild').build({
  entryPoints: ['core/main.ts'],
  platform: 'node',
  bundle: true,
  outfile: 'dist/main.js',
  define: {
    'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
    'process.env.NAME': JSON.stringify(process.env.npm_package_name),
  },
  banner: '#!/usr/bin/env node',
  external: Object.keys(pkg.dependencies),
})
  .catch(() => process.exit(1));
