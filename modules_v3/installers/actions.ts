import { exec } from 'child_process';
import { promisify  } from 'util';

import state from '../state';
import { createSpinner } from '../utils';


export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.get('answers');

  const spinner = createSpinner(
    {
      start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
      success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
      fail: `Something went wrong while cloning '${boilerplate}' into '${projectName}'. Aborting.`,
    },
    () => promisify(exec)(`git clone ${url} ${projectName}`),
  );

  await spinner.start();
}
