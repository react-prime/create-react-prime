import * as i from 'types';
import { Answers, prompt } from 'inquirer';

import Validate from 'core/Validate';


export default class Prompt {
  private questions: i.QuestionsObj<i.Question[]> = {
    before: [],
    after: [],
  };

  constructor(questions: i.Newable<i.Question>[]) {
    const validate = new Validate();

    for (const Q of questions) {
      const q = new Q();

      // If no OS is given we continue
      // or if OS is given, check if we find a match with current system
      if (!q.options.OS || q.options.OS.some(validate.isOS)) {
        if (q.options.beforeInstall) {
          this.questions.before.push(q);
        }

        if (q.options.afterInstall) {
          this.questions.after.push(q);
        }
      }
    }
  }

  async ask(when: i.QuestionWhen): Promise<Answers> {
    let answers: Answers = {};

    // Ask questions to user
    for await (const question of this.questions[when]) {
      // Look for methods, call them with current answers and set the return value
      let prop: keyof i.QuestionOptions;
      for (prop in question.options) {
        // Let Inquirer call Validate
        if (typeof question.options[prop] === 'function' && prop !== 'validate') {
          question.options[prop] = question.options[prop](answers);
        }
      }

      // Ask question
      const answer: Answers = await prompt([question.options]);

      // Add answer to answers
      answers = {
        ...answers,
        ...answer,
      };

      // Respond to answer
      await question.answer(answers);
    }

    return answers;
  }
}
