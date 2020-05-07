// Boilerplate types
export const TYPE = {
  CLIENT: 'client',
  SSR: 'ssr',
  NATIVE: 'native',
} as const;

// Interface argument name indices
export const ARG = {
  PROJECT_NAME: 0,
} as const;

// Command line colors
export const TEXT = {
  BOLD: '\x1b[1m',
  YELLOW: '\x1b[33m',
  DEFAULT: '\x1b[0m',
};
