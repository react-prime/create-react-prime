// Compile scripts
require('esbuild').buildSync({
  entryPoints: [
    'core/scripts/main.ts',
  ],
  platform: 'node',
  outfile: 'core/scripts/index.js',
  bundle: true,
  format: 'cjs',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
