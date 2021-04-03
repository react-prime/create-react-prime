import * as i from 'types';


class StepList extends Array<i.Step> {
  execute = (): void => {
    for (const step of this) {
      console.log('execute step', step);
      // step.on();
    }
  }
}

export default StepList;
