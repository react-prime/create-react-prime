import fs from 'fs';
import path from 'path';
import { ARG, REPOSITORIES } from './constants';
import InterfaceMgr from './InterfaceMgr';
import InstallConfig from './InstallConfig';
import installers from './installers';
import Installer from './installers/Installer';

export default class App {
  private static interfaceMgr?: InterfaceMgr;
  private static installer?: Installer;

  constructor(appInterface: InterfaceMgr) {
    App.interfaceMgr = appInterface;

    const intf = App.getInterfaceMgr();
    const installType = intf!.getInstallType();

    // Set config variables
    InstallConfig.installerName = REPOSITORIES[installType];
    InstallConfig.projectName = intf!.getArgs()[ARG.PROJECT_NAME] || InstallConfig.installerName;

    // Generate installer instance
    App.installer = new installers[installType];

    // Start installation
    this.init();
  }

  static getInterfaceMgr() {
    return this.interfaceMgr;
  }

  // This allows Node to exit naturally without scheduling new tasks
  static failSafely() {
    process.exitCode = 1;
  }

  private async init() {
    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(InstallConfig.projectName)) {
      console.error(`Error: directory '${InstallConfig.projectName}' already exists.`);
      App.failSafely();
    }

    // run installation
    await App.installer?.start();

    // Stop Node process succesfully
    process.exit();
  }
}
