import { state } from '@crp';
import { logger } from '@crp/utils';

import * as question from '../../questions';
import * as actions from '../shared/actions';
import * as moduleActions from './actions';

async function installer(): Promise<void> {
  // state.answers.renderType = await question.rendering();
  // state.answers.cms = await question.cms();
  state.answers.modules = await question.modules();
  state.answers.components = await question.components();

  logger.whitespace();

  // Installation process
  await actions.downloadMonorepo();
  await actions.copyBoilerplate();
  await moduleActions.installModules();
  await moduleActions.installComponents();
  await actions.npmInstall();
  await actions.npmPackageUpdate();
  await actions.cleanup();
  await actions.removeMonorepo();

  logger.whitespace();

  // Closing prompt
  state.answers.openInEditor = await question.openInEditor();

  if (state.answers.openInEditor != null) {
    await question.answerOpenInEditor();
  }
}

export default installer;
