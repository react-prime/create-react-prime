import fs from 'fs';
import { ARG, REPOSITORIES } from './constants';
import InterfaceMgr from './InterfaceMgr';
import InstallConfig from './InstallConfig';
import installers from './installers';
import Installer from './installers/Installer';

export default class App {
  private static _interfaceMgr?: InterfaceMgr;
  private static installer?: Installer;

  constructor(appInterfaceMgr: InterfaceMgr) {
    App._interfaceMgr = appInterfaceMgr;

    const { interfaceMgr } = App;

    // This should not happen, ever. But if it does, the installation can not continue
    if (!interfaceMgr) {
      throw new Error(
        `Installation aborted. There was an error registering the \'Commander\' package.
        Please notify the maintainers of this package.`,
      );
    }

    const installType = interfaceMgr.installType;

    // Set config variables
    InstallConfig.installerName = REPOSITORIES[installType];
    InstallConfig.projectName = interfaceMgr.args[ARG.PROJECT_NAME] || InstallConfig.installerName;

    // Generate installer instance
    App.installer = new installers[installType];

    // Start installation
    this.init();
  }


  static get interfaceMgr(): InterfaceMgr | undefined {
    return this._interfaceMgr;
  }


  private async init() {
    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(InstallConfig.projectName)) {
      throw new Error(`directory '${InstallConfig.projectName}' already exists.`);
    }

    // run installation
    await App.installer?.start();

    // Stop Node process succesfully
    process.exit();
  }
}
