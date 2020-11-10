import vc from 'modules/config/vc';
import JsInstaller from 'modules/installers/js/Installer';
import NativeInstaller from 'modules/installers/js/Native';
import NativeSteps from 'modules/steps/js/Native';


/**
 * Every type of repository (boilerplate) that the user can select.
 */
const jsBoilerplates = {
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
};

export default jsBoilerplates;
