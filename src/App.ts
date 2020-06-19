import fs from 'fs';
import { injectable, inject } from 'inversify';
import container, { AppType, CLIMgrType, LoggerType, InstallerType } from './ioc';
import SERVICES from './ioc/services';
import { TEXT } from './constants';

@injectable()
export default class App implements AppType {
  @inject(SERVICES.CLIMgr) private readonly cliMgr!: CLIMgrType;
  @inject(SERVICES.Logger) private readonly logger!: LoggerType;
  private installer!: InstallerType;

  async start(): Promise<void> {
    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(this.cliMgr.projectName)) {
      this.logger.error(`directory '${this.cliMgr.projectName}' already exists.`);
    }

    // Get installer for the type that was specified by the user
    const installerType = SERVICES.Installer[this.cliMgr.installType];
    this.installer = container.get<InstallerType>(installerType);

    this.installer.init();
    await this.installer.install();

    // console.log(this);

    // eslint-disable-next-line no-console
    console.log(
      `⚡️ ${TEXT.BOLD}Succesfully installed ${this.cliMgr.installRepository}!${TEXT.DEFAULT}`,
    );

    process.exit();
  }
}
