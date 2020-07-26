import * as i from 'types';

import JsInstaller from 'modules/installers/js/Installer';
import NativeInstaller from 'modules/installers/js/Native';
import JsSteps from 'modules/steps/js/Steps';


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
        installer: JsInstaller,
      },
      ssr: {
        name: 'ssr',
        repository: 'react-prime-ssr',
        vc: vc['react-prime'],
        description: 'Server-side rendering',
        installer: JsInstaller,
      },
      native: {
        name: 'native',
        repository: 'react-prime-native',
        vc: vc['react-prime'],
        description: 'React-native w/o Expo',
        installer: NativeInstaller,
        instructions: {
          allCommands: [
            {
              cmd: 'npm start',
              desc: 'Start your development server',
            },
            {
              cmd: 'npm run ios',
              desc: 'Start the app on an iOS simulator',
            },
            {
              cmd: 'npm run android',
              desc: 'Start the app on an Android simulator',
            },
          ],
        },
      },
    },
    instructions: {
      quickstart: ['npm start'],
      allCommands: [
        {
          cmd: 'npm start',
          desc: 'Start your development server',
        },
        {
          cmd: 'npm run build',
          desc: 'Build your website for production',
        },
        {
          cmd: 'npm run server',
          desc: 'Start your production server',
        },
      ],
    },
  },
};

export default installersConfig;
