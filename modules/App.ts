import CRPApp from 'core/CRPApp';

import { CleanupStep, CloneStep, NpmInstallStep, NpmPackageUpdateStep } from './defaults/steps';
import { BoilerplateQuestion, OpenEditorQuestion, ProjectNameQuestion } from './defaults/questions';
import ReactSPAInstaller from './react-spa/ReactSPA.installer';
import ReactSSRInstaller from './react-ssr/ReactSSR.installer';
import ReactNativeInstaller from './react-native/ReactNative.installer';
import GatsbyInstaller from './gatsby/Gatsby.installer';


export default class App extends CRPApp {
  /** Do not add installer specific modules to defaults */
  defaults = {
    steps: [
      CloneStep,
      NpmPackageUpdateStep,
      NpmInstallStep,
      CleanupStep,
    ],
    questions: [
      BoilerplateQuestion,
      ProjectNameQuestion,
      OpenEditorQuestion,
    ],
  };

  installers = [
    ReactSPAInstaller,
    ReactSSRInstaller,
    ReactNativeInstaller,
    GatsbyInstaller,
  ];
}
