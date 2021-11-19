/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  transform: {
    '\\.ts$': 'esbuild-runner/jest',
  },
  maxWorkers: '50%',
  globals: {
    __PROD__: false,
    __TEST__: true,
  },
};
