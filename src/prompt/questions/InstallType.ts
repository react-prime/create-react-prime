import * as i from 'types';
import { ListQuestion, ListChoiceOptions } from 'inquirer';
import Question from './Question';


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

    let repo: i.InstallType;
    for (repo in cliMgr.installationConfigsForLang) {
      const cfg = cliMgr.installationConfigsForLang[repo];
      const desc = this.text.gray(`(${cfg.description})`);

      this.choices.push({
        name: `${cfg.name} ${desc}`,
        value: cfg.name,
      });
    }
  }


  /** Open an editor programatically */
  async answer(answers: { type: i.InstallType }): Promise<void> {
    if (answers.type) {
      this.cliMgr.installType = answers.type;
    }
  }
}
