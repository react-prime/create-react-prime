import * as i from 'types';


class StepList extends Array<i.Step> {
  constructor(
    private options: i.StepOptions,
  ) {
    super();
  }

  async execute(): Promise<void> {
    for await (const step of this) {
      await step.on(this.options);
    }
  }
}

export default StepList;
