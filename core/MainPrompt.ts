import * as i from 'types';

import Prompt from 'core/Prompt';


class MainPrompt extends Prompt {
  constructor(questions: i.Newable[]) {
    const beforeInstallQuestions = [] as i.Newable<i.Question>[];
    const afterInstallQuestions = [] as i.Newable<i.Question>[];

    for (const Q of questions) {
      const question = new Q();

      if (question.options.beforeInstall) {
        beforeInstallQuestions.push(Q);
      }

      if (question.options.afterInstall) {
        afterInstallQuestions.push(Q);
      }
    }

    super({
      before: beforeInstallQuestions,
      after: afterInstallQuestions,
    });
  }
}

export default MainPrompt;
