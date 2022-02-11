import * as question from '../../questions';
import logger from '../../../lib/logger';
import state from '../../../lib/state';
import * as actions from '../shared/actions';


async function installer(): Promise<void> {
  state.answers.renderType = await question.rendering();
  state.answers.renderType = await question.cms();
  state.answers.modules = await question.modules();

  logger.whitespace();

  await actions.clone('https://github.com/react-prime/react-prime.git');
  await actions.npmInstall();

  logger.whitespace();

  state.answers.openInEditor = await question.openInEditor();
}

export default installer;
