import util from 'util';
import cp from 'child_process';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import ora from 'ora';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import { LOG_PREFIX } from 'core/constants';
import InstallStepList from 'core/InstallStepList';


// Wrap utils in promise
const exec = util.promisify(cp.exec);


@injectable()
export default class Installer implements i.InstallerType {
  protected readonly installStepList = new InstallStepList();
  private spinner = ora();

  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) protected readonly logger: i.LoggerType,
  ) {}


  init(): void {
    this.beforeInit();

    this.initSteps();

    this.afterInit();
  }

  /** Start installation process by iterating through all the installation steps */
  async install(): Promise<void> {
    // Debug
    if (this.cliMgr.isDebugging) {
      for (const step of this.installStepList) {
        this.logger.debug({
          msg: step.message,
          next: step.next?.message,
        });
      }
    }

    this.beforeInstall();

    for await (const step of this.installStepList) {
      const { skipSteps } = this.cliMgr;
      const skipStep = skipSteps?.some((id) => id === step?.id);

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
    }

    this.afterInstall();
  }


  /** Add and transform the installation steps */
  protected initSteps(): void {
    this.beforeStepsInit();

    const baseSteps = container.getNamed<i.StepsType>(SERVICES.Steps, this.cliMgr.lang);

    for (const baseStep of baseSteps) {
      // Convert the name of a function into the reference of the function
      if (typeof baseStep.fn === 'string') {
        // Errors, because using 'string' to index 'this' returns 'any', but we don't care
        // @ts-ignore
        const fn = this[baseStep.fn];

        // Bind 'this' to the installer instance
        if (typeof fn === 'function') {
          baseStep.fn = fn.bind(this);
        }
      }

      this.installStepList.add(baseStep);
    }

    this.afterStepsInit();
  }


  /**
   * HOOKS
   */

  /* eslint-disable @typescript-eslint/no-empty-function */

  /** Executed before initialization of an installer instance */
  protected beforeInit(): void {}
  /** Executed after initialization of an installer instance */
  protected afterInit(): void {}

  /** Executed before initialization of the installer steps list */
  protected beforeStepsInit(): void {}
  /** Executed after initialization of the installer steps list */
  protected afterStepsInit(): void {}

  /** Executed before iterating the installation steps */
  protected beforeInstall(): void {}
  /** Executed after iterating the installation steps */
  protected afterInstall(): void {}

  /** Executed before every installation step */
  protected beforeExecuteStep(): void {}
  /** Executed after every installation step */
  protected afterExecuteStep(): void {}

  /* eslint-enable */


  /** Run the installation step */
  private async executeStep(step: i.InstallStepType): Promise<void> {
    this.beforeExecuteStep();

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

    this.afterExecuteStep();
  }

  private error(...reason: i.AnyArr): void {
    this.spinner.fail();
    this.logger.error(...reason);
  }
}
