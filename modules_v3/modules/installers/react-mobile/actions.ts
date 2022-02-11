import type cp from 'child_process';
import path from 'path';

import logger from '../../../lib/logger';
import state from '../../../lib/state';
import { createSpinner } from '../../../lib/utils';
import { asyncExec } from '../shared/actions';


export async function renameFiles(): Promise<void> {
  const { projectName } = state.answers;

  async function action() {
    const scripts = [
      ['rename files', `npx react-native-rename ${projectName}`],
      ['replace text', `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`],
      ['replace schemes', `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`],
    ];

    const options: cp.ExecOptions = {
      cwd: path.resolve(projectName),
    };

    for await (const [name, script] of scripts) {
      await asyncExec(script, options)
        .catch(() => {
          logger.warning(`Script '${name}' has failed. Manual file renaming is required after installation.`);
        });
    }
  }

  const spinner = createSpinner(
    () => action(),
    {
      start: `🔤  Renaming project files to '${projectName}'...`,
      success: `🔤  Renamed project files to '${projectName}'!`,
      fail: `🔤  Something went wrong while renaming files for '${projectName}'.`,
    },
  );

  await spinner.start();
}
