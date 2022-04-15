import type * as i from 'types';
import os from 'os';
import fs from 'fs';
import path from 'path';
import open from 'open';
import { state, question, listQuestion, checkboxQuestion, logger } from '@crp';
import { asyncExec } from '@crp/utils';
import gitUserName from 'git-user-name';
import kleur from 'kleur';

import { webComponents, mobileComponents } from './components';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function entry() {
  return listQuestion<i.Entry>({
    name: 'What would you like to do?',
    choices: [
      {
        name: 'Install a boilerplate',
        value: 'boilerplate',
      },
      // @TODO Add support for installing modules or components separately
      // {
      //   name: 'Install modules',
      //   value: 'modules',
      // },
      {
        name: 'Exit',
        value: null,
      },
    ],
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
      const validLength = input.length >= 2 && input.length < 30;

      return !hasIllegalChars && validLength;
    },
  });
}

export function cms() {
  return listQuestion({
    name: 'What CMS will the project use?',
    choices: [
      {
        name: 'Skip',
        value: null,
      },
      {
        name: 'Contentful',
        value: 'contentful',
      },
    ],
    default: 0,
  });
}

export async function modules() {
  const { boilerplate } = state.answers;

  const choices: i.ModuleItem[] = [
    {
      name: 'API Helper',
      value: 'api-helper',
    },
  ];

  if (boilerplate === 'react-web') {
    choices.push(
      {
        name: 'Manual Deploy',
        value: 'manual-deploy',
      },
      {
        name: 'Continuous Deploy',
        value: 'continuous-deploy',
      },
      /** @TODO Move to default choices when react-mobile is supported */
      {
        name: 'Sentry',
        value: 'sentry',
      },
    );
  } else if (boilerplate === 'react-mobile') {
    // WIP
    // choices.push({
    //   name: 'Authentication hook',
    //   value: 'use-authentication',
    // });
  }

  const answers = await checkboxQuestion<i.Modules[]>({
    name: 'What extra modules would you like to install?',
    choices,
    default: 0,
  });

  // Confirm if user has created the project in Sentry before continuing
  // The Sentry wizard asks to link a project, which might not be available
  if (answers.includes('sentry')) {
    const confirmed = await confirmSentryProjectCreated();

    if (!confirmed) {
      await open('https://sentry.io');
      logger.msg(
        'Create your project in Sentry and confirm once the project is created.',
      );

      const confirmed = await confirmSentryProjectCreated();

      // Exit if user refuses to create Sentry project
      if (!confirmed) {
        process.exit(0);
      }
    }
  }

  return answers;
}

export async function components() {
  const { boilerplate } = state.answers;

  const choices: string[] =
    boilerplate === 'react-mobile' ? [...mobileComponents] : [...webComponents];

  const answers = await checkboxQuestion<string[]>({
    name: 'What extra components would you like to install?',
    choices,
    default: 0,
  });

  return answers;
}

export function openInEditor() {
  const choices: i.ChoiceItem[] = [
    {
      name: 'Skip',
      value: null,
    },
  ];
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
    choices,
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

export function tracking() {
  const choices: i.TrackingItem[] = [];

  if (gitUserName() != null) {
    const name = gitUserName();
    const styledName = kleur.dim(`(${name!})`);

    choices.push({
      name: `Git username ${styledName}`,
      value: 'git',
    });
  }

  const otherChoices: i.TrackingItem[] = [
    {
      name: 'Choose my name',
      value: 'choose',
    },
    {
      name: 'Anonymous',
      value: 'anonymous',
    },
  ];

  choices.push(...otherChoices);

  return listQuestion<i.Tracking>({
    name: 'We track usage of this tool, how would you like to be identified?',
    choices,
    default: 0,
    disableTracking: true,
  });
}

export function trackingName() {
  return question({
    type: 'input',
    name: 'Choose your name',
    validate: (input: string) => {
      return input.length >= 2 && input.length < 20;
    },
    disableTracking: true,
  });
}

export function apiHelperBaseUrl() {
  return question({
    type: 'input',
    name: 'API base url (optional)',
    default: '',
  });
}

export function confirmSentryProjectCreated() {
  return question({
    type: 'confirm',
    name: 'Have you created the project in Sentry?',
    default: false,
  });
}
/* eslint-enable */
