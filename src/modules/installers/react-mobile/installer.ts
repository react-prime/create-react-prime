import { state } from '@crp';
import { logger } from '@crp/utils';


import * as question from '../../questions';
import * as actions from '../shared/actions';
import * as moduleActions from './actions';


async function installer(): Promise<void> {
  if (!moduleActions.validateProjectName()) {
    moduleActions.renameProject();
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
