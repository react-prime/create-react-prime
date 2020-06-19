import fs from 'fs';
import { injectable, inject } from 'inversify';
import container, { AppType, CLIMgrType, LoggerType, InstallerType } from './ioc';
import SERVICES from './ioc/services';

@injectable()
export default class App implements AppType {
  private installer!: InstallerType;

  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: LoggerType,
  ) {
    // Get installer for the type that was specified by the user
    const installerType = SERVICES.Installer[this.cliMgr.installType];
    this.installer = container.get<InstallerType>(installerType);
  }

  exitSafely(...reason: string[]): void {
    this.logger.error(...reason);
    process.exit(1);
  }

  async start(): Promise<void> {
    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(this.cliMgr.projectName)) {
      this.exitSafely(`directory '${this.cliMgr.projectName}' already exists.`);
    }

    await this.installer.start();

    console.log('hello world', { this: this });

    process.exit();
  }
}
