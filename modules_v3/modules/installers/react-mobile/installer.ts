import * as question from '../../questions';
import logger from '../../../lib/logger';
import state from '../../../lib/state';
import * as actions from '../shared/actions';

import * as moduleActions from './actions';
import { ERROR_TEXT } from '../../../lib/constants';


async function installer(): Promise<void> {
  const tempProjectName = state.answers.projectName;

  // Remove non-alphanumeric characters
  state.answers.projectName = state.answers.projectName.replace(/\W/g, '');

  // Let user know we renamed the project
  if (tempProjectName !== state.answers.projectName) {
    logger.whitespace();
    logger.warning(ERROR_TEXT.ProjectRename, state.answers.projectName);
  } else {
    logger.whitespace();
  }

  // Installation process
  await actions.clone('https://github.com/react-prime/react-prime-native.git');
  await moduleActions.renameFiles();
  await actions.npmInstall();
  await actions.npmPackageUpdate();
  await actions.cleanup();

  logger.whitespace();

  // Closing prompt
  state.answers.openInEditor = await question.openInEditor();
}

export default installer;
