import InstallStep, { InstallStepOptions } from './InstallStep';
import INSTALL_STEP from './InstallStep/steps';

export default class InstallSteps extends Array<InstallStep> {
  get first(): InstallStep | undefined {
    return this[0];
  }

  get last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  add(stepOptions: InstallStepOptions): this {
    this.push(this.createStep(stepOptions));

    return this;
  }

  addAfterStep(stepId: keyof typeof INSTALL_STEP, stepOptions: InstallStepOptions): this {
    let step = this.first;
    let i = 0;

    // No step, just push into array
    if (!step) {
      this.add(stepOptions);
      return this;
    }

    // Loop through the array until we find the step we want to add a new step afterwards
    while (step.id !== INSTALL_STEP[stepId]) {
      // No next step, just push into array
      if (!step.next) {
        this.add(stepOptions);
        return this;
      }

      step = step.next;
      i++;
    }

    // Add new step in array after the found step
    this.splice(++i, 0, this.createStep(stepOptions));

    // Update the current and next steps
    for (i; i <= this.length - 1; i++) {
      step = this[i];
      // Because of reordering, we can not use step.previous
      const prev = this[i - 1];

      if (step) {
        this[i] = this.createStep(step.options, prev);
      }
    }

    return this;
  }


  private createStep(stepOptions: InstallStepOptions, previous?: InstallStep): InstallStep {
    const prev = previous || this.last;
    const step = new InstallStep(stepOptions, prev);

    return step;
  }
}
