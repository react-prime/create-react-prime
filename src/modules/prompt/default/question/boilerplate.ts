import * as i from 'types';
import { ListChoiceOptions } from 'inquirer';
import color from 'kleur';

import Question from 'core/Question';


/** Ask user to select a boilerplate to install (if not given). */
export default class Boilerplate extends Question {
  /**
   * Question options
   */
  readonly type = 'list';
  readonly name = 'boilerplate';
  readonly message = 'What boilerplate would you like to install?';
  readonly choices: ListChoiceOptions[] = [];

  when = (): boolean => {
    return !this.cliMgr.installBoilerplate;
  }

  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();

    for (const repo in cliMgr.installationLangConfig.boilerplates) {
      const cfg = cliMgr.installationLangConfig.boilerplates[repo];
      const desc = color.dim(`(${cfg.description})`);

      this.choices.push({
        name: `${cfg.name} ${desc}`,
        value: cfg.name,
      });
    }
  }


  async answer(answers: { boilerplate: i.BoilerplateTypes }): Promise<void> {
    if (answers.boilerplate) {
      this.cliMgr.installBoilerplate = answers.boilerplate;
    }
  }
}
