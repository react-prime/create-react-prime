import * as i from 'types';

import Prompt from 'core/Prompt';

import * as defaultQuestions from 'modules/defaults/questions';


class MainPrompt extends Prompt {
  constructor() {
    const beforeInstallQuestions = [] as i.Newable<i.Question>[];
    const afterInstallQuestions = [] as i.Newable<i.Question>[];
    const questions = Object.values(defaultQuestions) as unknown as i.Newable<i.Question>[]; // Decorator type issue

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
