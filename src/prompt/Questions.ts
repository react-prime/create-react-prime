import * as i from 'types';
import { prompt, Answers } from 'inquirer';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';
import SelectEditor from './SelectEditor';


@injectable()
export default class Questions extends Array<i.CRPQuestion> implements i.QuestionsType {
  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
  ) {
    super();

    /**
     * List of questions to prompt
     */
    this.add(new SelectEditor(this.cliMgr));
  }


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
  private add(question: i.CRPQuestion): this {
    if (question.isValidForOS) {
      this.push(question);
    }

    return this;
  }
}
