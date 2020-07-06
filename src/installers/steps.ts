import * as i from 'types';
import SERVICES from 'ioc/services';
import { ORGANIZATION } from './config';


/** Installation step identifiers */
export const INSTALL_STEP = [
  'clone',
  'updatePackage',
  'npmInstall',
  'cleanup',
  'runNativeScripts',
] as const;


function baseInstallSteps(): i.InstallStepOptions[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const container = require('ioc').default;
  const cliMgr: i.CLIMgrType = container.get(SERVICES.CLIMgr);
  const { installRepository, projectName } = cliMgr;

  /**
   * Installation steps
   * These steps are required to run a proper installation
   *
   * @property {string,function} fn Can either be a direct reference to a function,
   * or a name reference to any method from an Installer instance as string
   */
  return [
    {
      id: 'clone',
      emoji: '🚚',
      message: {
        pending: `Cloning '${installRepository}' into '${projectName}'...`,
        success: `Cloned '${installRepository}' into '${projectName}'!`,
      },
      cmd: `git clone https://github.com/${ORGANIZATION}/${installRepository}.git ${projectName}`,
    },
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
    {
      id: 'cleanup',
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
