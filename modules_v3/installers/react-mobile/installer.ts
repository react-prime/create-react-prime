import logger from '../../Logger';
import * as question from '../../questions';
import state from '../../state';
import actions from './actions';


async function installer(): Promise<void> {
  logger.whitespace();
  await actions();
  logger.whitespace();

  state.answers.openInEditor = await question.openInEditor();
}

export default installer;
