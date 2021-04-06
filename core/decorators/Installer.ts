import * as i from 'types';

import StepList from 'core/StepList';

import { CloneStep, NpmInstallStep } from 'modules/defaults/steps';


function Installer(options: i.InstallerOptions): <T extends i.Newable>(constructor: T) => T {
  const { questions, steps, ...opts } = options;


  const defaultSteps = [
    new CloneStep(),
    new NpmInstallStep(),
  ] as i.Step[];
  const customSteps = steps?.map((Step) => new Step() as i.Step);

  const stepList = new StepList();
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


  const questionsObj: i.QuestionsObj<i.Newable<i.Question>[]> = {
    before: [],
    after: [],
  };

  if (questions) {
    for (const Q of questions) {
      const question = new Q() as i.Question;

      if (question.options.beforeInstall) {
        questionsObj.before.push(Q);
      }
      if (question.options.afterInstall) {
        questionsObj.after.push(Q);
      }
    }
  }

  return function<T extends i.Newable> (constructor: T): T {
    return class extends constructor {
      name = opts.name;
      steps = stepList;
      questions = questionsObj;
    };
  };
}

export default Installer;
