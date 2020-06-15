import InstallStep, { InstallStepArgs } from './InstallStep';
import INSTALL_STEP from './InstallStep/steps';

export default class InstallSteps extends Array<InstallStep> {
  constructor() {
    super();
  }

  first(): InstallStep | undefined {
    return this[0];
  }

  last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  add(stepArgs: InstallStepArgs): this {
    this.push(this.createStep(stepArgs));

    return this;
  }

  addAfterStep(stepId: keyof typeof INSTALL_STEP, stepArgs: InstallStepArgs): this {
    let step = this.first();
    let i = 0;

    // No step, just push into array
    if (!step) {
      this.add(stepArgs);
      return this;
    }

    // Loop through the array until we find the step we want to add a new step afterwards
    while (step.id !== INSTALL_STEP[stepId]) {
      const next = step.next();

      // No next step, just push into array
      if (!next) {
        this.add(stepArgs);
        return this;
      }

      step = next;
      i++;
    }

    // Add new step in array after the found step
    this.splice(++i, 0, this.createStep(stepArgs));

    // Update the previous, current and next steps
    for (let j = i - 1; j < i + 2; j++) {
      // Should also be able to return undefined, but TS feels sure that it will return something
      const adjecent: InstallStep | undefined = this[j];

      if (adjecent) {
        this[j] = this.createStep(adjecent.args, this[j - 1]);
      }
    }

    return this;
  }


  private createStep(stepArgs: InstallStepArgs, previous?: InstallStep): InstallStep {
    const prev = previous || this.last();
    const step = new InstallStep(stepArgs, prev);

    return step;
  }
}
