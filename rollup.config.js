import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

import pkg from './package.json';

export default {
  input: 'src/core/main.ts',
  external: Object.keys(pkg.dependencies),
  output: {
    dir: 'dist',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript(),
    typescriptPaths(),
    replace({
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
      'process.env.NAME': JSON.stringify(process.env.npm_package_name),
    }),
  ],
};
