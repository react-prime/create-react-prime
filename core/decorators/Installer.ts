import * as i from 'types';

import StepList from 'core/StepList';
import { CloneStep, NpmInstallStep } from 'modules/defaults/steps';


function Installer(options: i.InstallerOptions): <T extends i.Newable>(constructor: T) => T {
  const { prompts, steps, ...opts } = options;

  const defaultSteps = [
    new CloneStep(),
    new NpmInstallStep(),
  ] as i.Step[];
  const customSteps = steps?.map((Step) => new Step() as i.Step);
  const stepList = new StepList(opts);

  for (const step of defaultSteps) {
    stepList.push(step);

    if (customSteps) {
      for (const cStep of customSteps) {
        if (step.name === cStep.after) {
          stepList.push(cStep);
        }
      }
    }
  }

  return function<T extends i.Newable> (constructor: T): T {
    return class extends constructor {
      name = opts.name;
      steps = stepList;
    };
  };
}

export default Installer;
