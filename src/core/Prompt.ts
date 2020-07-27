import * as i from 'types';
import { injectable, inject } from 'inversify';
import { Answers, prompt } from 'inquirer';

import SERVICES from 'core/ioc/services';


@injectable()
export default class Prompt implements i.PromptType {
  private questions: Record<i.PromptWhen, i.CRPQuestion[]> = {
    pre: [],
    post: [],
  };

  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
  ) {
    for (const preq of this.beforeInstall()) {
      this.add('pre', preq);
    }

    for (const postq of this.afterInstall()) {
      this.add('post', postq);
    }
  }


  /** Prompt the user with questions */
  async ask(when: i.PromptWhen): Promise<Answers> {
    const answers = await prompt(this.questions[when]);

    return answers;
  }

  /** Act upon answers given by the user */
  async answer(when: i.PromptWhen, answers: Answers): Promise<void> {
    for await (const question of this.questions[when]) {
      question.answer?.(answers);
    }
  }


  protected beforeInstall(): i.CRPQuestion[] {
    return [];
  }

  protected afterInstall(): i.CRPQuestion[] {
    return [];
  }


  /** Add question to array */
  private add(when: i.PromptWhen, question: i.CRPQuestion): void {
    if (!question.isValidForOS) {
      return;
    }

    if (question.isOptional && this.cliMgr.skipOptionalQuestions) {
      return;
    }

    this.questions[when].push(question);
  }
}
