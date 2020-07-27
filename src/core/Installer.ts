import util from 'util';
import cp from 'child_process';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import ora from 'ora';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import { LOG_PREFIX } from 'core/constants';
import InstallStepList from 'core/InstallStepList';


@injectable()
export default class Installer implements i.InstallerType {
  protected readonly installStepList = new InstallStepList();
  protected exec = util.promisify(cp.exec); // Wrap exec in promise
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

  /**
   * Hook onto a step with a custom function. The first parameter returns the current step ID.
   * This hook is executed after the 'cmd' property.
   *
   * If you need to execute a cmd line script after or during this method, you can use the
   * asynchronous 'exec' method that is available in the installer instance.
   */
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
  async useStepMethod(step: i.InstallStepIds): Promise<void> {}
  /* eslint-enable */


  /** Add and transform the installation steps */
  protected initSteps(): void {
    const baseSteps = container.getNamed<i.StepsType>(SERVICES.Steps, this.cliMgr.lang);

    for (const baseStep of baseSteps) {
      this.installStepList.add(baseStep);
    }
  }


  /**
   * HOOKS
   */

  /* eslint-disable @typescript-eslint/no-empty-function */

  /** Executed before initialization of an installer instance */
  protected beforeInit(): void {}
  /** Executed after initialization of an installer instance */
  protected afterInit(): void {}

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
        await this.exec(step.cmd);
      }

      // Execute function
      await this.useStepMethod(step.id);
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
