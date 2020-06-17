// Boilerplate types
export const TYPE = {
  CLIENT: 'client',
  SSR: 'ssr',
  NATIVE: 'native',
} as const;

export const REPOSITORIES = {
  client: 'react-prime',
  ssr: 'react-prime-ssr',
  native: 'react-prime-native',
} as const;

export const ORGANIZATION = 'react-prime';

// CLI argument name indices
export const ARG = {
  PROJECT_NAME: 0,
} as const;

// Command line colors
export const TEXT = {
  BOLD: '\x1b[1m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  DEFAULT: '\x1b[0m',
};
