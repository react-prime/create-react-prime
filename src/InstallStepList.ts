import * as i from 'types';
import { inject, injectable, decorate } from 'inversify';
import SERVICES from 'ioc/services';
import InstallStep from './InstallStep';
import { INSTALL_STEP } from './constants';


// Make Array constructor injectable
// https://github.com/inversify/InversifyJS/issues/297#issuecomment-234574834
decorate(injectable(), Array);


@injectable()
export default class InstallStepList extends Array<InstallStep> implements i.InstallStepListType {
  @inject(SERVICES.Logger) private readonly logger!: i.LoggerType;

  get first(): InstallStep | undefined {
    return this[0];
  }

  get last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  /** Add a step at the end of the list */
  add(stepOptions: i.InstallStepOptions): this {
    this.push(this.createStep(stepOptions));

    return this;
  }

  /**
   * Add a step after the given step ID
   */
  addAfterStep(stepId: i.InstallStepId, stepOptions: i.InstallStepOptions): this {
    const step = this.findStepById(stepId);

    // No step, just push into array
    if (!step) {
      this.add(stepOptions);
      return this;
    }

    let iter = step.index;

    // Add new step in array after the found step
    this.splice(++iter, 0, this.createStep(stepOptions, step.instance));

    // Update the current and next steps
    for (let j = iter; iter <= j + 1; iter++) {
      const step = this[iter];
      // Because of reordering, we can not use step.previous
      const prev = this[iter - 1];

      if (step) {
        this[iter] = this.createStep(step.options, prev, step.next);
      }
    }

    return this;
  }

  /** Modify options of a step */
  modifyStep(stepId: i.InstallStepId, stepOptions: Partial<i.InstallStepOptions>): this {
    const step = this.findStepById(stepId);

    if (!step) {
      this.logger.warning(`${this.modifyStep.name}: No step found for '${stepId}'.`);
      return this;
    }

    const options = {
      ...step.instance.options,
      ...stepOptions,
    };

    this[step.index] = this.createStep(options, step.instance.previous, step.instance.next);

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

  /** Find a step from this list by ID. Returns its instance and the index. */
  private findStepById(stepId: i.InstallStepId): { instance: InstallStep, index: number } | undefined {
    let step = this.first;
    let i = 0;

    // Empty list
    if (!step) {
      return;
    }

    // Loop through the array until we find the step
    while (step.id !== INSTALL_STEP[stepId]) {
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
}
