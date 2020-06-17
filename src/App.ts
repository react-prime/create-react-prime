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
      throw new Error(
        `Installation aborted. There was an error registering the \'Commander\' package.
        Please notify the maintainers of this package.`,
      );
    }

    // Set config variables
    InstallConfig.installerName = REPOSITORIES[App.cliMgr.installType];
    InstallConfig.projectName = App.cliMgr.projectName || InstallConfig.installerName;

    // Generate installer instance
    App.installer = new installers[App.cliMgr.installType];

    // Start installation
    this.init();
  }


  static get cliMgr(): CLIMgr | undefined {
    return this._CLIMgr;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static log(...str: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`${TEXT.RED}DEBUG:${TEXT.DEFAULT}`, ...str);
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
