import * as i from 'types';
import { InputQuestion } from 'inquirer';
import Validate from 'utils/Validate';
import { ERROR_TEXT } from 'src/constants';
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

    if (validate.filename(input)) {
      return true;
    }

    return ERROR_TEXT.Filename;
  }

  /** Open an editor programatically */
  async answer(answers: { name: string }): Promise<void> {
    if (answers.name) {
      this.cliMgr.projectName = answers.name;
    }
  }
}
