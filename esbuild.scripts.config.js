import { buildSync } from 'esbuild';

// Compile scripts
buildSync({
  entryPoints: [
    'scripts/main.ts',
  ],
  platform: 'node',
  outfile: 'scripts/index.js',
  bundle: true,
  format: 'esm',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
