import { buildSync } from 'esbuild';

// Compile scripts
buildSync({
  entryPoints: [
    'lib/scripts/main.ts',
  ],
  platform: 'node',
  outfile: 'lib/scripts/index.js',
  bundle: true,
  format: 'esm',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
