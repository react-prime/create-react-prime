import * as i from 'types';


export default function Installer(options: i.InstallerOptions): <T extends i.Newable>(constructor: T) => T {
  const { questions, steps, ...opts } = options;


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
      options = opts;
      steps = steps;
      questions = questionsObj;
    };
  };
}
