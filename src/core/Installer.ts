import util from 'util';
import cp from 'child_process';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import ora from 'ora';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import { LOG_PREFIX } from 'core/constants';
import getIocTargetName from 'core/utils/GetIocTargetName';


@injectable()
export default class Installer implements i.InstallerType {
  protected installSteps!: i.StepsType;
  protected exec = util.promisify(cp.exec); // Wrap exec in promise
  private spinner = ora();

  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) protected readonly logger: i.LoggerType,
  ) {}


  init(): void {
    this.beforeInit();

    const { installationConfig, lang, installBoilerplate } = this.cliMgr;
    let stepsName = getIocTargetName.steps(lang);

    if (installationConfig?.steps) {
      stepsName = getIocTargetName.steps(lang, installBoilerplate);
    }

    this.installSteps = container.getNamed<i.StepsType>(SERVICES.Steps, stepsName);

    this.afterInit();
  }

  /** Start installation process by iterating through all the installation steps */
  async install(): Promise<void> {
    // Debug
    if (this.cliMgr.isDebugging) {
      for (const step of this.installSteps) {
        this.logger.debug({
          msg: step.message,
          next: step.next?.message,
        });
      }
    }

    this.beforeInstall();

    for await (const step of this.installSteps) {
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
   * HOOKS
   */

  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

  /** Executed before initialization of an installer instance */
  protected beforeInit(): void {}
  /** Executed after initialization of an installer instance */
  protected afterInit(): void {}

  /** Executed before iterating the installation steps */
  protected beforeInstall(): void {}
  /** Executed after iterating the installation steps */
  protected afterInstall(): void {}

  /** Executed before every installation step. The first parameter returns the current step ID. */
  protected async beforeExecuteStep(step: i.InstallStepIds): Promise<void> {}
  /** Executed after every installation step. The first parameter returns the current step ID. */
  protected async afterExecuteStep(step: i.InstallStepIds): Promise<void> {}

  /* eslint-enable */


  /** Run the installation step */
  private async executeStep(step: i.InstallStepType): Promise<void> {
    try {
      await this.beforeExecuteStep(step.id);

      // Execute command line
      if (step.cmd) {
        await this.exec(step.cmd);
      }

      await this.afterExecuteStep(step.id);
    } catch (err) {
      this.error(err);
    }
  }

  private error(...reason: i.AnyArr): void {
    this.spinner.fail();
    this.logger.error(...reason);
  }
}
