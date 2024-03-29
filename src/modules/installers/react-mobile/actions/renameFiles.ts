import type cp from 'child_process';
import path from 'path';
import { readdirSync, renameSync } from 'fs';
import { state } from '@crp';
import { logger, createSpinner, asyncExec } from '@crp/utils';

export async function renameFiles(): Promise<void> {
  const { projectName } = state.answers;

  async function action(): Promise<void> {
    const scripts = [
      ['rename files', `npx react-native-rename ${projectName}`],
      ['replace text', `npx replace 'reactmobile' '${projectName}' . -r`],
    ];

    const options: cp.ExecOptions = {
      cwd: path.resolve(projectName),
    };

    for await (const [name, script] of scripts) {
      await asyncExec(script, options).catch(() => {
        logger.warning(
          `Script '${name}' has failed. Manual file renaming is required after installation.`,
        );
      });
    }

    // Rename schemes in iOS folder
    const schemeFolder = `${projectName}/ios/${projectName}.xcodeproj/xcshareddata/xcschemes`;
    for await (const oldFile of readdirSync(schemeFolder)) {
      const newFile = oldFile.replace('reactmobile', projectName);
      renameSync(
        path.join(schemeFolder, oldFile),
        path.join(schemeFolder, newFile),
      );
    }
  }

  const spinner = createSpinner(() => action(), {
    name: 'rename files',
    start: `🔤  Renaming project files to '${projectName}'...`,
    success: `🔤  Renamed project files to '${projectName}'!`,
    fail: `🔤  Something went wrong while renaming files for '${projectName}'.`,
  });

  await spinner.start();
}
