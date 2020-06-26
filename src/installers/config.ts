import * as i from 'types';
import container from 'ioc';
import SERVICES from 'ioc/services';
import { INSTALL_STEP, ORGANIZATION } from '../constants';

function baseInstallSteps(): i.InstallStepOptions[] {
  const cliMgr = container.get<i.CLIMgrType>(SERVICES.CLIMgr);
  const { installRepository, projectName } = cliMgr;

  /**
   * Basic installation steps
   * These steps are required to run a proper installation
   *
   * @property {string,function} fn Can either be a direct reference to a function,
   * or a name reference to any method from an Installer instance as string
   */
  return [
    {
      id: INSTALL_STEP.CLONE,
      emoji: '🚚',
      message: {
        pending: `Cloning '${installRepository}' into '${projectName}'...`,
        success: `Cloned '${installRepository}' into '${projectName}'!`,
      },
      cmd: `git clone https://github.com/${ORGANIZATION}/${installRepository}.git ${projectName}`,
    },
    {
      id: INSTALL_STEP.UPDATE_PACKAGE,
      emoji: '✏️ ',
      message: {
        pending: 'Updating package.json...',
        success: 'Updated package.json!',
      },
      fn: 'updatePackage',
    },
    {
      id: INSTALL_STEP.NPM_INSTALL,
      emoji: '📦',
      message: {
        pending: 'Installing packages...',
        success: 'Installed packages!',
      },
      cmd: `npm --prefix ${projectName} install`,
    },
    {
      id: INSTALL_STEP.CLEANUP,
      emoji: '🧹',
      message: {
        pending: 'Cleaning up...',
        success: 'Cleaned up!',
      },
      cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
    },
  ];
}

export default baseInstallSteps;
