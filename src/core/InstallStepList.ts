import * as i from 'types';

import InstallStep from 'core/InstallStep';


export default class InstallStepList extends Array<InstallStep> {
  constructor() {
    super();
  }


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
  addAfterStep(stepId: i.InstallStepIds, stepOptions: i.InstallStepOptions): this {
    const step = this.findStepById(stepId);

    // No step, just push into array
    if (!step) {
      this.add(stepOptions);
      return this;
    }

    // Add new step in array after the found step
    let iter = step.index;
    this.splice(++iter, 0, this.createStep(stepOptions, step.instance));

    // Update the current and next steps
    for (const j = iter; iter <= j + 1; iter++) {
      const step = this[iter];
      // Because of reordering, we can not use step.previous
      const prev = this[iter - 1];

      if (step) {
        this[iter] = this.createStep(step.options, prev, step.next);
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
