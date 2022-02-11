import * as question from '../../questions';
import logger from '../../../lib/logger';
import state from '../../../lib/state';
import * as actions from '../shared/actions';


async function installer(): Promise<void> {
  logger.whitespace();

  await actions.clone('https://github.com/react-prime/react-prime-native.git');
  await actions.npmInstall();

  logger.whitespace();

  state.answers.openInEditor = await question.openInEditor();
}

export default installer;
