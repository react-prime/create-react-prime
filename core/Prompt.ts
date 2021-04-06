import * as i from 'types';
import { Answers, prompt } from 'inquirer';


class Prompt {
  private questions: i.QuestionsObj<i.Question[]> = {
    before: [],
    after: [],
  };

  constructor(questions: i.QuestionsObj<i.Newable<i.Question>[]>) {
    this.questions = {
      before: questions.before.map((Q) => new Q()),
      after: questions.after.map((Q) => new Q()),
    };
  }

  async ask(when: i.QuestionWhen): Promise<Answers> {
    let answers: Answers = {};
    const questions = this.questions;

    // Ask questions to user
    for await (const question of questions[when]) {
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
