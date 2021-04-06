export const LOG_PREFIX = 'crp';

/** CLI argument name indices */
export const ARG = {
  ProjectName: 0,
} as const;

export const ERROR_TEXT = {
  ProjectName: 'Invalid project name. Name contains illegal characters.',
  DirectoryExists: 'directory \'%s\' already exists.',
  InvalidSteps: 'Error in --skipSteps. %s is/are invalid. Available steps: %s',
  PkgNotFound: 'No package.json found in %s',
};
