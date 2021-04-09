import { Answers } from 'inquirer';

import Question from 'core/decorators/Question';
import cliMgr from 'core/CLIMgr';


@Question({
  type: 'list',
  name: 'boilerplate',
  message: 'What boilerplate would you like to install?',
  choices: cliMgr.getBoilerplateList,
  beforeInstall: true,
})
export class BoilerplateQuestion {
  when = (): boolean => {
    return cliMgr.getBoilerplate() ? false : true;
  }

  answer = (answers: Answers): void => {
    cliMgr.setBoilerplate(answers.boilerplate);
  }
}
