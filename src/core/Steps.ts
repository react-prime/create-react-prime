import * as i from 'types';
import { injectable, inject } from 'inversify';

import SERVICES from 'core/ioc/services';
import InstallStep from 'core/InstallStep';
import Logger from 'core/utils/Logger';

import STEPS from 'modules/steps/identifiers';


@injectable()
export default class Steps extends Array<InstallStep> implements i.StepsType {
  private readonly logger = new Logger();

  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
  ) {
    super();

    const { installationConfig, projectName } = cliMgr;
    const repoName = installationConfig?.repository;
    const vc = installationConfig?.vc;

    if (!vc) {
      this.logger.error('No version control config found.');
    }

    /**
     * Installation steps
     * These steps are required to run a proper installation
     */

    // Add clone project step
    this.add({
      id: STEPS.Clone,
      emoji: '🚚',
      message: {
        pending: `Cloning '${repoName}' into '${projectName}'...`,
        success: `Cloned '${repoName}' into '${projectName}'!`,
      },
      cmd: `git clone https://${vc!.host}/${vc!.owner}/${repoName}.git ${projectName}`,
    });

    // Steps from Steps modules
    this.add(...this.init());

    // Basic removal of unwanted files
    this.add({
      id: STEPS.Cleanup,
      emoji: '🧹',
      message: {
        pending: 'Cleaning up...',
        success: 'Cleaned up!',
      },
      cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
    });
  }


  get first(): InstallStep | undefined {
    return this[0];
  }

  get last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  /**
   * Add any additional steps with this method. These steps will be executed after cloning,
   * and before cleaning up (the last step)
   */
  init(): i.InstallStepOptions[] { return []; }

  /** Add a step at the end of the list */
  add(...stepOptions: i.InstallStepOptions[]): this {
    for (const step of stepOptions) {
      this.push(this.createStep(step));
    }

    return this;
  }


  /** Step factory */
  private createStep(
    stepOptions: i.InstallStepOptions, ...[prev, next]: [InstallStep?, InstallStep?]
  ): InstallStep {
    prev = prev || this.last;
    const step = new InstallStep(stepOptions, prev, next);

    return step;
  }
}
