import { existsSync } from 'fs';
import { state, logger, createSpinner, asyncExec } from '@crp';
import * as cli from '@crp/cli';
import { ERROR_TEXT } from '@crp/constants';

// Export because it's used in tests
export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Check if a directory with this name already exists
    if (projectName !== '.' && existsSync(projectName)) {
      // Throw so that spinner fails and shows this error
      throw new Error(ERROR_TEXT.DirectoryExists.replace('%s', projectName));
    }

    await asyncExec(`git clone ${url}`);
  }

  const text = (() => {
    if (cli.getOptions().modules) {
      return {
        name: 'clone',
        start: '🚚  Cloning modules into project...',
        success: '🚚  Cloned modules!',
        fail: '🚚  Something went wrong while cloning modules into project.',
      };
    }

    return {
      name: 'clone',
      start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
      success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
      fail: `🚚  Something went wrong while cloning '${boilerplate}' into '${projectName}'.`,
    };
  })();

  const spinner = createSpinner(() => action(), text);

  await spinner.start();
}

export async function downloadMonorepo(): Promise<void> {
  // Check if a prime-monorepo directory already exists
  if (existsSync('prime-monorepo')) {
    await logger.error(ERROR_TEXT.DirectoryExists, 'prime-monorepo');
  }

  await clone('https://github.com/LabelA/prime-monorepo.git');
}
