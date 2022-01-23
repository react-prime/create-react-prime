import { Answers } from 'inquirer';

import * as question from '../questions';
import * as actions from './actions';


type BaseAnswers = {
  projectName: string;
  boilerplate: string;
}

export default async ({ projectName, boilerplate }: BaseAnswers): Promise<void> => {
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
};
