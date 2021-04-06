import CRPApp from 'core/CRPApp';

import * as defaultSteps from './defaults/steps';
import * as defaultQuestions from './defaults/questions';
import ReactSPAInstaller from './react-spa/ReactSPA.installer';
import ReactSSRInstaller from './react-ssr/reactSSR.installer';
import ReactNativeInstaller from './react-native/ReactNative.installer';


export default class App extends CRPApp {
  /** Do not add installer specific modules to defaults */
  defaults = {
    steps: [
      defaultSteps.CloneStep,
      defaultSteps.NpmPackageUpdateStep,
      defaultSteps.NpmInstallStep,
      defaultSteps.CleanupStep,
    ],
    questions: [
      defaultQuestions.BoilerplateQuestion,
      defaultQuestions.ProjectNameQuestion,
      defaultQuestions.OpenEditorQuestion,
    ],
  };

  installers = [
    ReactSPAInstaller,
    ReactSSRInstaller,
    ReactNativeInstaller,
  ];
}
