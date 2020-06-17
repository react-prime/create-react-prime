import fs from 'fs';
import { REPOSITORIES, TEXT } from './constants';
import CLIMgr from './CLIMgr';
import InstallConfig from './InstallConfig';
import installers from './installers';
import Installer from './installers/Installer';

export default class App {
  private static _CLIMgr?: CLIMgr;
  private static installer?: Installer;

  constructor(cliMgr: CLIMgr) {
    App._CLIMgr = cliMgr;

    // This should not happen, ever. But if it does, the installation can not continue
    if (!App.cliMgr) {
      App.exitSafely(
        'Installation aborted. There was an error registering the \'Commander\' package.',
        'Please notify the maintainers of this package.',
      );
    }

    // Set config variables
    InstallConfig.installerName = REPOSITORIES[App.cliMgr!.installType];
    InstallConfig.projectName = App.cliMgr!.projectName || InstallConfig.installerName;

    // Generate installer instance
    App.installer = new installers[App.cliMgr!.installType];

    // Start installation
    this.init();
  }


  static get cliMgr(): CLIMgr | undefined {
    return this._CLIMgr;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debugLog(...str: any[]): void {
    if (App.cliMgr?.isDebugging) {
      App.log('DEBUG:', ...str);
    }
  }

  static exitSafely(...reason: string[]): void {
    App.log('ERR!', 'Installation aborted.', ...reason);
    process.exit(1);
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static log(prefix: string, ...str: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`${TEXT.RED}${prefix}${TEXT.DEFAULT}`, ...str);
  }

  private async init() {
    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(InstallConfig.projectName)) {
      App.exitSafely(`directory '${InstallConfig.projectName}' already exists.`);
    }

    // Run installation
    await App.installer?.start();

    // Stop Node process succesfully
    process.exit();
  }
}
