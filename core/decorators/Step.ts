import * as i from 'types';


function Step(options: StepOptions) {
  return function<T extends i.Newable> (constructor: T): T {
    return class extends constructor {
      name = options.name;
      after = options.after;
    };
  };
}

interface StepOptions {
  name: string;
  after?: string;
}

export default Step;
