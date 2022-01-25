import { checkboxQuestion, listQuestion, question } from './templates';


/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function boilerplate() {
  return listQuestion({
    name: 'What boilerplate would you like to install?',
    choices: ['react-web', 'react-mobile'],
    default: 0,
  });
}

export function rendering() {
  return listQuestion({
    name: 'How should the app be rendered?',
    choices: ['client-side', 'server-side + static'],
    default: 0,
  });
}
export function projectName(projectName: string) {
  return question({
    type: 'input',
    name: 'Project name',
    default: projectName,
  });
}

export function cms() {
  return listQuestion({
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
}

export function modules() {
  return checkboxQuestion({
    name: 'What extra modules would you like to install?',
    choices: [{
      name: 'API Helper',
      value: 'api',
    }],
    default: 0,
  });
}

export function openInEditor() {
  return listQuestion({
    name: 'Open project in editor?',
    choices: [{
      name: 'Skip',
      value: null,
    }],
  });
}
/* eslint-enable */
