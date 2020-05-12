import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
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
        message: `🚚  Cloning ${boilerplateData.name} into '${projectName}'...`,
        time: 3000,
        cmd: `git clone https://github.com/${owner}/${boilerplateData.name}.git ${projectName}`,
      },
      {
        message: '✏️   Updating package...',
        time: 10,
        fn: this.updatePackage.bind(this),
      },
      {
        message: '📦  Installing packages...',
        time: 40000,
        cmd: `npm --prefix ${projectName} install`,
      },
      {
        message: '🧹  Cleaning up...',
        time: 15,
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
        fn: this.cleanup.bind(this),
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

  protected writeToPackage(npmPkg: NodePackage) {
    const { path: projectPkgPath } = App.getProjectNpmPackage();

    fs.writeFileSync(projectPkgPath, JSON.stringify(npmPkg, null, 2));
  }

  // Creates promise-wrapped spawns
  protected asyncSpawn(command: string, args: string[], options?: { path: string }) {
    const { projectName } = App.getInstallConfig();

    const opts = {
      // Execute in given folder path with cwd
      cwd: options?.path || path.resolve(projectName),
    };

    return new Promise((resolve, reject) => {
      spawn(command, args, opts)
        .on('close', resolve)
        .on('error', reject);
    });
  };

  // Resets certain node package variables
  // Can provide a node package object as parameter
  protected async updatePackage(npmPkg?: NodePackage) {
    const { projectName } = App.getInstallConfig();
    const pkg: NodePackage = npmPkg || App.getProjectNpmPackage().json;

    // Overwrite boilerplate defaults
    pkg.name = projectName;
    pkg.version = '0.0.1';
    pkg.description = `Code for ${projectName}.`;
    pkg.author = 'Label A [labela.nl]';
    pkg.keywords = [];

    if (typeof pkg.repository === 'object') {
      pkg.repository.url = '';
    }

    this.writeToPackage(pkg);
  }

  // Override method
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected async cleanup(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }


  // This runs through all the installation steps
  private async install() {
    return new Promise((resolve) => {
      const iter = async () => {
        const step = this.getStep();

        // Run the installation step
        await this.logger(this.installation(step), step.message, step.time);

        // Go to next step or end the installation
        if (this.stepNum++ < this.installSteps.length - 1) {
          iter();
        } else {
          resolve();
        }
      };

      // Start iterating through the installation steps
      iter();
    });
  }

  // Single installation step
  private installation(step: InstallStep) {
    return new Promise(async (resolve, reject) => {
      if (step.cmd) {
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
      } else if (step.fn) {
        step.fn()
          .then(resolve)
          .catch(reject);
      } else {
        reject('Every install step is required to have either "cmd" or "fn".');
      }
    });
  }
}

type InstallStep = {
  message: string;
  time: number;
  cmd?: string;
  fn?: () => Promise<void>;
}
