import * as i from 'types';


class StepList extends Array<i.Step> {
  constructor() {
    super();
  }

  async execute(): Promise<void> {
    for await (const step of this) {
      await step.on({
        name: step.name,
        spinner: step.spinner,
      });
    }
  }
}

export default StepList;
