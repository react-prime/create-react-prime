import logger from '../../Logger';
import * as question from '../../questions';
import state from '../../state';
import actions from './actions';


async function installer(): Promise<void> {
  state.answers.renderType = await question.rendering();
  state.answers.renderType = await question.cms();
  state.answers.modules = await question.modules();

  logger.whitespace();
  await actions();
  logger.whitespace();

  state.answers.openInEditor = await question.openInEditor();
}

export default installer;
