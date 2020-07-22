import * as i from 'types';
import Steps from './Steps';

export default class JsSteps extends Steps implements i.StepsType {
  init(): i.InstallStepOptions[] {
    const { projectName } = this.cliMgr;

    return [
      {
        id: 'updatePackage',
        emoji: '✏️ ',
        message: {
          pending: 'Updating package.json...',
          success: 'Updated package.json!',
        },
        fn: 'updatePackage',
      },
      {
        id: 'npmInstall',
        emoji: '📦',
        message: {
          pending: 'Installing packages...',
          success: 'Installed packages!',
        },
        cmd: `npm --prefix ${projectName} install`,
      },
    ];
  }
}
