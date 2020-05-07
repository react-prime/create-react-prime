import fs from 'fs';
import path from 'path';
import { BoilerplateConfig } from './types';
import { ARG } from './constants';
import boilerplateConfig from './boilerplateConfig.json';
import installers from './installers';
import InterfaceMgr from './InterfaceMgr';

export default class App {
  private static interfaceMgr: InterfaceMgr;
  private static installConfig: BoilerplateConfig;

  constructor(appInterface: InterfaceMgr) {
    App.interfaceMgr = appInterface;

    this.init();
  }

  static getProgram() {
    return this.interfaceMgr;
  }

  static getInstallConfig() {
    return App.installConfig;
  }

  static setProjectName(name: string) {
    App.installConfig.projectName = name;
  }

  static getProjectNpmPackage() {
    const projectPkgPath = path.resolve(`${App.installConfig.projectName}/package.json`);
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

  static getBoilerplateData() {
    return boilerplateConfig[this.interfaceMgr.getInstallType()];
  }

  // This allows Node to exit naturally without scheduling new tasks
  private static failSafely() {
    process.exitCode = 1;
  }

  private init() {
    this.setVars();


    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(App.installConfig.projectName)) {
      console.error(`Error: directory '${App.installConfig.projectName}' already exists.`);
      App.failSafely();
    }


    // run installation
    const installer = new installers[App.interfaceMgr.getInstallType()];

    installer
      .start()
      .finally(process.exit);
  }

  private setVars() {
    App.installConfig = {
      owner: boilerplateConfig.owner,
      boilerplateData: App.getBoilerplateData(),
      projectName: App.getProgram().getArgs()[ARG.PROJECT_NAME] || App.getBoilerplateData().name,
    };
  }
}
