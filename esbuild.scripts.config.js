// Compile scripts
require('esbuild').buildSync({
  entryPoints: [
    'scripts/main.ts',
  ],
  platform: 'node',
  outfile: 'scripts/index.js',
  bundle: true,
  format: 'cjs',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
