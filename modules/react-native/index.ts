import Installer from 'core/decorators/Installer';

import ScriptsStep from './steps/scriptsStep';


@Installer({
  name: 'react-native',
  repositoryUrl: '',
  // prompts: [],
  steps: [ScriptsStep],
})
export default class ReactNativeInstaller {
  // private cliMgr = new CLIMgr();
  // private logger = new Logger();

  beforeInstall() {
    // this.cliMgr.setProjectName(
    //   this.cliMgr.projectName.replace(/\W/g, '')
    // );

    // if (diff) {
    //   this.logger.warning(`Project name has been renamed to '${this.cliMgr.projectName}'.\nRead more: https://github.com/facebook/react-native/issues/213.\n`); // eslint-disable-line max-len
    // }
    console.log('before install hook');
  }
}
