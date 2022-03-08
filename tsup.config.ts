import fs from 'fs';
import type { Options } from 'tsup';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const isDev = process.env.NODE_ENV === 'development';
const apiUrl = (() => {
  if (process.env.APP_ENV === 'beta') {
    return 'https://create-react-prime-dashboard-git-develop-sandervspl.vercel.app/api';
  }
  if (isDev) {
    return 'http://localhost:3000/api';
  }
  return 'https://create-react-prime-dashboard.vercel.app/api';
})();

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
    __API__: JSON.stringify(apiUrl),
  },
  watch: isDev,
  onSuccess: isDev ? 'npm run postdev' : '',
};
