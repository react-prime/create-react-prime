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
  BOLD: '\\' + '033[1m',
  YELLOW: '\\' + '033[93m',
  DEFAULT: '\\' + '033[0m',
};
