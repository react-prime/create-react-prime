import * as i from 'types';

import Steps from 'core/Steps';

import STEPS from 'modules/steps/identifiers';


export default class JsSteps extends Steps implements i.StepsType {
  init(): i.InstallStepOptions[] {
    return [
      {
        id: STEPS.UpdatePackage,
        emoji: '✏️ ',
        message: {
          pending: 'Updating package.json...',
          success: 'Updated package.json!',
        },
      },
      {
        id: STEPS.NpmInstall,
        emoji: '📦',
        message: {
          pending: 'Installing packages...',
          success: 'Installed packages!',
        },
        cmd: `npm --prefix ${this.cliMgr.projectName} install`,
      },
    ];
  }
}
