import logger from '@crp/logger';
import state from '@crp/state';
import { ERROR_TEXT, WARN_TEXT } from '@crp/constants';

import * as question from 'modules/questions';
import * as actions from '../shared/actions';
import * as moduleActions from './actions';


async function installer(): Promise<void> {
  const tempProjectName = state.answers.projectName;

  if (!state.answers.projectName) {
    return logger.error(ERROR_TEXT.InvalidCLIState);
  }

  // Remove non-alphanumeric characters
  state.answers.projectName = state.answers.projectName.replace(/\W/g, '');

  // Let user know we renamed the project
  if (tempProjectName !== state.answers.projectName) {
    logger.whitespace();
    logger.warning(WARN_TEXT.ProjectRename, state.answers.projectName);
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

  if (state.answers.openInEditor != null) {
    await question.answerOpenInEditor();
  }
}

export default installer;
