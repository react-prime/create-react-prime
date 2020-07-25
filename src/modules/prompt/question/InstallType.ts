import * as i from 'types';
import { ListQuestion, ListChoiceOptions } from 'inquirer';
import color from 'kleur';

import Question from 'core/Question';


/**
 * Ask user to select a type to install if not given
 * */
export default class InstallType extends Question implements i.CRPQuestion<ListQuestion> {
  /**
   * Question options
   */
  readonly type = 'list';
  readonly name = 'type';
  readonly message = 'What boilerplate would you like to install?';
  readonly choices: ListChoiceOptions[] = [];

  when = (): boolean => {
    return !this.cliMgr.installType;
  }

  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();

    for (const repo in cliMgr.installationLangConfig.type) {
      const cfg = cliMgr.installationLangConfig.type[repo];
      const desc = color.dim(`(${cfg.description})`);

      this.choices.push({
        name: `${cfg.name} ${desc}`,
        value: cfg.name,
      });
    }
  }


  async answer(answers: { type: i.InstallTypes }): Promise<void> {
    if (answers.type) {
      this.cliMgr.installType = answers.type;
    }
  }
}
