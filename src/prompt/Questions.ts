import * as i from 'types';
import { prompt, Answers } from 'inquirer';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';


@injectable()
export default class Questions extends Array<i.CRPQuestion> implements i.QuestionsType {
  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
  ) {
    super();

    const questions = this.init();

    for (const question of questions) {
      this.add(question);
    }
  }


  init(): i.CRPQuestion[] { return []; }

  /** Prompt the user with questions */
  async ask(): Promise<Answers> {
    const answers = await prompt(this);

    return answers;
  }

  /** Act upon answers given by the user */
  async answer(answers: Answers): Promise<void> {
    for await (const question of this) {
      question.answer?.(answers);
    }
  }


  /** Add question to array */
  protected add(question: i.CRPQuestion): this {
    if (!question.isValidForOS) {
      return this;
    }

    if (question.isOptional && this.cliMgr.skipOptionalQuestions) {
      return this;
    }

    this.push(question);

    return this;
  }
}
