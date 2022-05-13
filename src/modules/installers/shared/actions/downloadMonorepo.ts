import { existsSync } from 'fs';
import { state, createSpinner, asyncExec } from '@crp';
import * as cli from '@crp/cli';
import { ERROR_TEXT } from '@crp/constants';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';

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
    const { modules, components } = cli.getOptions();
    const { entry } = state.answers;

    if (
      modules ||
      components ||
      ['components', 'modules'].includes(entry as string)
    ) {
      return {
        name: 'clone',
        start: '🚚  Cloning...',
        success: '🚚  Cloned!',
        fail: '🚚  Something went wrong while cloning the code into project.',
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
  if (existsSync(DOWNLOADED_MONOREPO_FOLDER_NAME)) {
    await asyncExec(`rm -rf ${DOWNLOADED_MONOREPO_FOLDER_NAME}`);
  }

  await clone(
    `https://github.com/LabelA/prime-monorepo.git ${DOWNLOADED_MONOREPO_FOLDER_NAME}`,
  );
}
