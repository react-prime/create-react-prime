import type cp from 'child_process';
import path from 'path';
import camelcase from 'camelcase';
import { state } from '@crp';
import { logger, createSpinner, asyncExec } from '@crp/utils';

export function validateProjectName(): boolean {
  return /^.*[^a-zA-Z0-9].*$/.test(state.answers.projectName) === false;
}

export function renameProject(): void {
  // Remove non-alphanumeric characters + camelcase name
  state.answers.projectName = camelcase(state.answers.projectName);

  // Let user know we renamed the project
  logger.warning(
    `Project name has been renamed to '${state.answers.projectName}'.\n`,
    'Read more: https://github.com/facebook/react-native/issues/213.\n',
  );
}

export async function renameFiles(): Promise<void> {
  const { projectName } = state.answers;

  async function action(): Promise<void> {
    const scripts = [
      ['rename files', `npx react-native-rename ${projectName}`],
      [
        'replace text',
        `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`,
      ],
      [
        'replace schemes',
        `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`,
      ],
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
  }

  const spinner = createSpinner(() => action(), {
    name: 'rename files',
    start: `🔤  Renaming project files to '${projectName}'...`,
    success: `🔤  Renamed project files to '${projectName}'!`,
    fail: `🔤  Something went wrong while renaming files for '${projectName}'.`,
  });

  await spinner.start();
}
