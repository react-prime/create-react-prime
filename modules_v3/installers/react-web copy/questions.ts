import logger from '../../../core/Logger';
import * as question from '../../questions';
import state from '../../state';
import * as actions from './actions';

async function questions(): Promise<void> {
  await state.set('answers', async (answers) => {
    answers.renderType = await question.rendering();
    answers.cms = await question.cms();
    answers.modules = await question.modules();

    return answers;
  });

  logger.whitespace();
  await actions.clone('https://github.com/react-prime/react-prime.git');
  logger.whitespace();

  await state.set('answers', async (answers) => {
    answers.openInEditor = await question.openInEditor();

    return answers;
  });
}

export default questions;
