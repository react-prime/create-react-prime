import path from 'path';
import os from 'os';

export const LOG_PREFIX = 'crp';
// Save a hidden CRP settings file to user's home directory to store settings between sessions
export const SETTINGS_FILE_PATH = path.join(os.homedir(), '.crp.json');

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
