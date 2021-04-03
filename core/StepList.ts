import * as i from 'types';


class StepList extends Array<i.Step> {
  constructor(
    private options: i.StepOptions,
  ) {
    super();
  }

  execute(): void {
    for (const step of this) {
      console.log('execute step', step);
      step.on(this.options);
    }
  }
}

export default StepList;
