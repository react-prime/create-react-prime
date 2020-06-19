import { InstallStepType, InstallStepListType } from './ioc';
import { InstallStepOptions } from './types';
import InstallStep from './InstallStep';

export default class InstallStepList extends Array<InstallStep> implements InstallStepListType {
  get last(): InstallStep | undefined {
    return this[this.length - 1];
  }

  /** Add a step at the end of the list */
  add(stepOptions: InstallStepOptions): this {
    this.push(this.createStep(stepOptions));

    return this;
  }

  /** Step factory */
  private createStep(
    stepOptions: InstallStepOptions, ...[prev, next]: [InstallStep?, InstallStep?]
  ): InstallStep {
    prev = prev || this.last;
    const step = new InstallStep(stepOptions, prev, next);

    return step;
  }
}
