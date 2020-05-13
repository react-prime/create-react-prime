import fs from 'fs';
import util from 'util';
import path from 'path';
import cp from 'child_process';
import createLogger, { ProgressEstimator } from 'progress-estimator';
import App from '../App';
import { TEXT, ORGANIZATION } from '../constants';
import { NodePackage } from '../types';
import InstallConfig from '../InstallConfig';

const writeFile = util.promisify(fs.writeFile);
const exec = util.promisify(cp.exec);

export default abstract class Installer {
  private installSteps: InstallStep[];
  private stepNum = 0;

  constructor() {
    const { projectName, installerName } = InstallConfig;

    this.installSteps = [
      {
        message: `🚚  Cloning ${installerName} into '${projectName}'...`,
        time: 3000,
        cmd: `git clone https://github.com/${ORGANIZATION}/${installerName}.git ${projectName}`,
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
    await this.install();

    // eslint-disable-next-line no-console
    console.log(
      `⚡️ ${TEXT.BOLD} Succesfully installed ${InstallConfig.installerName}! ${TEXT.DEFAULT}`,
    );
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

  protected async writeToPackage(npmPkg: NodePackage) {
    const { path } = App.getProjectNpmPackage();

    await writeFile(path, JSON.stringify(npmPkg, null, 2));
  }

  // Promisify spawns
  // util.promisfy doesn't work
  protected asyncSpawn(command: string, args: string[], options?: { path: string }) {
    const opts = {
      // Execute in given folder path with cwd
      cwd: options?.path || path.resolve(InstallConfig.projectName),
    };

    return new Promise((resolve, reject) => {
      cp.spawn(command, args, opts)
        .on('close', resolve)
        .on('error', reject);
    });
  };

  // Resets certain node package variables
  // Can provide a node package object as parameter
  protected async updatePackage(npmPkg?: NodePackage) {
    const { projectName } = InstallConfig;
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

    await this.writeToPackage(pkg);
  }

  // Override method
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected async cleanup(): Promise<void> {}


  // This runs through all the installation steps
  private async install() {
    // @ts-ignore type from createLogger is completely wrong
    const logger: ProgressEstimator = createLogger();

    const iter = async () => {
      const step = this.getStep();

      // Run the installation step
      await logger(this.installation(step), step.message, step.time);

      // Go to next step or end the installation
      if (this.stepNum++ >= this.installSteps.length - 1) {
        return;
      }

      await iter();
    };

    // Start iterating through the installation steps
    await iter();
  }

  // Single installation step
  private async installation(step: InstallStep) {
    try {
      if (step.cmd) {
        const step = this.getStep();

        // Execute command line
        await exec(step.cmd!);

        // Execute function if exists
        await step.fn?.();
      } else if (step.fn) {
        await step.fn();
      } else {
        console.error('Every install step is required to have either "cmd" or "fn".');
        App.failSafely();
      }
    } catch (err) {
      throw new Error(err);
    }
  };
}

type InstallStep = {
  message: string;
  time: number;
  cmd?: string;
  fn?: () => Promise<void>;
}
