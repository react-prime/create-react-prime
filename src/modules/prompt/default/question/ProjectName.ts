import * as i from 'types';

import Validate from 'core/utils/Validate';
import { ERROR_TEXT } from 'core/constants';
import Question from 'core/Question';


/** Ask user to give the project a name if not given. */
export default class ProjectName extends Question {
  /**
   * Question options
   */
  readonly type = 'input';
  readonly name = 'name';
  readonly message = 'Project name';
  readonly default: string | undefined = '';

  when = (): boolean => {
    return !this.cliMgr.projectName;
  }

  constructor(
    protected cliMgr: i.CLIMgrType,
  ) {
    super();

    this.default = cliMgr.installationConfig?.repository;
  }


  validate(input: string): boolean | string {
    const validate = new Validate();

    if (validate.folderName(input)) {
      return true;
    }

    return ERROR_TEXT.Filename;
  }

  async answer(answers: { name: string }): Promise<void> {
    if (answers.name) {
      this.cliMgr.projectName = answers.name;
    }
  }
}
