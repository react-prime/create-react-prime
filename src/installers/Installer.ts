import fs from 'fs';
import { exec } from 'child_process';
import createLogger, { ProgressEstimator } from 'progress-estimator';
import App from '../App';
import { TEXT } from '../constants';
import { NodePackage } from '../types';

export default abstract class Installer {
  private installSteps: InstallStep[];
  private stepNum = 0;
  // @ts-ignore type from createLogger is completely wrong
  private logger: ProgressEstimator = createLogger();

  constructor() {
    const { owner, boilerplateData, projectName } = App.getInstallConfig();

    this.installSteps = [
      {
        cmd: `git clone https://github.com/${owner}/${boilerplateData.name}.git ${projectName}`,
        message: `🚚  Cloning ${boilerplateData.name} into '${projectName}'...`,
        time: 3000,
      },
      {
        cmd: `npm --prefix ${projectName} install`,
        message: '📦  Installing packages...',
        time: 40000,
      },
      {
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
        fn: this.updatePackage,
        message: '🔨  Preparing...',
        time: 50,
      },
    ];
  }

  // Starts the installation process. This is async.
  // Returns the installation promise.
  async start() {
    return this.install()
      .finally(() => {
        // eslint-disable-next-line no-console
        console.log(
          `⚡️ ${TEXT.BOLD} Succesfully installed ${App.getInstallConfig().boilerplateData.name}! ${TEXT.DEFAULT}`,
        );
      });
  }


  // Returns the current installation step
  protected getStep() {
    return this.installSteps[this.stepNum];
  }

  // Installers can add additional installation steps with this function
  protected addInstallStep(step: InstallStep, atIndex?: number) {
    if (typeof atIndex === 'number') {
      this.installSteps.splice(atIndex, 0, step);
    } else {
      this.installSteps.push(step);
    }
  }

  // Resets certain node package variables
  // Can provide a node package object as parameter
  protected async updatePackage(npmPkg?: NodePackage) {
    const { projectName } = App.getInstallConfig();
    const { path: projectPkgPath } = App.getProjectNpmPackage();

    let pkg: NodePackage;

    if (npmPkg) {
      pkg = npmPkg;
    } else {
      pkg = App.getProjectNpmPackage().json;
    }

    // Overwrite boilerplate defaults
    pkg.name = projectName;
    pkg.version = '0.0.1';
    pkg.description = `Code for ${projectName}.`;
    pkg.author = 'Label A [labela.nl]';
    pkg.keywords = [];

    if (typeof pkg.repository === 'object') {
      pkg.repository.url = '';
    }

    fs.writeFileSync(projectPkgPath, JSON.stringify(pkg, null, 2));
  }


  // This runs through all the installation steps
  private async install() {
    return new Promise((resolve) => {
      const run = async () => {
        const step = this.getStep();

        await this.logger(this.installation(step), step.message, step.time);

        if (this.stepNum++ < this.installSteps.length - 1) {
          run();
        } else {
          resolve();
        }
      };

      run();
    });
  }

  // Single installation step
  private installation(step: InstallStep) {
    return new Promise((resolve, reject) => {
      exec(step.cmd, null, async (err) => {
        const step = this.getStep();

        if (err) {
          reject(err);
          throw new Error(err.message);
        }

        try {
          if (typeof step.fn === 'function') {
            await step.fn();
          }
        } catch (err) {
          reject(err);
          throw new Error(err);
        }

        resolve();
      });
    });
  }
}

type InstallStep = {
  cmd: string;
  message: string;
  time: number;
  fn?: () => Promise<void>;
}
