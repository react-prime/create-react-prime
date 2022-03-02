import type * as i from 'types';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { state, question, listQuestion, checkboxQuestion } from '@crp';
import { asyncExec } from '@crp/utils';


/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function entry() {
  return listQuestion<i.Entry>({
    name: 'What would you like to do?',
    choices: [{
      name: 'Install a boilerplate',
      value: 'boilerplate',
    }, {
      name: 'Exit',
      value: null,
    }],
  });
}

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
    validate: (input: string) => {
      // source: https://kb.acronis.com/content/39790
      let illegalChars = new RegExp('');

      switch (os.type()) {
        case 'WINDOWS_NT':
          illegalChars = /[\^\\/?*:|"<> ]+/;
          break;
        case 'Darwin':
          // These are allowed but produce unwanted results
          illegalChars = /[\/:]+/;
          break;
        case 'Linux':
        default:
          illegalChars = /[\/]+/;
      }

      const hasIllegalChars = illegalChars.test(input);

      return !hasIllegalChars;
    },
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
  const choices: i.ChoiceItem[] = [];
  const files = fs.readdirSync('/Applications/');

  // Look for editors in the Applications folder
  const editors: i.EditorSearchItem[] = [
    {
      name: 'Visual Studio Code',
      search: 'visual studio',
    },
    {
      name: 'Atom',
      search: 'atom',
    },
    {
      name: 'Sublime Text',
      search: 'sublime',
    },
  ];

  for (const file of files) {
    const filePath = file.toLowerCase();

    for (const editor of editors) {
      if (filePath.includes(editor.search)) {
        editor.path = file.replace(/(\s+)/g, '\\$1');
      }
    }
  }

  // Add found editors as choice
  for (const editor of editors) {
    if (editor.path) {
      choices.push({
        name: editor.name,
        value: editor,
      });
    }
  }

  return listQuestion<i.EditorSearchItem>({
    name: 'Open project in editor?',
    choices: [
      {
        name: 'Skip',
        value: null,
      },
      ...choices,
    ],
    when: os.type() === 'Darwin' && choices.length > 0,
  });
}

export async function answerOpenInEditor() {
  const { projectName, openInEditor } = state.answers;

  if (!openInEditor) {
    return;
  }

  const dir = path.resolve(projectName);

  await asyncExec(`open ${dir} -a ${openInEditor.path}`);
}
/* eslint-enable */
