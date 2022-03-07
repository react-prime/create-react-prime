import fs from 'fs';
import type { Options } from 'tsup';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const isDev = process.env.NODE_ENV === 'development';

export const tsup: Options = {
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node14',
  banner: {
    js: '#!/usr/bin/env node',
  },
  define: {
    'process.env.VERSION': JSON.stringify(pkg.version),
    'process.env.NAME': JSON.stringify(pkg.name),
  },
  watch: isDev,
  onSuccess: isDev ? 'npm run postdev' : '',
};
