const cp = require('child_process');
const pkg = require('./package.json');

const DEV = process.env.NODE_ENV == 'development';

let fork = null;
function onBuildComplete() {
  if (DEV) {
    // Run app with node
    fork?.kill();
    fork = cp.fork('dist/main.js', {
      stdio: 'inherit',
    });
  }
}

async function build() {
  await require('esbuild').build({
    entryPoints: [
      'modules_v3/index.ts',
    ],
    platform: 'node',
    bundle: true,
    outfile: 'dist/main.js',
    define: {
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.NAME': JSON.stringify(pkg.name),
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    target: 'node14',
    external: Object.keys(require('./package.json').dependencies),
    watch: DEV && {
      onRebuild(err) {
        if (err) {
          console.error('⚡️ ERR: Watch build failed:', err);
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
}

build();
