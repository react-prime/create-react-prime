import Installer from 'core/decorators/Installer';
import cliMgr from 'core/CLIMgr';

import ScriptsStep from './steps/scriptsStep';
import TestQuestion from './questions/TestQuestion';


@Installer({
  name: 'react-native',
  cloneUrl: 'https://github.com/react-prime/react-prime-native.git',
  questions: [TestQuestion],
  steps: [ScriptsStep],
})
export default class ReactNativeInstaller {
  beforeInstall() {
    // const tempProjectName = cliMgr.getProjectName();

    cliMgr.setProjectName(
      cliMgr.getProjectName().replace(/\W/g, ''),
    );

    // if (tempProjectName !== cliMgr.getProjectName()) {
    // eslint-disable-next-line max-len
    // this.logger.warning(`Project name has been renamed to '${this.cliMgr.projectName}'.\nRead more: https://github.com/facebook/react-native/issues/213.\n`);
    // }
  }
}
