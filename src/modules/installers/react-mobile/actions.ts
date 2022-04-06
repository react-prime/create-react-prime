import type cp from 'child_process';
import path from 'path';
import { readdirSync, renameSync } from 'fs';
import { state } from '@crp';
import { logger, createSpinner, asyncExec } from '@crp/utils';

import { installApiHelper } from '../shared/actions';

export async function installModules(): Promise<void> {
  for await (const module of state.answers.modules || []) {
    switch (module) {
      case 'api-helper':
        await installApiHelper();
        break;
    }
  }
}

export async function podInstall(): Promise<void> {
  const { projectName } = state.answers;

  async function action(): Promise<void> {
    await asyncExec(`cd ${projectName}/ios && pod install`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'pod install',
    start: `🔤  Installing iOS Podfile for '${projectName}'...`,
    success: `🔤  Installed iOS dependencies for '${projectName}'!`,
    fail: `🔤  Something went wrong while installing Podfile for '${projectName}'.`,
  });

  await spinner.start();
}

export function validateProjectName(): boolean {
  return /^.*[^a-zA-Z0-9].*$/.test(state.answers.projectName) === false;
}

export function renameProject(): void {
  // Remove non-alphanumeric characters + lower cased name
  state.answers.projectName = state.answers.projectName
    .replace(/\W/g, '')
    .toLowerCase();

  // Let user know we renamed the project
  logger.warning(
    `Project name insufficient, it has been renamed to '${state.answers.projectName}'.\n`,
    'Read more: https://github.com/facebook/react-native/issues/213.\n',
  );
}

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
