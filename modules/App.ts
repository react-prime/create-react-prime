import CRPApp from 'core/CRPApp';

import { CleanupStep, CloneStep, NpmInstallStep, NpmPackageUpdateStep } from './defaults/steps';
import { BoilerplateQuestion, OpenEditorQuestion, ProjectNameQuestion } from './defaults/questions';
import ReactWebInstaller from './react-web/ReactSPA.installer';
import ReactMobileInstaller from './react-mobile/ReactMobile.installer';


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
    ReactWebInstaller,
    ReactMobileInstaller,
  ];
}
