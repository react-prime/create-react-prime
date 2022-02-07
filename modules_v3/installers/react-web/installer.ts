import logger from '../../Logger';
import * as question from '../../questions';
import prompt from '../../questions/prompt';
import actions from './actions';


async function installer(): Promise<void> {
  await prompt('renderType', question.rendering);
  await prompt('cms', question.cms);
  await prompt('modules', question.modules);

  logger.whitespace();
  await actions();
  logger.whitespace();

  await prompt('openInEditor', question.openInEditor);
}

export default installer;
