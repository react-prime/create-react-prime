import * as i from 'types';
import { prompt, Answers } from 'inquirer';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';
import SelectEditor from './SelectEditor';


@injectable()
export default class Questions implements i.QuestionsType {
  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
  ) {}


  /**
   * List of questions to prompt
   */
  private readonly _questions: i.CRPQuestion[] = [
    new SelectEditor(this.cliMgr),
  ];


  /** Prompt the user with questions */
  async ask(): Promise<Answers> {
    const answers = await prompt(this.questions);

    return answers;
  }

  /** Act upon answers given by the user */
  async answer(answers: Answers): Promise<void> {
    for await (const question of this.questions) {
      question.answer?.(answers);
    }
  }


  /** Filter questions */
  private get questions(): i.CRPQuestion[] {
    const validQuestions: i.CRPQuestion[] = [];

    for (const question of this._questions) {
      if (question.isValidForOS) {
        validQuestions.push(question);
      }
    }

    return validQuestions;
  }
}
