import { prompt, DistinctQuestion, Answers } from 'inquirer';


const question = async <Q extends DistinctQuestion>(obj: Q): Promise<string> => {
  const answers = await prompt([obj]);
  const { name } = obj;

  return answers[name];
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const boilerplate = () => question({
  type: 'list',
  name: 'What boilerplate would you like to install?',
  choices: ['react-web', 'react-mobile'],
  default: 0,
});

export const rendering = () => question({
  type: 'list',
  name: 'How should the app be rendered?',
  choices: ['client-side', 'server-side + static'],
  default: 0,
});

export const projectName = (answers: Answers) => question({
  type: 'input',
  name: 'Project name',
  default: answers.boilerplate,
});

export const cms = () => question({
  type: 'list',
  name: 'What CMS will the project use?',
  choices: [{
    name: 'Skip',
    value: null,
  }, {
    name: 'Contentful',
    value: 'contentful',
  }],
  default: 0,
});

export const modules = () => question({
  type: 'list',
  name: 'What CMS will the project use?',
  choices: [{
    name: 'Skip',
    value: null,
  }, {
    name: 'Contentful',
    value: 'contentful',
  }],
  default: 0,
});

export const openInEditor = () => question({
  type: 'list',
  name: 'Open project in editor?',
  choices: [{
    name: 'Skip',
    value: null,
  }],
});

/* eslint-enable */
