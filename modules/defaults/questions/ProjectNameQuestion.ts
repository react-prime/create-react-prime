import { Answers } from 'inquirer';

import { ERROR_TEXT } from 'core/constants';
import cliMgr from 'core/CLIMgr';
import Question from 'core/decorators/Question';
import Validate from 'core/Validate';


@Question({
  type: 'input',
  name: 'name',
  message: 'Project Name',
  beforeInstall: true,
})
export class ProjectNameQuestion {
  when = (): boolean => {
    return cliMgr.getProjectName() ? false : true;
  }

  default = (answers: Answers): string => {
    return cliMgr.getBoilerplate() || answers.boilerplate || '';
  }

  validate = (input: string): string | boolean => {
    const validate = new Validate();

    return validate.folderName(input)
      ? true
      : ERROR_TEXT.ProjectName;
  }

  answer = (answers: Answers): void => {
    cliMgr.setProjectName(answers.name);
  }
}
