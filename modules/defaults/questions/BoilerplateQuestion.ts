import { Answers } from 'inquirer';

import Question from 'core/decorators/Question';
import cliMgr from 'core/CLIMgr';


@Question({
  type: 'list',
  name: 'boilerplate',
  message: 'What boilerplate would you like to install?',
  choices: ['react-spa', 'react-ssr', 'react-native'],
  default: '',
  beforeInstall: true,
})
class BoilerplateQuestion {
  when = (): boolean => {
    return cliMgr.getBoilerplate() ? false : true;
  }

  answer = (answers: Answers): void => {
    cliMgr.setBoilerplate(answers.boilerplate);
  }
}

export default BoilerplateQuestion;
