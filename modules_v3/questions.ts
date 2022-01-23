import { prompt, DistinctQuestion } from 'inquirer';


const question = async <Q extends DistinctQuestion>(obj: Q): Promise<string> => {
  const answers = await prompt([obj]);
  const { name } = obj;

  return answers[name];
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const boilerplateQuestion = async () => question({
  type: 'list',
  name: 'What boilerplate would you like to install?',
  choices: ['react-web', 'react-mobile'],
  default: 0,
});

export const renderingQuestion = async () => question({
  type: 'list',
  name: 'How should the app be rendered?',
  choices: ['client-side', 'server-side + static'],
  default: 0,
});
/* eslint-enable */
