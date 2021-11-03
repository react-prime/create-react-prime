// Compile scripts
require('esbuild').buildSync({
  entryPoints: [
    'core/scripts/index.ts',
  ],
  platform: 'node',
  outdir: 'core/scripts',
  target: 'node12',
  bundle: true,
});

// Run scripts
const scripts = require('./core/scripts/index.js');
scripts.generateModulesArray();
