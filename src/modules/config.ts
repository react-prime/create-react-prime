import * as i from 'types';

import JsInstaller from 'modules/installers/js/Installer';
import NativeInstaller from 'modules/installers/js/Native';
import JsSteps from 'modules/steps/js/Steps';
import NativeSteps from 'modules/steps/js/Native';


export const vc: Record<string, i.Vc> = {
  reactPrime: {
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
        vc: vc.reactPrime,
        description: 'Client-side rendering',
        installer: JsInstaller,
      },
      ssr: {
        name: 'ssr',
        repository: 'react-prime-ssr',
        vc: vc.reactPrime,
        description: 'Server-side rendering',
        installer: JsInstaller,
      },
      native: {
        name: 'native',
        repository: 'react-prime-native',
        vc: vc.reactPrime,
        description: 'React-native w/o Expo',
        installer: NativeInstaller,
        steps: NativeSteps,
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
