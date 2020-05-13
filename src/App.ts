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

    // Set config variables
    InstallConfig.installerName = REPOSITORIES[intf!.getInstallType()];
    InstallConfig.projectName = intf!.getArgs()[ARG.PROJECT_NAME] || InstallConfig.installerName;

    // Generate installer instance
    const installType = App.getInterfaceMgr()!.getInstallType();
    App.installer = new installers[installType]();

    // Start installation
    this.init();
  }

  static getInterfaceMgr() {
    return this.interfaceMgr;
  }

  static getProjectNpmPackage() {
    const projectPkgPath = path.resolve(`${InstallConfig.projectName}/package.json`);
    const pkgFile = fs.readFileSync(projectPkgPath, 'utf8');

    if (!pkgFile) {
      console.error('No valid NPM package found in getProjectNpmPackage');
      App.failSafely();
    }

    return {
      path: projectPkgPath,
      json: JSON.parse(pkgFile),
    };
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
