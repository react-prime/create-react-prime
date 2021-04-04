import * as i from 'types';
import { Answers, prompt } from 'inquirer';

import BoilerplateQuestion from 'modules/defaults/questions/BoilerplateQuestion';
import ProjectNameQuestion from 'modules/defaults/questions/ProjectNameQuestion';


class Prompt {
  private questions: any[] = [];

  constructor(when: 'pre' | 'post') {
    if (when === 'pre') {
      this.questions = [
        new BoilerplateQuestion(),
        new ProjectNameQuestion(),
      ];
    }
  }

  async ask(): Promise<Answers> {
    let answers: Answers = {};
    const questions = this.questions as i.Question[];

    // Ask questions to user
    for await (const question of questions) {
      // Look for methods, call them with current answers and set the return value
      let prop: keyof i.QuestionOptions;
      for (prop in question.options) {
        // Let Inquirer call Validate
        if (typeof question.options[prop] === 'function' && prop !== 'validate') {
          question.options[prop] = question.options[prop](answers);
        }
      }

      // Ask question
      const answer: Answers = await prompt(question.options);

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

export default Prompt;
