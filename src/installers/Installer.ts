import fs from 'fs';
import util from 'util';
import path from 'path';
import { injectable, inject } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import SERVICES from '../ioc/services';
import container, { InstallerType, CLIMgrType, LoggerType, AppType } from '../ioc';
import InstallStepList from '../InstallStepList';
import { INSTALL_STEP, ORGANIZATION } from '../constants';
import { PackageJson } from '../types';

// We need to inject lazily to prevent circular dependency (App > Installer > App)
const { lazyInject } = getDecorators(container);

// Wrap utils in promise
const writeFile = util.promisify(fs.writeFile);

@injectable()
export default class Installer implements InstallerType {
  @inject(SERVICES.CLIMgr) protected readonly cliMgr!: CLIMgrType;
  @inject(SERVICES.Logger) protected readonly logger!: LoggerType;
  @lazyInject(SERVICES.App) private readonly app!: AppType;
  protected installStepList = new InstallStepList();

  init(): void {
    this.initSteps();
  }


  /**
   * Start installation process by iterating through all the installation steps
   */
  async install(): Promise<void> {
    // Debug
    this.installStepList.map((step) => {
      this.logger.debug({
        msg: step.message,
        next: step.next?.message,
      });
    });
  }


  /**
   * Add the basic installation steps. Can be overloaded to add or modify steps.
   */
  protected initSteps(): void {
    const { projectName,installRepository } = this.cliMgr;

    this.installStepList
      .add({
        id: INSTALL_STEP.CLONE,
        emoji: '🚚',
        message: `Cloning '${installRepository}' into '${projectName}'...`,
        cmd: `git clone https://github.com/${ORGANIZATION}/${installRepository}.git ${projectName}`,
      })
      .add({
        id: INSTALL_STEP.UPDATE_PACKAGE,
        emoji: '✏️ ',
        message: 'Updating package...',
        fn: this.updatePackage.bind(this),
      })
      .add({
        id: INSTALL_STEP.NPM_INSTALL,
        emoji: '📦',
        message: 'Installing packages...',
        cmd: `npm --prefix ${projectName} install`,
      })
      .add({
        id: INSTALL_STEP.CLEANUP,
        emoji: '🧹',
        message: 'Cleaning up...',
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
      });
  }


  /**
   * Returns the package.json as JS object and its directory path
   */
  protected getProjectNpmPackage(): { path: string; json: PackageJson } {
    const projectPkgPath = path.resolve(`${this.cliMgr.projectName}/package.json`);
    const pkgFile = fs.readFileSync(projectPkgPath, 'utf8');

    if (!pkgFile) {
      this.app.exitSafely(`No valid NPM package found in ${path.resolve(this.cliMgr.projectName)}`);
    }

    return {
      path: projectPkgPath,
      json: JSON.parse(pkgFile),
    };
  }

  protected async writeToPackage(npmPkg: PackageJson): Promise<void> {
    const { path } = this.getProjectNpmPackage();

    await writeFile(path, JSON.stringify(npmPkg, null, 2));
  }

  /**
   * Updates node package variables
   * Can provide a node package object as parameter
   */
  protected async updatePackage(npmPkg?: PackageJson): Promise<void> {
    const { projectName } = this.cliMgr;
    const pkg = npmPkg || this.getProjectNpmPackage().json;

    // Overwrite boilerplate defaults
    pkg.name = projectName;
    pkg.version = '0.0.1';
    pkg.description = `Code for ${projectName}.`;
    pkg.author = 'Label A [labela.nl]';
    pkg.keywords = [];

    if (pkg.repository != null && typeof pkg.repository === 'object') {
      pkg.repository.url = '';
    }

    await this.writeToPackage(pkg);
  }
}
