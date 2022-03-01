import { state } from '@crp';
import { logger } from '@crp/utils';

import * as question from 'modules/questions';
import * as actions from '../shared/actions';


async function installer(): Promise<void> {
  state.answers.renderType = await question.rendering();
  state.answers.cms = await question.cms();
  state.answers.modules = await question.modules();

  logger.whitespace();

  // Installation process
  await actions.clone('https://github.com/react-prime/react-prime.git');
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
