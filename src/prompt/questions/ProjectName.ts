import * as i from 'types';
import { InputQuestion } from 'inquirer';
import Question from './Question';


/**
 * Ask user to select a type to install if not given
 * */
export default class ProjectName extends Question implements i.CRPQuestion<InputQuestion> {
  /**
   * Question options
   */
  readonly type = 'input';
  readonly name = 'name';
  readonly message = 'Project name';

  when = (): boolean => {
    return !this.cliMgr.projectName;
  }


  /** Open an editor programatically */
  async answer(answers: { name: string }): Promise<void> {
    if (answers.name) {
      this.cliMgr.projectName = answers.name;
    }
  }


  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();
  }
}
