import { state } from '@crp';
import { logger } from '@crp/utils';

export function renameProject(): void {
  // Remove non-alphanumeric characters + lower cased name
  state.answers.projectName = state.answers.projectName
    .replace(/\W/g, '')
    .toLowerCase();

  // Let user know we renamed the project
  logger.warning(
    'Project name contains invalid characters (only lowercase allowed), so it has been renamed to ',
    `${state.answers.projectName}.\n Read more: https://github.com/facebook/react-native/issues/213.\n`,
  );
}
