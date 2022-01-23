import { Answers } from 'inquirer';

import cli, { ARGS } from './cli';
import * as question from './questions';

export default async (): Promise<void> => {
  const answers: Answers = {};

  answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
  answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(answers);
  answers.rendering = await question.rendering();
  answers.cms = await question.cms();
  answers.modules = await question.modules();
  answers.openInEditor = await question.openInEditor();
};
