import { exec } from 'child_process';
import { promisify  } from 'util';

import state from '../state';
import { createSpinner } from '../utils';


const asyncExec = promisify(exec);

export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  const spinner = createSpinner(
    () => asyncExec(`git clone ${url} ${projectName}`),
    {
      start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
      success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
      fail: `Something went wrong while cloning '${boilerplate}' into '${projectName}'. Aborting.`,
    },
  );

  await spinner.start();
}

export async function npmInstall(): Promise<void> {
  const { projectName } = state.answers;

  const spinner = createSpinner(
    () => asyncExec(`npm --prefix ${projectName} install`),
    {
      start: '📦  Installing packages...',
      success: '📦  Installed packages!',
      fail: `Something went wrong while NPM installing '${projectName}'. Aborting.`,
    },
  );

  await spinner.start();
}
