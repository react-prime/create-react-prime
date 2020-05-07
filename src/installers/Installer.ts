import { exec } from 'child_process';
import createLogger, { ProgressEstimator } from 'progress-estimator';
import App from '../App';
import { TEXT } from '../constants';

export default abstract class Installer {
  private installSteps: InstallStep[];
  private stepNum = 0;
  // @ts-ignore type from createLogger is completely wrong
  private logger: ProgressEstimator = createLogger();

  constructor() {
    const projectName = App.getProjectName();
    const { owner, boilerplate } = App.getInstallConfig();

    this.installSteps = [
      {
        cmd: `git clone https://github.com/${owner}/${boilerplate.name}.git ${projectName}`,
        message: `🚚  Cloning ${boilerplate.name} into '${projectName}'...`,
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

  async start() {
    return this.install()
      .finally(() => {
        // eslint-disable-next-line no-console
        console.log(
          `⚡️ ${TEXT.BOLD} Succesfully installed ${App.getInstallConfig().boilerplate.name}! ${TEXT.DEFAULT}`,
        );
      });
  }

  protected getStep() {
    return this.installSteps[this.stepNum];
  }

  protected addInstallStep(step: InstallStep, atIndex?: number) {
    if (typeof atIndex === 'number') {
      this.installSteps.splice(atIndex, 0, step);
    } else {
      this.installSteps.push(step);
    }
  }

  protected async install() {
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

  protected updatePackage() {
    // TODO
  }

  private installation(step: InstallStep) {
    return new Promise((resolve, reject) => {
      return exec(step.cmd, null, (err) => {
        const step = this.getStep();

        if (err) {
          reject(err);
          throw new Error(err.message);
        }

        try {
          if (typeof step.fn === 'function') {
            step.fn();
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
  fn?: Function;
}
