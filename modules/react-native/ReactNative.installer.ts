import Installer from 'core/decorators/Installer';
import cliMgr from 'core/CLIMgr';
import Logger from 'core/Logger';

import ScriptsStep from './steps/scriptsStep';
import TestQuestion from './questions/TestQuestion';


@Installer({
  name: 'react-native',
  cloneUrl: 'https://github.com/react-prime/react-prime-native.git',
  questions: [TestQuestion],
  steps: [ScriptsStep],
})
export default class ReactNativeInstaller {
  beforeInstall(): void {
    const tempProjectName = cliMgr.getProjectName();

    // Remove non-alphanumeric characters
    cliMgr.setProjectName(
      cliMgr.getProjectName().replace(/\W/g, ''),
    );

    if (tempProjectName !== cliMgr.getProjectName()) {
      const logger = new Logger();

      // eslint-disable-next-line max-len
      logger.warning(`Project name has been renamed to '${cliMgr.getProjectName()}'.\nRead more: https://github.com/facebook/react-native/issues/213.\n`);
    }
  }
}
