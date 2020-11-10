import * as i from 'types';
import { injectable, inject } from 'inversify';

import SERVICES from 'core/ioc/services';
import InstallStep from 'core/InstallStep';

import STEPS from 'modules/steps/identifiers';


@injectable()
export default class Steps extends Array<InstallStep> implements i.StepsType {
  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: i.LoggerType,
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

  /** Add a step after the given step ID */
  addAfterStep(stepId: i.InstallStepIds, stepOptions: i.InstallStepOptions): this {
    const step = this.findStepById(stepId);

    // No step found, just push into array
    if (!step) {
      this.add(stepOptions);
      return this;
    }

    // Add new step in array after the found step
    let index = step.index + 1;
    this.splice(index, 0, this.createStep(stepOptions, step.instance));

    // Update the current and next steps
    for (const startIndex = index; index <= startIndex + 1; index++) {
      const step = this[index];
      // Because of reordering, we can not use step.previous
      const prev = this[index - 1];

      if (step) {
        this[index] = this.createStep(step.options, prev, step.next);
      }
    }

    return this;
  }

  /** Find a step from this list by ID. Returns its instance and the index. */
  findStepById(stepId: i.InstallStepIds): { instance: InstallStep, index: number } | undefined {
    let step = this.first;
    let i = 0;

    // Empty list
    if (!step) {
      return;
    }

    // Loop through the array until we find the step
    while (step.id !== stepId) {
      // End of the list
      if (!step.next) {
        return;
      }

      step = step.next;
      i++;
    }

    return {
      instance: step,
      index: i,
    };
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
