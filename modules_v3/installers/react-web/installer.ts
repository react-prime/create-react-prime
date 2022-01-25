import logger from '../../../core/Logger';
import * as question from '../../questions';
import state from '../../state';
import * as actions from './actions';

async function installer(): Promise<void> {
  await state.set('answers', async (answers) => {
    answers.renderType = await question.rendering();
    answers.cms = await question.cms();
    answers.modules = await question.modules();
  });

  logger.whitespace();
  await actions.clone('https://github.com/react-prime/react-prime.git');
  logger.whitespace();

  await state.set('answers', async (answers) => {
    answers.openInEditor = await question.openInEditor();
  });
}

export default installer;
