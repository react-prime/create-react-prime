import * as i from 'types';


export default class StepList extends Array<i.Step> {
  constructor() {
    super();
  }

  async execute(args: i.InstallStepArgs): Promise<void> {
    for await (const step of this) {
      await step.on(args);
    }
  }
}
