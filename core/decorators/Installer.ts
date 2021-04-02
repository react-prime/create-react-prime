import * as i from 'types';

import StepList from 'core/StepList';
import { CloneStep, NpmInstallStep } from 'core/steps';


function Installer(options: InstallerOptions) {
  const defaultSteps = [
      new CloneStep(options.repositoryUrl),
      new NpmInstallStep(),
  ] as i.Step[];
  const customSteps = options.steps.map((Step) => new Step()) as i.Step[];
  const steps = new StepList();

  for (const step of defaultSteps) {
      steps.push(step);

      for (const cStep of customSteps) {
          if (step.name === cStep.after) {
              steps.push(cStep);
          }
      }
  }

  return function<T extends i.Newable<any>>(constructor: T) {
      return class extends constructor {
          name = options.name;
          steps = steps;
      }
  }
}

interface InstallerOptions {
  name: string;
  repositoryUrl: string;
  steps: i.Newable<any>[];
}

export default Installer;
