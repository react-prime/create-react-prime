import fs from 'fs';
import util from 'util';
import path from 'path';
import cp from 'child_process';
import ora from 'ora';
import { TEXT, ORGANIZATION } from '../constants';
import { PackageJson } from '../types';
import InstallConfig from '../InstallConfig';
import InstallStep from '../InstallStep';
import INSTALL_STEP from '../InstallStep/steps';
import InstallSteps from '../InstallSteps';

// Wrap utils in promise
const writeFile = util.promisify(fs.writeFile);
const exec = util.promisify(cp.exec);

export default abstract class Installer {
  protected installSteps = new InstallSteps();

  constructor() {
    const { projectName, installerName } = InstallConfig;

    this.installSteps
      .add({
        id: INSTALL_STEP.CLONE,
        emoji: '🚚',
        message: `Cloning ${installerName} into '${projectName}'...`,
        cmd: `git clone https://github.com/${ORGANIZATION}/${installerName}.git ${projectName}`,
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
        fn: this.cleanup.bind(this),
      });
  }


  /**
   * Starts the installation process. This is async.
   */
  async start(): Promise<void> {
    await this.install();

    // eslint-disable-next-line no-console
    console.log(
      `⚡️ ${TEXT.BOLD} Succesfully installed ${InstallConfig.installerName}! ${TEXT.DEFAULT}`,
    );
  }


  /**
   * Returns the package.json as JS object and its directory path
   */
  protected getProjectNpmPackage(): { path: string; json: PackageJson } {
    const projectPkgPath = path.resolve(`${InstallConfig.projectName}/package.json`);
    const pkgFile = fs.readFileSync(projectPkgPath, 'utf8');

    if (!pkgFile) {
      throw new Error(`No valid NPM package found in ${path.resolve(InstallConfig.projectName)}`);
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
   * Promisify spawns
   * util.promisfy doesn't work
   */
  protected asyncSpawn(command: string, args: string[], options?: { path: string }): Promise<void> {
    const opts = {
      // Execute in given folder path with cwd
      cwd: options?.path || path.resolve(InstallConfig.projectName),
    };

    return new Promise((resolve, reject) => {
      cp.spawn(command, args, opts)
        .on('close', resolve)
        .on('error', reject);
    });
  }

  /**
   * Updates node package variables
   * Can provide a node package object as parameter
   */
  protected async updatePackage(npmPkg?: PackageJson): Promise<void> {
    const { projectName } = InstallConfig;
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
   * Can be used/overwritten by an extended installer. Runs after all the installation steps succeed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected async cleanup(): Promise<void> {}


  /**
   * Loop through all the installation steps
   */
  private async install() {
    let step = this.installSteps.first;

    const iter = async () => {
      // Ends the installation
      if (!step) {
        return;
      }

      const spinner = ora(step.message).start();

      try {
        // Run the installation step
        await this.executeStep(step);

        spinner.succeed();
      } catch (err) {
        spinner.fail();
      }

      // Go to next step
      step = step.next;

      await iter();
    };

    // Start iterating through the installation steps
    await iter();
  }

  /**
   * Run the installation step
   */
  private async executeStep(step: InstallStep) {
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
      throw new Error(err);
    }
  }
}
