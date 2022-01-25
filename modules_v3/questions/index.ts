import { checkboxQuestion, listQuestion, question } from './templates';


/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const boilerplate = () => listQuestion({
  type: 'list',
  name: 'What boilerplate would you like to install?',
  choices: ['react-web', 'react-mobile'],
  default: 0,
});

export const rendering = () => listQuestion({
  type: 'list',
  name: 'How should the app be rendered?',
  choices: ['client-side', 'server-side + static'],
  default: 0,
});

export const projectName = (projectName: string) => question({
  type: 'input',
  name: 'Project name',
  default: projectName,
});

export const cms = () => listQuestion({
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

export const modules = () => checkboxQuestion({
  name: 'What extra modules would you like to install?',
  choices: [{
    name: 'API Helper',
    value: 'api',
  }],
  default: 0,
});

export const openInEditor = () => listQuestion({
  type: 'list',
  name: 'Open project in editor?',
  choices: [{
    name: 'Skip',
    value: null,
  }],
});

/* eslint-enable */
