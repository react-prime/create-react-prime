import InstallStep, { InstallStepOptions } from './InstallStep';
import INSTALL_STEP from './InstallStep/steps';
import { InstallStepId } from './types';

export default class InstallSteps extends Array<InstallStep> {
  get first(): InstallStep | undefined {
    return this[0];
  }

  get last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  /** Add a step at the end of the list */
  add(stepOptions: InstallStepOptions): this {
    this.push(this.createStep(stepOptions));

    return this;
  }

  /**
   * Add a step after the given step ID
   */
  addAfterStep(stepId: InstallStepId, stepOptions: InstallStepOptions): this {
    const step = this.findStepById(stepId);

    // No step, just push into array
    if (!step) {
      this.add(stepOptions);
      return this;
    }

    let i = step.index;

    // Add new step in array after the found step
    this.splice(++i, 0, this.createStep(stepOptions));

    // Update the current and next steps
    for (let j = i; i <= j + 1; i++) {
      const step = this[i];
      // Because of reordering, we can not use step.previous
      const prev = this[i - 1];

      if (step) {
        this[i] = this.createStep(step.options, prev, step.next);
      }
    }

    return this;
  }

  /** Modify options of a step */
  modifyStep(stepId: InstallStepId, stepOptions: Partial<InstallStepOptions>): this {
    const step = this.findStepById(stepId);

    if (!step) {
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
  private createStep(stepOptions: InstallStepOptions, ...steps: (InstallStep | undefined)[]): InstallStep {
    const prev = steps[0] || this.last;
    const step = new InstallStep(stepOptions, prev, steps[1]);

    return step;
  }

  /** Find a step from this list by ID. Returns its instance and the index. */
  private findStepById(stepId: InstallStepId): { instance: InstallStep, index: number } | undefined {
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
