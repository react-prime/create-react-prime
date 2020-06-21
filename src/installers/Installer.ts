import fs from 'fs';
import util from 'util';
import path from 'path';
import cp from 'child_process';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import ora from 'ora';
import SERVICES from 'ioc/services';
import { INSTALL_STEP, ORGANIZATION, LOG_PREFIX } from '../constants';
import InstallStep from '../InstallStep';


// Wrap utils in promise
const writeFile = util.promisify(fs.writeFile);
const exec = util.promisify(cp.exec);


@injectable()
export default class Installer implements i.InstallerType {
  @inject(SERVICES.CLIMgr) protected readonly cliMgr!: i.CLIMgrType;
  @inject(SERVICES.Logger) protected readonly logger!: i.LoggerType;
  @inject(SERVICES.InstallStepList) protected installStepList!: i.InstallStepListType;
  private spinner = ora();


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

    let step = this.installStepList.first;

    const iter = async () => {
      // Ends the installation
      if (!step) {
        return;
      }

      const skipSteps = await this.cliMgr.skipSteps;
      // "this" in the step instance will be a reference to the Installer instance
      // We fix this by binding the current step to this function
      const skipStep = skipSteps?.some(step.hasId.bind(step));

      if (!skipStep) {
        this.spinner = ora(step.message.pending);
        this.spinner.prefixText = LOG_PREFIX;
        this.spinner.start();

        try {
        // Run the installation step
          await this.executeStep(step);

          this.spinner.succeed(step.message.success);
        } catch (err) {
          this.error(err);
        }
      } else {
        this.logger.warning(`Skipped '${step.message.pending}'`);
      }

      // Go to next step
      step = step.next;

      await iter();
    };

    // Start iterating through the installation steps
    await iter();
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
        message: {
          pending: `Cloning '${installRepository}' into '${projectName}'...`,
          success: `Cloned '${installRepository}' into '${projectName}'!`,
        },
        cmd: `git clone https://github.com/${ORGANIZATION}/${installRepository}.git ${projectName}`,
      })
      .add({
        id: INSTALL_STEP.UPDATE_PACKAGE,
        emoji: '✏️ ',
        message: {
          pending: 'Updating package.json...',
          success: 'Updated package.json!',
        },
        fn: this.updatePackage.bind(this),
      })
      .add({
        id: INSTALL_STEP.NPM_INSTALL,
        emoji: '📦',
        message: {
          pending: 'Installing packages...',
          success: 'Installed packages!',
        },
        cmd: `npm --prefix ${projectName} install`,
      })
      .add({
        id: INSTALL_STEP.CLEANUP,
        emoji: '🧹',
        message: {
          pending: 'Cleaning up...',
          success: 'Cleaned up!',
        },
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
      });
  }

  /**
   * Returns the package.json as JS object and its directory path
   */
  protected getProjectNpmPackage(): { path: string; json: i.PackageJson } {
    const projectPkgPath = path.resolve(`${this.cliMgr.projectName}/package.json`);
    const pkgFile = fs.readFileSync(projectPkgPath, 'utf8');

    if (!pkgFile) {
      this.error(`No valid NPM package found in ${path.resolve(this.cliMgr.projectName)}`);
    }

    return {
      path: projectPkgPath,
      json: JSON.parse(pkgFile),
    };
  }

  /**
   * Async overwrite project's package.json
   * @param npmPkg package.json as JS object
   */
  protected async writeToPackage(npmPkg: i.PackageJson): Promise<void> {
    const { path } = this.getProjectNpmPackage();

    await writeFile(path, JSON.stringify(npmPkg, null, 2));
  }

  /**
   * Updates node package variables
   * @param npmPkg package.json as JS object
   */
  protected async updatePackage(npmPkg?: i.PackageJson): Promise<void> {
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

  /**
   * Promisify spawns
   * util.promisfy doesn't work
   */
  protected asyncSpawn(command: string, args: string[], options?: { path: string }): Promise<void> {
    const opts: cp.SpawnOptionsWithoutStdio = {
      // Execute in given folder path with cwd
      cwd: options?.path || path.resolve(this.cliMgr.projectName),
    };

    return new Promise((resolve, reject) => {
      cp.spawn(command, args, opts)
        .on('close', resolve)
        .on('error', reject);
    });
  }


  /**
   * Run the installation step
   */
  private async executeStep(step: InstallStep): Promise<void> {
    try {
      // Execute command line
      if (step.cmd) {
        await exec(step.cmd);
      }

      // Execute function
      if (step.fn) {
        await step.fn();
      }
    } catch (err) {
      this.error(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private error(...reason: any[]): void {
    this.spinner.fail();
    this.logger.error(...reason);
  }
}
