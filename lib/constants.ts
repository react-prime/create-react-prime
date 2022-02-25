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
  PkgNotFound: 'No package.json found in %s',
  ProjectRename:
    'Project name has been renamed to \'%s\'.\nRead more: https://github.com/facebook/react-native/issues/213.\n',
  GenericError: 'Something went wrong during the installation of \'%s\'.',
};
