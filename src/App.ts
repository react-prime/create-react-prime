import fs from 'fs';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import container from 'ioc';
import SERVICES from 'ioc/services';
import { TEXT } from './constants';

@injectable()
export default class App implements i.AppType {
  @inject(SERVICES.CLIMgr) private readonly cliMgr!: i.CLIMgrType;
  @inject(SERVICES.Logger) private readonly logger!: i.LoggerType;
  private installer!: i.InstallerType;


  async start(): Promise<void> {
    // Get installer for the type that was specified by the user
    const installerType = SERVICES.Installer[this.cliMgr.installType];
    this.installer = container.get<i.InstallerType>(installerType);

    // Prepare installer environment
    this.installer.init();

    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(this.cliMgr.projectName)) {
      this.logger.error(`directory '${this.cliMgr.projectName}' already exists.`);
    }

    // Start the installation process
    await this.installer.install();

    // eslint-disable-next-line no-console
    console.log(
      `⚡️ ${TEXT.BOLD}Succesfully installed ${this.cliMgr.installRepository}!${TEXT.DEFAULT}`,
    );

    process.exit();
  }
}
