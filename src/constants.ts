export const LOG_PREFIX = 'crp';

/** Boilerplate types */
export const TYPE = {
  CLIENT: 'client',
  SSR: 'ssr',
  NATIVE: 'native',
} as const;

/** Boilerplate repository names */
export const REPOSITORIES = {
  client: 'react-prime',
  ssr: 'react-prime-ssr',
  native: 'react-prime-native',
} as const;

/** Github organization tag */
export const ORGANIZATION = 'react-prime';

/** CLI argument name indices */
export const ARG = {
  PROJECT_NAME: 0,
} as const;

/** Command line colors */
export const TEXT = {
  BOLD: '\x1b[1m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  DEFAULT: '\x1b[0m',
};

/** Installation step identifiers */
export const INSTALL_STEP = {
  CLONE: Symbol.for('clone'),
  UPDATE_PACKAGE: Symbol.for('update'),
  NPM_INSTALL: Symbol.for('install'),
  CLEANUP: Symbol.for('cleanup'),
  RUN_NATIVE_SCRIPTS: Symbol.for('native_scripts'),
};
