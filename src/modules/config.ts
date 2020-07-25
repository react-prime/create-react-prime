import * as i from 'types';

import Installer from 'core/Installer';

import NativeInstaller from 'modules/installers/Native';
import JsSteps from 'modules/steps/Js';


export const vc: Record<string, i.Vc> = {
  'react-prime': {
    host: 'github.com',
    owner: 'react-prime',
  },
};

const installersConfig: i.InstallersConfig = {
  js: {
    steps: JsSteps,
    type: {
      client: {
        name: 'client',
        repository: 'react-prime',
        vc: vc['react-prime'],
        description: 'Client-side rendering',
        installer: Installer,
      },
      ssr: {
        name: 'ssr',
        repository: 'react-prime-ssr',
        vc: vc['react-prime'],
        description: 'Server-side rendering',
        installer: Installer,
      },
      native: {
        name: 'native',
        repository: 'react-prime-native',
        vc: vc['react-prime'],
        description: 'React-native w/o Expo',
        installer: NativeInstaller,
      },
    },
    instructions: {
      quickstart: ['npm start'],
      allCommands: [
        {
          cmd: 'npm start',
          desc: 'Start your development server.',
        },
        {
          cmd: 'npm run build',
          desc: 'Build your website for production.',
        },
        {
          cmd: 'npm run server',
          desc: 'Start your production server.',
        },
      ],
    },
  },
};

export default installersConfig;
