import * as i from 'types';


class StepList extends Array<i.Step> {
  constructor(
    private args: i.InstallStepArgs,
  ) {
    super();
  }

  async execute(): Promise<void> {
    for await (const step of this) {
      await step.on(this.args);
    }
  }
}

export default StepList;
