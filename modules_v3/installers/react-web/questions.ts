import type { Answers } from 'inquirer';

import type { BaseAnswers } from '../../types';
import * as question from '../../questions';
import * as actions from './actions';

async function questions({ projectName, boilerplate }: BaseAnswers): Promise<void> {
  const answers: Answers = {};

  answers.rendering = await question.rendering();
  answers.cms = await question.cms();
  answers.modules = await question.modules();

  await actions.clone(
    'https://github.com/react-prime/react-prime.git',
    projectName,
    boilerplate,
  );

  answers.openInEditor = await question.openInEditor();
}

export default questions;
