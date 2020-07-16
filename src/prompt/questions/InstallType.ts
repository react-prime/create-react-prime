import * as i from 'types';
import { ListQuestion, ListChoiceOptions } from 'inquirer';
import { installerCfg } from 'installers/config';
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

  when = (): boolean => {
    return !this.cliMgr.installType;
  }

  choices: ListChoiceOptions[] = installerCfg.map((installer) => {
    const desc = this.text.gray(`(${installer.description})`);

    return {
      name: `${installer.name} ${desc}`,
      value: installer.name,
    };
  });


  /** Open an editor programatically */
  async answer(answers: { type: i.InstallType }): Promise<void> {
    if (answers.type) {
      this.cliMgr.installType = answers.type;
    }
  }


  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();
  }
}
